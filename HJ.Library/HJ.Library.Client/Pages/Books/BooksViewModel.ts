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
            let booksUnableToDelete = [];

            InformationHandler.report({
                title: "Delete",
                header: "Please Confirm",
                message: "Are you sure you want to delete the selected record(s)?",
                isOKButtonVisible: true,
                okButtonText: "Delete",
                isCancelButtonVisible: true,
                cancelButtonText: "Cancel",
                onConfirm: () => {
                    removeBooks();
                }
            }, this);

            var removeBooks = () => {
                this.isProcessing(true);
                booksUnableToDelete = [];
                let promises = [];
                for (let i = 0; i < this.selectedBooks().length; i++) {
                    let promise = () => {
                        let deferredObject = $.Deferred();
                        $.ajax({
                            type: 'get',
                            url: '/api/borrows/book/' + this.selectedBooks()[i].bookId + '/notReturned'
                        }).done((data: any) => {
                            if (data) {
                                booksUnableToDelete.push(this.selectedBooks()[i].name);
                            }
                            deferredObject.resolve();
                        }).fail((jqXhr: any, textStatus: any, err: any) => {
                            deferredObject.reject(jqXhr, textStatus, err);
                        });

                        return deferredObject.promise();
                    };

                    promises.push(promise());
                }

                $.when.apply($, promises).done((data) => {
                    if (booksUnableToDelete.length > 0) {
                        let bookNames = booksUnableToDelete.toString();
                        InformationHandler.report({
                            title: "Failed to delete",
                            header: "Please Confirm",
                            message: "You couldn't delete books [" + bookNames + "] since they are borrowed by some users and not returned yet.",
                            isOKButtonVisible: true,
                            okButtonText: "OK",
                            isCancelButtonVisible: false,
                            cancelButtonText: "Cancel",
                            onConfirm: () => {                                
                            }
                        }, this);
                    }
                    else {
                        doRemoveBooks();
                    }            
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to remove selected books.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error, null, this);
                }).always(() => {
                    this.isProcessing(false);
                });
            };

            var doRemoveBooks = () => {
                this.isProcessing(true);
                let promises = [];
                for (let i = 0; i < this.selectedBooks().length; i++) {
                    // $.ajax(..) return JQueryXHR, JQueryXHR is one sub-class of JQueryPromise<any>
                    // so the way here to handle promise is correct
                    let promise = () => {
                        let deferredObject = $.Deferred();
                        $.ajax({
                            type: 'delete',
                            url: '/api/books/' + this.selectedBooks()[i].bookId
                        }).done(() => {
                            deferredObject.resolve();
                        }).fail((jqXhr: any, textStatus: any, err: any) => {
                            deferredObject.reject(jqXhr, textStatus, err);
                        });

                        return deferredObject.promise();
                    };

                    promises.push(promise());
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