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
        public activePage: any;
        public isAuthenticated: KnockoutObservable<boolean> = ko.observable(false);

        constructor() {
            this.user = new authentication.LogonViewModel()
            this.activePage = "page";
        }        
    }
}