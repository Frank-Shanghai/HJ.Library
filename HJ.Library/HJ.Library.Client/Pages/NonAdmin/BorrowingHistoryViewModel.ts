module hj.library.pages {
    export interface IIndividualBorrowingLoanQueryData {
        UserId: string;
        StartDate: Date;
        EndDate: Date;
        DateQueryOptions: Array<BorrowingRecordDateQueryOption>;
    }

    export class BorrowingHistoryViewModel extends PageBase {
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

        public queryData = ko.observable<IIndividualBorrowingLoanQueryData>(
            {
                UserId: hj.library.Application.instance.sessionUser().userId,
                StartDate: this.startDate(),
                EndDate: this.endDate(),
                DateQueryOptions: this.selectedDateTypes()
            }
        );

        public gridOptions = {
            columns: [
                {
                    title: 'Book Title',
                    field: 'book.name',
                    //formatter: (value, row) => {
                    //    return row.book.name;
                    //},
                    sortable: true
                },
                {
                    title: 'Author',
                    field: 'book.author',
                    //formatter: (value, row) => {
                    //    return value.author;
                    //},
                    sortable: true
                },
                {
                    title: 'Publisher',
                    field: 'book.publisher',
                    //formatter: (value, row) => {
                    //    return row.book.publisher;
                    //},
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
                    title: "Returned Date",
                    field: 'endDate',
                    formatter: (value) => {
                        return moment(value).format("MM-DD-YYYY");
                    },
                    sortable: true
                }
            ],
            striped: true,
            //sortable: true, // It's true by default, so no need to specify the true value here
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
            url: '/api/borrows/records/individual',
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
            this.templateId = pages.nonadmin.BorrowingHistoryViewId;
            this.title("Borrowing History");
        }

        public query = () => {
            this.queryData({
                UserId: hj.library.Application.instance.sessionUser().userId,
                StartDate: this.startDate(),
                EndDate: this.endDate(),
                DateQueryOptions: this.selectedDateTypes()
            });
        }
    }
}