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
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                alert(err.message);
            });
        }
    }
}