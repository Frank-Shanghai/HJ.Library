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
        public static report(error: IError) {
            // TODO: Currently, the error dialog is only for application level, can refactored the code to allow the pages have their own information dialog
            var dialogParameters = ErrorHandler.buildMessage(error);

            var originalCloseAction = dialogParameters.onClose;

            dialogParameters.onClose = () => {
                if (originalCloseAction) {
                    originalCloseAction();
                }

                Application.instance.errorDialog(null);
            }

            Application.instance.errorDialog(dialogParameters);
        }

        private static buildMessage(error: IError): dialogs.IErrorDialogParameters {
            var errorDialog: dialogs.IErrorDialogParameters = {
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