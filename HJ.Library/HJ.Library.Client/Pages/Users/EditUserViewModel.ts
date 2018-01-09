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

        private emailValidationErrors = ko.observableArray([]);
        private userNameValidationErrors = ko.observableArray([]);
        private roleValidationError = ko.observable(null);
        private passwordEquivalenceValidationError = ko.observable(null);
        private useDefaultPassword: KnockoutObservable<boolean> = ko.observable(true);

        // errors that not validated by DTO model field attributes, but raised when creating/updating an user
        // raised by the IdentityUser, so it's still part of Model State
        private unexpectedErrors = ko.observableArray([]);

        constructor(user?: any) {
            super();
            this.title('Create User');
            this.useDefaultPassword.subscribe(this.toggleDefaultPassword);
            this.useDefaultPassword.valueHasMutated(); // manually trigger the subscription to update the UI throught binding
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
                    url: '/api/accounts/user/name/' + user.userName
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

        private validate(): boolean {
            this.clearValidationError();
            var result = true;
            if (!this.email().trim()) {
                result = false;
                this.emailValidationErrors.push("Email cannot be empty.");
            }
            else {
                if (!this.validateEmail()) {
                    result = false;
                    this.emailValidationErrors.push("Email format is incorrect.");
                }
            }

            if (!this.userName().trim()) {
                result = false;
                this.userNameValidationErrors.push("Logon Name cannot be empty.");
            }

            if (this.selectedRoles().length == 0) {
                result = false;
                this.roleValidationError("Select at least one role.");
            }

            if (this.useDefaultPassword() === false && this.password() !== this.confirmPassword()) {
                this.passwordEquivalenceValidationError("The 2 inputted passwords are not identical.");
            }

            return result;
        }

        private validateEmail(): boolean {
            // Reference:
            // https://stackoverflow.com/questions/46155/how-can-you-validate-an-email-address-in-javascript
            // http://jsfiddle.net/ghvj4gy9/embedded/result,js/
            var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regEx.test(this.email());
        }

        private clearValidationError() {
            this.emailValidationErrors([]);
            this.userNameValidationErrors([]);
            this.roleValidationError(null);
            this.passwordEquivalenceValidationError(null);
            this.unexpectedErrors([]);
        }

        private toggleDefaultPassword = (newValue: boolean) => {
            if (newValue === true)
                this.password("We@rW01v3s");
            else
                this.password('');
        }

        private createUser = () => {
            if (this.validate()) {
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
                    this.space.removePage(this);
                    this.space.addPage(new UsersViewModel(), null);
                    //Application.instance.activePage(new UsersViewModel());
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    if (jqXhr.responseJSON && jqXhr.responseJSON.modelState) {
                        var modelState = jqXhr.responseJSON.modelState;
                        if (modelState["userModel.Email"] && modelState["userModel.Email"].length > 0) {
                            modelState["userModel.Email"].forEach((item) => {
                                this.emailValidationErrors.push(item);
                            });
                        }

                        if (modelState["userModel.UserName"] && modelState["userModel.UserName"].length > 0) {
                            modelState["userModel.UserName"].forEach((item) => {
                                this.userNameValidationErrors.push(item);
                            });
                        }

                        if (modelState["unexpected"] && modelState["unexpected"].length > 0) {
                            this.unexpectedErrors(modelState["unexpected"]);
                        }
                    }
                    else {
                        var error: IError = new Error("Failed to create new user.");
                        error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                        ErrorHandler.report(error, null, this);
                    }
                }).always(() => {
                    this.isProcessing(false);
                });
            }
        }

        private updateUser = () => {
            if (this.validate()) {
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
                    this.space.removePage(this);
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
        }

        private cancel = () => {
            // By calling addPage, it will check the template id first, if they are the same, the old page will be replaced with the new page.
            this.space.removePage(this);
            this.space.addPage(new UsersViewModel(), null);
            //Application.instance.activePage(new UsersViewModel());
        }
    }

}