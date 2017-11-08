module hj.library.pages {
    export class BorrowedBooksViewModel extends PageBase {
        constructor() {
            super();
            this.templateId = pages.nonadmin.BorrowedBooksViewId;
            this.title("Borrowed Books");
        }
    }
}