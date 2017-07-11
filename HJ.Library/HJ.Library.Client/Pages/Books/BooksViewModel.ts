///<reference path="../PageBase.ts" />

module hj.library.pages {
    export class BooksViewModel extends PageBase {
        public gridOptions = {
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
            detailFormatter: (index, row, element: JQuery) => {
                element.html(books.BookDetailsTemplateView);
                ko.applyBindings(row, element.get(0));
            }
        };

        public selectedBooks: KnockoutObservableArray<any> = ko.observableArray([]);
        public dataSource = ko.observableArray([]);

        constructor() {
            super();
            this.templateId = books.BooksViewId;
            this.title("Books");
            this.refreshDataGrid();
        }

        private refreshSelection = (selectedRows: any) => {
            this.selectedBooks(selectedRows);
        }

        private refreshDataGrid() {
            this.isProcessing(true);
            $.ajax({
                type: 'get',
                accepts: 'application/json',
                url: '/api/books'
            }).done((books) => {
                this.dataSource(books);
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to load book list.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }

        private add = () => {
            this.space.addPage(new EditBookViewModel(), null);
            //Application.instance.activePage(new EditBook());
        }

        private edit = (bookId: string) => {
            this.space.addPage(new EditBookViewModel(this.selectedBooks()[0].bookId), null);
            //Application.instance.activePage(new EditBook(this.selectedBooks()[0].bookId));
        }

        private remove = () => {
            //TODO: 
            // 2. Check if it is borrowed by any users/readers, handle these things first and then delete it
            InformationHandler.report({
                title: "Delete",
                header: "Please Confirm",
                message: "Are you sure you want to delete the selected record(s)?",
                isOKButtonVisible: true,
                okButtonText: "Delete",
                isCancelButtonVisible: true,
                cancelButtonText: "Cancel",
                onConfirm: () => {
                    removeHandler();
                }
            }, this);

            var removeHandler = () => {
                this.isProcessing(true);
                var promises = [];
                for (var i = 0; i < this.selectedBooks().length; i++) {
                    var promise = $.ajax({
                        type: 'delete',
                        url: '/api/books/' + this.selectedBooks()[i].bookId
                    })

                    promises.push(promise);
                }

                $.when.apply($, promises).done((data) => {
                    this.refreshDataGrid();
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to remove selected books.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error, null, this);
                }).always(() => {
                    this.isProcessing(false);
                });
            }
        }
    }
}