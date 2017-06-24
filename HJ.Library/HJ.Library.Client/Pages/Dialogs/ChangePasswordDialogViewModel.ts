module hj.library.dialogs {
    export class ChangePasswordViewModel {
        private oldPassword = ko.observable('');
        private newPassword = ko.observable('');
        private confirmPassword = ko.observable('');

        constructor() { }

        private changePassword = () => {
            if (this.newPassword() !== this.confirmPassword()) {
                alert('The new password and confirm password should be identical.');
                return;
            }

            Application.instance.isProcessing(true);
            $.ajax({
                type: 'post',
                contentType: 'application/json',
                url: '/api/accounts/changepassword',
                data: JSON.stringify({
                    OldPassword: this.oldPassword(),
                    NewPassword: this.newPassword()
                })
            }).done(() => {
                alert("Password changed sucessfully.");
                this.oldPassword('');
                this.newPassword('');
                this.confirmPassword('');
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to set password.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error);
            }).always(() => {
                Application.instance.isProcessing(false);
            });
        }
    }
}