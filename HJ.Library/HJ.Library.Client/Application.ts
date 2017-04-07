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

        private updateActive= (data: any) => {
            data.isActive(!data.isActive());
        }
    }
}