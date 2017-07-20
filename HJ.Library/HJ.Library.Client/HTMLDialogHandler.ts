module hj.library {
    export class HTMLDialogHandler {
        public static report(dialogParameters: IHTMLDialogComponentParameters, dialogContainer?: IDialogContainer) {
            var originalCloseAction = dialogParameters.onClose;

            if (dialogContainer) {
                dialogParameters.onClose = () => {
                    if (originalCloseAction) {
                        originalCloseAction();
                    }

                    dialogContainer.htmlDialog(null);
                }

                dialogContainer.htmlDialog(dialogParameters);
            }
            else {
                dialogParameters.onClose = () => {
                    if (originalCloseAction) {
                        originalCloseAction();
                    }

                    Application.instance.htmlDialog(null);
                }

                Application.instance.htmlDialog(dialogParameters);
            }
        }
    }
}