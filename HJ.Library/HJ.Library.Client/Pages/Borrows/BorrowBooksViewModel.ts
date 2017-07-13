///<reference path="../PageBase.ts" />

module hj.library.pages {
    export class BorrowBooksViewModel extends PageBase {
        public booksDataSource = ko.observableArray([]);
        public usersDataSource = ko.observableArray([]);
        public selectedBooks: KnockoutObservableArray<any> = ko.observableArray([]);
        public selectedUserId: KnockoutObservable<any> = ko.observable(null);
        public selectedUser = ko.pureComputed(() => {
            for (var i = 0; i < this.usersDataSource().length; i++) {
                if (this.usersDataSource()[i].id === this.selectedUserId()) {
                    return this.usersDataSource()[i];
                }
            }
        });

        public isBookCountLimitMessageVisible = ko.pureComputed(() => {
            if (this.selectedUser()) {
                if (Application.instance.userMaximumBookCount - this.selectedUser().borrowedBooksCount < this.selectedBooks().length) {
                    return true;
                }
            }

            return false;
        });

        public booksGridOptions = {
            columns: [
                {
                    checkbox: true
                },
                {
                    title: 'Title',
                    field: 'name'
                },
                {
                    title: 'Author',
                    field: 'author'
                },
                {
                    title: 'Publisher',
                    field: "publisher"
                },
                {
                    title: "Publication Date",
                    field: 'publicationDate',
                    formatter: (value) => {
                        return moment(value).format("MM-DD-YYYY");
                    }
                },
                {
                    title: "Copies",
                    field: "copies"
                },
                {
                    title: "Available Copies",
                    field: "availableCopies"
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
                ko.applyBindings(row, element.get(0));
            }
        };

        public userListOptions = {
            data: this.usersDataSource,
            placeholder: "select a user",
            select: this.selectedUserId
        };

        public canBorrowBook: KnockoutComputed<boolean> = ko.pureComputed<boolean>(() => {
            if (this.selectedUserId() && this.selectedBooks().length > 0 && !this.isBookCountLimitMessageVisible()) {
                return true;
            }

            return false;
        });

        // TODO: Add confirming dialog, show user, and books

        constructor() {
            super();
            this.templateId = borrows.BorrowBooksViewId;
            this.title("Borrow Books");
            this.intialize();
        }

        private refreshBooksSelection = (selectedRows: any) => {
            this.selectedBooks(selectedRows);
        }

        private intialize() {
            this.isProcessing(true);
            $.when(this.initializeBooks(), this.initializeUsers()).pipe(function () {
                return Array.prototype.slice.call(arguments);
            }).fail((jqXhr: JQueryXHR) => {
                var error: IError = new Error("Failed to initialize borrows page.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }

        private initializeBooks() {
            var deferredObj = $.Deferred<any>();
            $.ajax({
                type: 'get',
                accepts: 'application/json',
                url: '/api/books'
            }).done((books: Array<any>) => {
                this.booksDataSource(books.filter((value: any) => {
                    return value.availableCopies > 0;
                }));
                deferredObj.resolve(null);
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                deferredObj.reject(jqXhr, textStatus, err);
            });

            return deferredObj.promise();
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
                    this.usersDataSource.push($.extend(user, {
                        text: user.firstName + ' ' + user.lastName + ' [' + user.email + ']',
                        disabled: user.borrowedBooksCount >= Application.instance.userMaximumBookCount
                    }));
                });
                deferredObj.resolve(null);
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                deferredObj.reject(jqXhr, textStatus, err);
            });

            return deferredObj.promise();
        }

        private borrowBooks = () => {
            this.isProcessing(true);

            var books = [];
            this.selectedBooks().forEach((book) => {
                books.push(book.bookId);
            });

            $.ajax({
                type: 'post',
                contentType: 'application/json',
                url: '/api/borrows',
                data: JSON.stringify({
                    UserId: this.selectedUserId(),
                    Books: books
                })
            }).done(() => {
                this.intialize();
            }).fail((jqXhr: JQueryXHR) => {
                var error: IError = new Error("Failed to borrow books.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }
    }
}