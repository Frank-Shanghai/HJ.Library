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

        public queryData: KnockoutObservable<IQueryData> = ko.observable({
            Keyword: this.keyword(),
            KeywordFields: this.selectedKeywordFilterFields(),
            StartDate: this.startDate(),
            EndDate: this.endDate(),
            DateQueryOptions: this.selectedDateTypes()
        });

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
            sortName: 'endDate',
            sortOrder: 'desc',
            pagination: true,
            pageNumber: 1,
            pageSize: 4,
            pageList: [4, 10, 20, 50, 100],
            detailView: true,
            detailFormatter: (index, row, element: JQuery) => {
                element.html(books.BookDetailsTemplateView);
                ko.applyBindings(row.book, element.get(0));
            },
            sidePagination: 'server',
            url: '/api/borrows/records/includeAll',
            onLoadError: (status: any, res: any) => {
                if (status === 0) return;
                // One issue here: when refreshing table for more than 1 times, it will trigger this onLoadError event
                // But by debugging, actually there are no errors, and the status code is 0. So use this workaround here

                var error: IError = new Error("Failed to get books list.");
                error.raw = res.responseText;

                ErrorHandler.report(error, null, this);
            },
            method: "post",
            customQueryParameters: this.queryData
        };


        constructor() {
            super();
            this.templateId = borrows.BorrowingRecordsViewId;
            this.title("Borrowing Records");
        }

        private search() {
            //var t = moment(new Date()).tois
            this.queryData({
                Keyword: this.keyword(),
                KeywordFields: this.selectedKeywordFilterFields(),
                StartDate: this.startDate(),
                EndDate: this.endDate(),
                //StartDate: new Date(moment(this.startDate()).utc().zone(-8).format("MM/DD/YYYY")),
                //EndDate: new Date(moment(this.endDate()).utc().zone(-8).format("MM/DD/YYYY")),
                DateQueryOptions: this.selectedDateTypes()
            });
        }

        private clear() {
            this.keyword('');
            this.selectedKeywordFilterFields.removeAll();
            this.selectedDateTypes.removeAll();
            this.endDate(new Date());
            this.startDate(new Date(this.endDate().getTime() - Application.instance.userMaximumTimespan * 24 * 60 * 60 * 1000));

            this.queryData({
                Keyword: this.keyword(),
                KeywordFields: this.selectedKeywordFilterFields(),
                StartDate: this.startDate(),
                EndDate: this.endDate(),
                DateQueryOptions: this.selectedDateTypes()
            });
        }

        private toggleSearchPanel() {
            this.isSearchPanelVisible(!this.isSearchPanelVisible());
        }
    }
}