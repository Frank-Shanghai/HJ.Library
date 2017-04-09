///<reference path="Pages/PageBase.ts" />
module hj.library {

    export class Application {
        private static _instance: Application;

        public static get instance(): Application {
            if (Application._instance == null) {
                Application._instance = new Application();
            }

            return Application._instance;
        }

        public user: authentication.LogonViewModel;
        public activePage: KnockoutObservable<pages.PageBase> = ko.observable(null);
        public isAuthenticated: KnockoutObservable<boolean> = ko.observable(false);
        public sessionUser = ko.observable(null); // type return user
        public userFullName = ko.computed(() => {
            if (this.sessionUser()) {
                return this.sessionUser().firstName + ' ' + this.sessionUser().lastName;
            }
        });

        public oldPassword = ko.observable('');
        public newPassword = ko.observable('');
        public confirmPassword = ko.observable('');

        public navigationMenus: Array<any> = [
            { title: "Home", route: "#/Welcome", isActive: true },
            { title: "Users", route: "#/Users", isActive: false }, 
            { title: "Books", route: "#/Books", isActive: false }
        ];

        public sammyApp: Sammy.Application = Sammy();

        constructor() {
            this.user = new authentication.LogonViewModel();
            this.initializeRouters();
        }        

        private initializeRouters() {
            this.sammyApp.get("#/Welcome", (context: any) => {
                this.activePage(new pages.HomePageViewModel());
            });

            this.sammyApp.get("#/Users", (context) => {
                this.activePage(new pages.UsersViewModel());
            });

            this.sammyApp.get("#/Books", (context) => {
                this.activePage(new pages.HomePageViewModel());
            });
        }

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
                (<any>$('div#changePassword')).modal('hide');
                alert("Password changed sucessfully.");
                this.oldPassword('');
                this.newPassword('');
                this.confirmPassword('');
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                alert(err.message);
            });
        }
    }
}