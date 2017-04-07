﻿///<reference path="../PageBase.ts" />
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
            this.title('Edit User');
            this.templateId = users.EditUserViewId;
            this.initialize(user);
        }

        private initialize(user: any) {
            if (user) {
                this.isEditingMode(true);

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
                })
                    .fail(() => { });
            }
        }

        private createUser = () => {
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
                Application.instance.activePage(new UsersViewModel());
            }).fail((jqXhr: any, textStatus: any, err: any) => {
                alert(err.message);
            });
        }

        private updateUser = () => {
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
                Application.instance.activePage(new UsersViewModel());
            }).fail((jqXhr: any, textStatus: any, err: any) => {
                alert(err.message);
            });
        }
    }

}