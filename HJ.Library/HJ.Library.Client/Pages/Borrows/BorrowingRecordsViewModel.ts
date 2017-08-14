module hj.library.pages {
    export enum BorrowingRecordKeywordOption {
        All = 0,
        UserName = 1,
        UserEmail = 2,
        BookTitle = 3,
        BookAuthor = 4,
        ISBN = 5,
        BookOwner = 6
    }

    export enum BorrowingRecordDateQueryOption {
        BorrowedDate = 1,
        ReturnedDate = 2
    }

    export interface IQueryData {
        Keyword: string;
        KeywordFields: Array<BorrowingRecordKeywordOption>;
        StartDate: Date;
        EndDate: Date;
        DateQueryOptions: Array<BorrowingRecordDateQueryOption>;
    }

    export class BorrowingRecordsViewModel extends PageBase {
        public gridOptions = {
            columns: [
                {
                    title: "User Name",
                    sortable: true,
                    formatter: (value, row) => {
                        return row.user.firstName + ' ' + row.user.lastName;
                    }
                },
                {
                    title: "Email",
                    sortable: true,
                    formatter: (value, row) => {
                        return row.user.email;
                    }
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
                    title: "Returned Date",
                    field: 'endDate',
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
            detailView: true,
            detailFormatter: (index, row, element: JQuery) => {
                element.html(books.BookDetailsTemplateView);
                ko.applyBindings(row.book, element.get(0));
            }
        };
        public dataSource = ko.observableArray([]);
        public isSearchPanelVisible = ko.observable(false);

        public keyword = ko.observable('');
        public selectedKeywordFilterFields = ko.observableArray([]);
        public keywordFilterOptions = {
            data: [
                { id: BorrowingRecordKeywordOption.UserName, text: "User Name" },
                { id: BorrowingRecordKeywordOption.UserEmail, text: "User Email" },
                { id: BorrowingRecordKeywordOption.BookTitle, text: "Book Title" },
                { id: BorrowingRecordKeywordOption.BookAuthor, text: "Book Author" },
                { id: BorrowingRecordKeywordOption.ISBN, text: "ISBN" },
                { id: BorrowingRecordKeywordOption.BookOwner, text: "Book Owner" },
                { id: BorrowingRecordKeywordOption.All, text: "All" }
            ],
            placeholder: "Select fields to filt",
            select: this.selectedKeywordFilterFields,
            multiple: true
        };

        public endDate = ko.observable<Date>(new Date());
        public startDate = ko.observable<Date>(new Date(this.endDate().getTime() - Application.instance.userMaximumTimespan * 24 * 60 * 60 * 1000));
        public selectedDateTypes = ko.observableArray([]);
        public dateQueryOptions = {
            data: [
                { id: BorrowingRecordDateQueryOption.BorrowedDate, text: "Borrowed Date" },
                { id: BorrowingRecordDateQueryOption.ReturnedDate, text: "Returned Date" }
            ],
            placeholder: "Select date type",
            multiple: true,
            select: this.selectedDateTypes
        };

        public queryData: IQueryData = {
            Keyword: this.keyword(),
            KeywordFields: this.selectedKeywordFilterFields(),
            StartDate: this.startDate(),
            EndDate: this.endDate(),
            DateQueryOptions: this.selectedDateTypes()
        };

        constructor() {
            super();
            this.templateId = borrows.BorrowingRecordsViewId;
            this.title("Borrowing Records");
            this.refreshData();
        }

        private refreshData() {
            this.isProcessing(true);
            $.ajax({
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(this.queryData),
                url: '/api/borrows/records/includeAll'
            }).done((borrows: Array<any>) => {
                this.dataSource(borrows);
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to get books list.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }

        private search() {
            this.queryData.Keyword = this.keyword();
            this.queryData.KeywordFields = this.selectedKeywordFilterFields();
            this.queryData.DateQueryOptions = this.selectedDateTypes();
            this.queryData.StartDate = this.startDate();
            this.queryData.EndDate = this.endDate();

            this.refreshData();
        }

        private clear() {
            this.keyword('');
            this.selectedKeywordFilterFields.removeAll();
            this.selectedDateTypes.removeAll();
            this.endDate(new Date());
            this.startDate(new Date(this.endDate().getTime() - Application.instance.userMaximumTimespan * 24 * 60 * 60 * 1000));
        }

        private toggleSearchPanel() {
            this.isSearchPanelVisible(!this.isSearchPanelVisible());
        }
    }
}