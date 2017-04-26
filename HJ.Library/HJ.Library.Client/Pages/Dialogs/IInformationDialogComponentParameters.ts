module hj.library.dialogs {
    export interface IInformationDialogComponentParameters {
        context?: IInformationDialogComponentParameters;

        title: string | KnockoutObservable<string>;
        header: string | KnockoutObservable<string>;
        message: string | KnockoutObservable<string>;
        okButtonText: string | KnockoutObservable<string>;
        cancelButtonText: string | KnockoutObservable<string>;
        onConfirm?: () => void;
        onCancel?: () => void;
        onClose?: () => void;
        isOKButtonVisible?: boolean | KnockoutObservable<boolean>;
        isCancelButtonVisible?: boolean | KnockoutObservable<boolean>;
    }
}