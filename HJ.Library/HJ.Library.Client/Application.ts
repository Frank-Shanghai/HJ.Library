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
        public changePasswordDialog: dialogs.ChangePasswordViewModel = new dialogs.ChangePasswordViewModel();
        public informationDialog: KnockoutObservable<dialogs.IInformationDialogComponentParameters> = ko.observable(null);
        public activePage: KnockoutObservable<pages.PageBase> = ko.observable(null);
        public isAuthenticated: KnockoutObservable<boolean> = ko.observable(false);
        public sessionUser = ko.observable(null); // type return user
        public userFullName = ko.computed(() => {
            if (this.sessionUser()) {
                return this.sessionUser().firstName + ' ' + this.sessionUser().lastName;
            }
        });

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
                this.activePage(new pages.BooksViewModel());
            });
        }
    }
}