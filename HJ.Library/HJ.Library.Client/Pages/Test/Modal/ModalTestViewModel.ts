module hj.library.pages {
    export class ModalTestViewModel extends PageBase {
        constructor() {
            super();
            this.title("Modal Test");
            this.templateId = test.modal.ModalTestViewId;
        }

        private showErrorDialog = () => {
            ErrorHandler.report({
                message: "error message here",
                stack: "stack trace here",
                raw: "raw message here"
            }, () => { alert('This is the onClose call back.'); });
        }

        private showErrorDialogWithoutExplicitRawMessage = () => {
            ErrorHandler.report({
                message: "error message here",
                stack: "stack trace here",
            });
        }

        private showErrorForFailedRequest = () => {
            $.ajax({
                type: 'get',
                accepts: "application/json",
                url: '/api/notexist'
            }).done(() => {
                alert("should not be sucess.");
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                // The TypeScript Error has message and stack properties, even though you couldn't find
                // the stack property in the definition, but you debug the code, it will be available. (might 
                // dynamically added? not sure)
                var error: IError = new Error("Custom request failed message.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error);
            });
        }

        private showPageLevelDialog = () => {
            InformationHandler.report({
                title: "Page Level Dialog",
                header: "Please Confirm",
                message: "Page Level Dialog Message. Left navigaiton menu and top space inner page navigation bar should be available.",
                isOKButtonVisible: true,
                okButtonText: "OK",
                isCancelButtonVisible: true,
                cancelButtonText: "Cancel",
                onConfirm: () => {                    
                }
            }, this);
        }

        private showSpaceLevelDialog = () => {
            InformationHandler.report({
                title: "Space Level Dialog",
                header: "Please Confirm",
                message: "Space Level Dialog Message, left navigation menu should be available.",
                isOKButtonVisible: true,
                okButtonText: "OK",
                isCancelButtonVisible: true,
                cancelButtonText: "Cancel",
                onConfirm: () => {
                }
            }, this.space);
        }

        private showApplicationLevelDialog = () => {
            InformationHandler.report({
                title: "Application Level Dialog",
                header: "Please Confirm",
                message: "Application Level Dialog Message",
                isOKButtonVisible: true,
                okButtonText: "OK",
                isCancelButtonVisible: true,
                cancelButtonText: "Cancel",
                onConfirm: () => {
                }
            });
        }

        private htmlDialogWithSubComponents = ko.observable(null);
        private displayHTMLDialogWithSubComponents = () => {
            this.htmlDialogWithSubComponents({
                title: "HTML Dialog with Subcomponent",
                data: { firstName: 'Frank', lastName: 'Sun' },
                onClose: () => {
                    this.htmlDialogWithSubComponents(null);
                }
            });
        }

        private displayHTMLDialogWithTemplate = () => {
            HTMLDialogHandler.report({
                title: "HTML Dialog with Template",
                data: new HTMLDialogTemplateViewModel(),
                templateName: test.modal.HTMLDialogTemplateViewId,
                onClose: () => {
                    alert("You are going to close the HTML dialog.");
                }
            });
        }
    }
}