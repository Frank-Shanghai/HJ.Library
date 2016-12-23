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

        constructor() {
            this.user = new authentication.LogonViewModel()
            
        }        
    }
}