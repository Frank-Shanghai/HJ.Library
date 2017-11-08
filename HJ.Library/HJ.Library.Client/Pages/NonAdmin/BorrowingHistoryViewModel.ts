module hj.library.pages {
    export class BorrowingHistoryViewModel extends PageBase {
        constructor() {
            super();
            this.templateId = pages.nonadmin.BorrowingHistoryViewId;
            this.title("Borrowing History");
        }
    }
}