module hj.library.pages {
    export class AllBooksViewModel extends PageBase {
        constructor() {
            super();
            this.templateId = pages.nonadmin.AllBooksViewId;
            this.title("All Books");
        }
    }
}