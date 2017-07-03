///<reference path="../PageBase.ts" />

module hj.library.pages {
    export class BorrowBooksViewModel extends PageBase {
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
            detailFormatter: this.detailFormatter
        };
        public booksDataSource = ko.observableArray([]);
        public usersDataSource = ko.observableArray([]);
        public selectedBooks: KnockoutObservableArray<any> = ko.observableArray([]);
        public selectedUser: KnockoutObservable<any> = ko.observable(null);

        // TODO: Control Borrow button's state
        // If selected user is not null, has more than 1 books selected
        // User borrowed books number is less than maximum number, User doens't have books that expired and not returned


        // TODO: For books that available copies are 0, make the row is not selectable and UI be kind of different from normal ones

        constructor() {
            super();
            this.templateId = borrows.BorrowBooksViewId;
            this.title("Borrow Books");
            this.intialize();
        }

        private refreshBooksSelection = (selectedRows: any) => {
            this.selectedBooks(selectedRows);
        }

        private detailFormatter = (index, row, element: JQuery) => {
            element.html(books.BookDetailsTemplateView);
            ko.applyBindings(row, element.get(0));
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
            }).done((books) => {
                this.booksDataSource(books);
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
                this.usersDataSource(users);
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
                    userId: Application.instance.sessionUser().id,
                    startDate: new Date(Date.now()),
                    endDate: new Date() // Default date: 1/1/1970
                })
            }).done(() => {
                this.initializeBooks().fail((jqXhr: JQueryXHR) => {
                    var error: IError = new Error("Failed to initialize books list.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error, null, this);
                });
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