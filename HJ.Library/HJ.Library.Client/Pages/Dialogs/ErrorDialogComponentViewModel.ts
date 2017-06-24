module hj.library.dialogs {
    export class ErrorDialogComponentViewModel {
        private _title: any;
        private _messages: IErrorDialogMessage[];
        private _onClose: () => void;

        private _maxmized = ko.observable<boolean>(false);
        private _dismissButtonText = "Dismiss";
        private _maximizeButtonText = "Maximize";
        private _restoreButtonText = "Restore";
        private _activeMessage: KnockoutComputed<string>;

        constructor(parameters: IErrorDialogParameters) {
            parameters = ko.unwrap(parameters.context || parameters);
            this._title = parameters.title;
            this._messages = parameters.messages;
            this._onClose = parameters.onClose;
        }

        public dismissClick = () => {
            if (this._onClose) {
                this._onClose();
            }
        }

        public maxClick = () => {
            this._maxmized(!this._maxmized());
        }
    }
}