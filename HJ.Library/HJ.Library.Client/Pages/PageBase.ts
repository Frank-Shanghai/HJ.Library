module hj.library.pages {
    export class PageBase {
        public pageId: string;
        public templateId: string = "";
        public isVisible: KnockoutObservable<boolean> = ko.observable<boolean>(false);
        public title = ko.observable('');
        public space: Space;
        public parameters = ko.observable<any>();

        //public navigator: Services.INavigator;

        public isProcessing: KnockoutObservable<boolean> = ko.observable(false);
        public informationDialog: KnockoutObservable<IInformationDialogComponentParameters> = ko.observable(null);
        public errorDialog: KnockoutObservable<IErrorDialogParameters> = ko.observable(null);

        public onBeforeNavigateAway(navigate: () => void, cancel?: () => void) {
            // Do anything you want to do here

            if (navigate) {
                navigate();
            }
        }

        public equals(page: PageBase): boolean {
            //TODO: what is the base logic for pages equlity? page id/tag/name and parameters?
            // Answer: here we recognize 2 pages as equal pages if they have the same template id
            return page.templateId === this.templateId;
        }

        public dispose() {
        }
    }
}