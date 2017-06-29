module hj.library {
    export interface IError {
        message: string;
        stack?: string;
        raw?: string;
    }

    export class ErrorHandler {
        /**
        * Displays an information dialog
        */
        public static report(error: IError, onClose?: () => void, dialogContainer?: IDialogContainer) {
            var dialogParameters = ErrorHandler.buildMessage(error);

            if (dialogContainer) {
                dialogParameters.onClose = () => {
                    dialogContainer.errorDialog(null);

                    if (onClose) {
                        onClose();
                    }
                }

                dialogContainer.errorDialog(dialogParameters);
            }
            else {
                dialogParameters.onClose = () => {
                    Application.instance.errorDialog(null);
                    if (onClose)
                        onClose();
                }

                Application.instance.errorDialog(dialogParameters);
            }
        }

        private static buildMessage(error: IError): IErrorDialogParameters {
            var errorDialog: IErrorDialogParameters = {
                title: 'Error',
                messages: [
                    { title: "Error Message", message: error.message },
                    { title: "Stack Trace", message: error.stack },
                    { title: "Raw View", message: ErrorHandler.formatRawMessage(error) }
                ]
            };

            return errorDialog;
        }

        private static formatRawMessage(error: IError) {
            if (error.raw)
                return error.raw;
            else
                return 'Message:\r\n' + error.message + '\r\n\r\nStack:\r\n' + error.stack;
        }
    }
}