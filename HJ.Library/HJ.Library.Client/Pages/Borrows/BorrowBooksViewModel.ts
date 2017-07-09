///<reference path="../PageBase.ts" />

module hj.library.pages {
    export class BorrowBooksViewModel extends PageBase {
        public booksDataSource = ko.observableArray([]);
        public usersDataSource = ko.observableArray([]);
        public selectedBooks: KnockoutObservableArray<any> = ko.observableArray([]);
        public selectedUserId: KnockoutObservable<any> = ko.observable(null);
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
            if (this.selectedUserId() && this.selectedBooks().length > 0) {
                return true;
            }

            return false;
        });

        // TODO: Update borrow method and server API to allow borrow multiple books at once
        // TODO: When user selected, update a message display how many books this user can borrow, and 
        // control the borrow button state and display message (beside the button) based on this number

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
                    this.usersDataSource.push({
                        id: user.id,
                        text: user.firstName + ' ' + user.lastName + ' [' + user.email + ']',
                        disabled: user.borrowedBooksCount >= 3
                    });
                });
                deferredObj.resolve(null);
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                deferredObj.reject(jqXhr, textStatus, err);
            });

            return deferredObj.promise();
        }

        private borrowBooks = () => {
            this.isProcessing(true);
            $.ajax({
                type: 'post',
                contentType: 'application/json',
                url: '/api/borrows',
                data: JSON.stringify({
                    borrowId: Utils.guid(),
                    bookId: this.selectedBooks()[0].bookId,
                    userId: this.selectedUserId(),
                    startDate: new Date(Date.now()),
                    endDate: new Date() // Default date: 1/1/1970
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