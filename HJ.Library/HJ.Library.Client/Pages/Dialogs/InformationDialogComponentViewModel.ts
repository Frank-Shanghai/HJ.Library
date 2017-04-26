module hj.library.dialogs {
    export class InformationDialogComponentViewModel {
        private _title: string | KnockoutObservable<string>;
        private _header: string | KnockoutObservable<string>;
        private _message: string | KnockoutObservable<string>;
        private _okButtonText: string | KnockoutObservable<string>;
        private _cancelButtonText: string | KnockoutObservable<string>;
        private _onConfirm: () => void;
        private _onCancel: () => void;
        private _onClose: () => void;
        private _isOKButtonVisible: boolean | KnockoutObservable<boolean>;
        private _isCancelButtonVisible: boolean | KnockoutObservable<boolean>;

        constructor(parameters: IInformationDialogComponentParameters) {
            parameters = ko.unwrap(parameters.context || parameters);
            this._title = parameters.title;
            this._header = parameters.header;
            this._message = parameters.message;
            this._okButtonText = parameters.okButtonText;
            this._cancelButtonText = parameters.cancelButtonText;
            this._onConfirm = parameters.onConfirm;
            this._onCancel = parameters.onCancel;
            this._onClose = parameters.onClose;

            if (parameters.isOKButtonVisible === true || parameters.isOKButtonVisible === false) {
                this._isOKButtonVisible = parameters.isOKButtonVisible;
            }
            else {
                this._isOKButtonVisible = true; // By default, OK button is visible.
            }

            if (parameters.isCancelButtonVisible === true || parameters.isCancelButtonVisible === false) {
                this._isCancelButtonVisible = parameters.isCancelButtonVisible;
            }
            else {
                this._isCancelButtonVisible = true; // By default, Cancel button is visible.
            }
        }

        public confirmClick = (): void => {
            if (this._onClose) {
                this._onClose();
            }

            if (this._onConfirm) {
                this._onConfirm();
            }
        }

        public cancelClick = (): void => {
            if (this._onClose) {
                this._onClose();
            }

            if (this._onCancel) {
                this._onCancel();
            }
        }
    }
}