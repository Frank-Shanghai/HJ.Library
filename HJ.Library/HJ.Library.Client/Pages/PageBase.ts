module hj.library.pages {
    export class PageBase {
        public templateId: string = "";
        public isVisible: KnockoutObservable<boolean> = ko.observable<boolean>(false);
        public title = ko.observable('');

        //public navigator: Services.INavigator;

        //public errorDialog = ko.observable<IErrorDialogParameters>(null);
        //public htmlDialog = ko.observable<IHtmlDialogParameters>(null);
        //public informationDialog = ko.observable<IInformationDialogParameters>(null);
    }
}