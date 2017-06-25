///<reference path="../PageBase.ts" />
module hj.library.pages {
    export class EditUserViewModel extends PageBase {
        private userId: string;

        public email = ko.observable('');
        public userName = ko.observable('');
        public firstName = ko.observable('');
        public lastName = ko.observable('');
        public roleName = ko.observable('');
        public password = ko.observable('');
        public confirmPassword = ko.observable('');

        public isUserRole = ko.observable(false);
        public isAdminRole = ko.observable(false);
        public isSuperAdmin = ko.observable(false);

        public selectedRoles = ko.observableArray([]);

        public isEditingMode = ko.observable(false);

        constructor(user?: any) {
            super();
            this.title('Create User');
            this.templateId = users.EditUserViewId;
            this.initialize(user);
        }

        private initialize(user: any) {
            if (user) {
                this.isEditingMode(true);
                this.title('Edit User');

                this.isProcessing(true);
                $.ajax({
                    type: 'get',
                    accepts: "application/json",
                    url: '/api/accounts/user/' + user.userName
                }).done((user) => {
                    this.userId = user.id;
                    this.email(user.email);
                    this.userName(user.userName);
                    this.firstName(user.firstName);
                    this.lastName(user.lastName);
                    this.selectedRoles(user.roles);
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to get editng user information.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error, null, this);
                }).always(() => {
                    this.isProcessing(false);
                });
            }
        }

        private createUser = () => {
            this.isProcessing(true);
            $.ajax({
                type: 'post',
                contentType: 'application/json',
                url: '/api/accounts/create',
                dataType: 'json',
                data: JSON.stringify({
                    FirstName: this.firstName(),
                    LastName: this.lastName(),
                    UserName: this.userName(),
                    Email: this.email(),
                    RoleName: this.selectedRoles().toString(),
                    Password: this.password()
                })
            }).done(() => {
                this.space.addPage(new UsersViewModel(), null);
                //Application.instance.activePage(new UsersViewModel());
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to create new user.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }

        private updateUser = () => {
            this.isProcessing(true);
            $.ajax({
                type: 'put',
                contentType: 'application/json',
                url: '/api/accounts/user',
                data: JSON.stringify({
                    Id: this.userId,
                    FirstName: this.firstName(),
                    LastName: this.lastName(),
                    RoleName: this.selectedRoles().toString()
                })
            }).done(() => {
                this.space.addPage(new UsersViewModel(), null);
                //Application.instance.activePage(new UsersViewModel());
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to update user.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }

        private cancel = () => {
            // By calling addPage, it will check the template id first, if they are the same, the old page will be replaced with the new page.
            this.space.addPage(new UsersViewModel(), null);
            //Application.instance.activePage(new UsersViewModel());
        }
    }

}