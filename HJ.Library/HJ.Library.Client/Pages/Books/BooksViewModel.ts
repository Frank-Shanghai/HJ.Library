///<reference path="../PageBase.ts" />

module hj.library.pages {
    export class BooksViewModel extends PageBase {
        public gridOptions = ko.observable(null);
        public selectedBooks: KnockoutObservableArray<any> = ko.observableArray([]);

        constructor() {
            super();
            this.templateId = books.BooksViewId;
            this.title("Books");
            this.initialize();
        }

        private refreshSelection = (selectedRows: any) => {
            this.selectedBooks(selectedRows);
        }

        private detailFormatter = (index, row, element: JQuery) => {
            element.html(books.BookDetailsView);
            ko.applyBindings(row, element.get(0));
        }

        private initialize() {
            $.ajax({
                type: 'get',
                accepts: 'application/json',
                url: '/api/books'
            }).done((books) => {
                this.gridOptions({
                    data: books,
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
                });
            }).fail((jqXhr: any, textStatus: any, err: any) => {
                alert(err.message);
            });
        }
    }
}