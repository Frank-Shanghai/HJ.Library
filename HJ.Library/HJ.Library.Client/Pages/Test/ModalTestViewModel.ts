module hj.library.pages {
    export class ModalTestViewModel extends PageBase {
        constructor() {
            super();
            this.title("Modal Test");
            this.templateId = test.ModalTestViewId;
        }

        private showErrorDialog = () => {
            ErrorHandler.report({
                message: "error message here",
                stack: "stack trace here",
                raw: "raw message here"
            });
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
    }
}