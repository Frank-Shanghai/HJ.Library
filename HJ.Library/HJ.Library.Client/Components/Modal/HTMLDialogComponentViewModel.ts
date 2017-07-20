module hj.library {
    export class HTMLDialogComponentViewModel {
        private _title: any;
        private _templateName: any;
        private _data: any;
        private _onClose: () => void;
        private _dismissButtonText = "Dismiss";
        private _maximizeButtonText = "Maximize";
        private _restoreButtonText = "Restore";
        private _isDismissButtonVisible: any;
        private _isDismissButtonFocused: any;
        private _isMaximizeButtonVisible: any;
        private _customButtons: any;
        private _size: string;

        private _maximized = ko.observable<boolean>(false);

        constructor(parameters: IHTMLDialogComponentParameters) {
            parameters = ko.unwrap(parameters.context || parameters);
            this._title = parameters.title;
            this._templateName = parameters.templateName;
            this._data = parameters.data;
            this._onClose = parameters.onClose;
            this._customButtons = parameters.customButtons;
            this._size = this.getSize(parameters.size);

            if (parameters.isDismissButtonVisible === false) {
                this._isDismissButtonVisible = false;
            }
            else {
                this._isDismissButtonVisible = true;
            }

            if (parameters.isDismissButtonFocused === false) {
                this._isDismissButtonFocused = false;
            }
            else {
                this._isDismissButtonFocused = true;
            }

            if (this._size === "maximized") {
                this._isMaximizeButtonVisible = false;
                this._maximized(true);
            }

            if (parameters.isMaximizeButtonVisible === false) {
                this._isMaximizeButtonVisible = false;
            }
            else {
                this._isMaximizeButtonVisible = true;
            }
        }

        private getSize(size: string) {
            if (size === "small" || size === "large" || size === "maximized")
                return size;

            return "small";
        }

        public dismissClick = (): void => {
            if (this._onClose) {
                this._onClose();
            }
        }

        public maxClick = () => {
            this._maximized(!this._maximized());
        }
    }
}