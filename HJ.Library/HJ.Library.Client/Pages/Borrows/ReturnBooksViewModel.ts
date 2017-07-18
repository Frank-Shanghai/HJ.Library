module hj.library.pages {
    export class ReturnBooksViewModel extends PageBase {
        public borrowsDataSource = ko.observableArray([]);
        public usersDataSource = ko.observableArray([]);
        public selectedBorrows: KnockoutObservableArray<any> = ko.observableArray([]);
        public selectedUserId: KnockoutObservable<any> = ko.observable(null);
        public selectedUser = ko.pureComputed(() => {
            for (var i = 0; i < this.usersDataSource().length; i++) {
                if (this.usersDataSource()[i].id === this.selectedUserId()) {
                    return this.usersDataSource()[i];
                }
            }
        });

        public borrowsGridOptions = {
            columns: [
                {
                    checkbox: true
                },
                {
                    title: 'Book Title',
                    formatter: (value, row) => {
                        return row.book.name;
                    }
                },
                {
                    title: 'Author',
                    formatter: (value, row) => {
                        return row.book.author;
                    }
                },
                {
                    title: 'Borrowed Date',
                    field: "startDate",
                    formatter: (value) => {
                        return moment(value).format("MM-DD-YYYY");
                    }
                },
                {
                    title: "Latest Return Date",
                    field: 'startDate',
                    formatter: (value) => {
                        var latestReturnDate = (new Date(value)).getTime() + Application.instance.userMaximumTimespan * 24 * 60 * 60 * 1000;
                        if (Date.now() > latestReturnDate) {
                            return moment(latestReturnDate).format("MM-DD-YYYY") + '  EXPIRED!';
                        }

                        return moment(latestReturnDate).format("MM-DD-YYYY");
                    }
                }
            ],
            striped: true,
            sortable: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            clickToSelect: true,
            detailView: true,
            detailFormatter: (index, row, element: JQuery) => {
                element.html(books.BookDetailsTemplateView);
                ko.applyBindings(row.book, element.get(0));
            }
        };

        public userListOptions = {
            data: this.usersDataSource,
            placeholder: "select a user",
            select: this.selectedUserId
        };

        public canReturnBook: KnockoutComputed<boolean> = ko.pureComputed<boolean>(() => {
            if (this.selectedUserId() && this.selectedBorrows().length > 0) {
                return true;
            }

            return false;
        });

        // TODO: Add confirming dialog, show user, and books to return

        constructor() {
            super();
            this.templateId = borrows.ReturnBooksViewId;
            this.title("Return Books");
            this.intialize();
            this.selectedUserId.subscribe((newValue) => {
                this.initializeBorrows();
            });
        }

        private refreshBorrowsSelection = (selectedRows: any) => {
            this.selectedBorrows(selectedRows);
        }

        private intialize() {
            this.isProcessing(true);
            this.initializeUsers().done(() => {
                this.borrowsDataSource.removeAll();
            }).fail((jqXhr: JQueryXHR) => {
                var error: IError = new Error("Failed to initialize return books page.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }

        private initializeBorrows() {
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/api/borrows/user/' + this.selectedUserId()
            }).done((borrows: Array<any>) => {
                this.borrowsDataSource.removeAll();
                if (borrows) {
                    borrows.forEach((borrow) => {
                        if ((new Date(borrow.endDate)).getFullYear() === 1970) {//TODO: Enable endData column to null to update chekcing condition here 
                            this.borrowsDataSource.push(borrow);
                        }
                    });
                }
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to get books list.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            });
        }

        private initializeUsers() {
            var deferredObj = $.Deferred<any>();
            $.ajax({
                type: 'get',
                accepts: "application/json",
                url: '/api/accounts/users'
            }).done((users: Array<any>) => {
                this.usersDataSource.removeAll();
                users.forEach((user) => {
                    if (user.borrowedBooksCount > 0) {
                        this.usersDataSource.push($.extend(user, {
                            text: user.firstName + ' ' + user.lastName + ' [' + user.email + ']'
                        }));
                    }
                });
                deferredObj.resolve(null);
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                deferredObj.reject(jqXhr, textStatus, err);
            });

            return deferredObj.promise();
        }

        private returnBooks = () => {
            this.isProcessing(true);

            var promises = [];

            // 问题描述：如果使用默认的异步ajax，导致：
            // 当选定一个用户，将其所借的多本书一次归还的时候，这个user的BorrowedBooksCount只被减了1，应该是减去所还书的数量。

            // 原因：
            // 因为，这多个ajax call到服务器端，都要更新用户的BorrowedBooksCount列的值。如果使用异步，
            // 第一次取出这个user，在更新到数据库之前，第二，三次的request已经到了服务端，并也取出了user。这样，每个request中的user的BorrowedBooksCount都是3（假设借了三本书），
            // 那么虽然三次request中都完成了更新，但所完成的更新却都是3 - 1，所以最后导致好像只更新了一次似的。
            // 这就是一个服务器端的并发的问题。

            // 解决方案：
            // A. 客户端处理。把ajax call改为同步。这样，每当一个ajax request完成之后才会开始第二个ajax request. 从而保证数据的一致性。
            // http://blog.csdn.net/duomoluo/article/details/50492822
            // 只需要在发送request之前，把$.ajaxSettings.async设置成false，待所有request完成之后再设置回true。
            // 好处： 简单省事。
            // 坏处： 会block UI/Browser. 数据量少可以用，数据多时不可取。
            // 另外，不能解决根本问题。当从不同客户端发起request时，这两个不同的客户端的request可以同时发送，导致并发问题，数据更新出错。
            // 为了解决这个问题，已经在book和borrow表中加了RowVersion列，是一个TimeStamp类型，从而可以利用EF的Optimistic Concurrency checking。当出现并发冲突时，抛出异常。

            // B. 服务器端处理并发。见BorrowsController.cs中详解。使用了.net lock语句来让多线程等待。
            // http://www.cnblogs.com/leslies2/archive/2012/07/30/2608784.html
            // 坏处： 一样会block。
            // 好处： 这其实是EF的Pessimistic Concurrency的实现方式之一。可以避免Optimistic Concurrency的发生。

            // 总结： 对于并发问题及解决方案，还有很多内容要了解。MSMQ (Message Queuing)...等等等等。
            // 见OneNote中"并发/Concurrency"页中的更多链接内容。

            //$.ajaxSettings.async = false;

            for (var i = 0; i < this.selectedBorrows().length; i++) {
                var borrow = this.selectedBorrows()[i];
                borrow.endDate = (new Date(Date.now())).toJSON();

                var promise = () => {
                    var deferredObject = $.Deferred();

                    $.ajax({
                        type: 'put',
                        contentType: 'application/json',
                        data: JSON.stringify(borrow),
                        url: '/api/borrows/' + borrow.borrowId
                    }).done(() => {
                        deferredObject.resolve();
                    }).fail((jqXhr: any, textStatus: any, err: any) => {
                        deferredObject.reject(jqXhr, textStatus, err);
                    });

                    return deferredObject.promise();
                };

                promises.push(promise());
            }

            //$.ajaxSettings.async = true;

            $.when.apply($, promises).done(() => {
                this.intialize();
            }).fail((jqXhr: JQueryXHR) => {
                var error: IError = new Error("Failed to return books.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }
    }
}