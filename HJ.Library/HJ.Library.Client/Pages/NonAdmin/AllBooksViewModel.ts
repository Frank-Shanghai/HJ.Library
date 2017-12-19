module hj.library.pages {
    export class AllBooksViewModel extends PageBase {
        public gridOptions = {
            columns: [
                {
                    title: 'Title',
                    field: 'name',
                    sortable: true
                },
                {
                    title: 'Author',
                    field: 'author',
                    sortable: true
                },
                {
                    title: 'Publisher',
                    field: "publisher",
                    sortable: true
                },
                {
                    title: "Publication Date",
                    field: 'publicationDate',
                    formatter: (value) => {
                        return moment(value).format("MM-DD-YYYY");
                    },
                    sortable: true
                },
                {
                    title: "Available Copies",
                    field: "availableCopies",
                    formatter: (value) => {
                        return "<span style='color: white'>" + value + "</span>";
                    },
                    // cellStyle doc and demo
                    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
                    // http://blog.csdn.net/menghuannvxia/article/details/51980699
                    cellStyle: (value) => {
                        if(value == '0')
                        return {
                            css: {
                                'background-color': '#f92f39'
                            }
                            };

                        return {
                            css: {
                                'background-color': '#8fa65d'
                            }
                        };
                    },
                    sortable: true
                }
            ],
            striped: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 3,
            pageList: [3, 10, 20, 50, 100],
            clickToSelect: true,
            detailView: true,
            detailFormatter: (index, row, element: JQuery) => {
                element.html(books.BookDetailsTemplateView);
                ko.applyBindings(row, element.get(0));
            }
        };
        private dataSourceFromServer = [];
        public dataSource = ko.observableArray([]);

        constructor() {
            super();
            this.templateId = pages.nonadmin.AllBooksViewId;
            this.title("All Books");
            this.searchBooks();

            this.onlyDisplayAvailableBooks.subscribe(this.toggleOnlyDisplayAvailaleBooks);
        }

        public onlyDisplayAvailableBooks = ko.observable(false);
        public keyword = ko.observable('');
        public selectedKeywordFilterFields = ko.observableArray([]);
        public keywordFilterOptions = {
            data: [
                { id: BooksQueryOption.Title, text: "Title" },
                { id: BooksQueryOption.Author, text: "Author" },
                { id: BooksQueryOption.ISBN, text: "ISBN" },
                { id: BooksQueryOption.Publisher, text: "Publisher" },
                { id: BooksQueryOption.All, text: "All" }
            ],
            placeholder: "Select fields to filt",
            select: this.selectedKeywordFilterFields,
            multiple: true
        };

        private toggleOnlyDisplayAvailaleBooks = (value) => {
            if (value === true) {
                this.dataSource(this.dataSourceFromServer.filter((value: any) => {
                    return value.availableCopies > 0;
                }));
            }
            else {
                this.dataSource(this.dataSourceFromServer);
            }
        }

        private searchBooks() {
            this.isProcessing(true);
            $.ajax({
                type: 'get',
                contentType: "application/json",
                data: {
                    queryString: JSON.stringify({
                        keyword: this.keyword(),
                        queryOptions: this.selectedKeywordFilterFields()
                    })
                },
                url: '/api/books/query'
            }).done((books: Array<any>) => {
                this.dataSourceFromServer = books;
                this.toggleOnlyDisplayAvailaleBooks(this.onlyDisplayAvailableBooks());
            }).fail((jqXhr: JQueryXHR) => {
                var error: IError = new Error("Failed to query books.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }
    }
}