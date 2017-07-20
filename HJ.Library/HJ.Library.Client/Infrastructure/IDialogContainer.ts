module hj.library {
    export interface IDialogContainer {
        errorDialog: KnockoutObservable<IErrorDialogParameters>;
        informationDialog: KnockoutObservable<IInformationDialogComponentParameters>;
        htmlDialog: KnockoutObservable<IHTMLDialogComponentParameters>;
    }
}