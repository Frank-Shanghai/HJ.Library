module hj.library {
    export class InformationHandler {
        /**
        * Displays an information dialog
        */
        public static report(dialogParameters: dialogs.IInformationDialogComponentParameters) {
            // TODO: Currently, the information dialog is only for application level, can refactored the code to allow the pages have their own information dialog
            var originalCloseAction = dialogParameters.onClose;

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