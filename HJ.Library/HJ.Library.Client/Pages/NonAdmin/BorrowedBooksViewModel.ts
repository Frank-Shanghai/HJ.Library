module hj.library.pages {
    export class BorrowedBooksViewModel extends PageBase {
        public borrowsGridOptions = {
            columns: [
                {
                    title: 'Book Title',
                    formatter: (value, row) => {
                        return row.book.name;
                    },
                    sortable: true
                },
                {
                    title: 'Author',
                    formatter: (value, row) => {
                        return row.book.author;
                    },
                    sortable: true
                },
                {
                    title: 'Borrowed Date',
                    field: "startDate",
                    formatter: (value) => {
                        return moment(value).format("MM-DD-YYYY");
                    },
                    sortable: true
                },
                {
                    title: "Latest Return Date",
                    field: 'startDate',
                    formatter: (value) => {
                        var latestReturnDate = (new Date(value)).getTime() + Application.instance.userMaximumTimespan * 24 * 60 * 60 * 1000;
                        if (Date.now() > latestReturnDate) {
                            return "<span style='color: red; font-weight: 700'>" + moment(latestReturnDate).format("MM-DD-YYYY") + '  EXPIRED!' + "</span>";
                        }

                        return moment(latestReturnDate).format("MM-DD-YYYY");
                    },
                    sortable: true
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
        public borrowsDataSource = ko.observableArray([]);

        constructor() {
            super();
            this.templateId = pages.nonadmin.BorrowedBooksViewId;
            this.title("Borrowed Books");
            this.loadBorrowedBooks();
        }

        private loadBorrowedBooks() {
            this.isProcessing(true);
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/api/borrows/user/' + Application.instance.sessionUser().userId + '/notReturned'
            }).done((borrows: Array<any>) => {
                this.borrowsDataSource(borrows);
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to get books list.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }
    }
}