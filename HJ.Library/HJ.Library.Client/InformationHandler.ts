module hj.library {
    export class InformationHandler {
        /**
        * Displays an information dialog
        */
        public static report(dialogParameters: IInformationDialogComponentParameters, dialogContainer?: IDialogContainer) {
            var originalCloseAction = dialogParameters.onClose;

            if (dialogContainer) {
                dialogParameters.onClose = () => {
                    if (originalCloseAction) {
                        originalCloseAction();
                    }

                    dialogContainer.informationDialog(null);
                }

                dialogContainer.informationDialog(dialogParameters);
            }
            else {
                dialogParameters.onClose = () => {
                    if (originalCloseAction) {
                        originalCloseAction();
                    }

                    Application.instance.informationDialog(null);
                }

                Application.instance.informationDialog(dialogParameters);
            }
        }
    }
}