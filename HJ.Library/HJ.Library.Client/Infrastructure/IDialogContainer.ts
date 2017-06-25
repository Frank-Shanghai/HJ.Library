module hj.library {
    export interface IDialogContainer {
        errorDialog: KnockoutObservable<dialogs.IErrorDialogParameters>;
        informationDialog: KnockoutObservable<dialogs.IInformationDialogComponentParameters>;
    }
}