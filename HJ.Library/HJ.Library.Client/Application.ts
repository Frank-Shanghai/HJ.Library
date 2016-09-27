﻿module hj.library {

    export class Application {
        private static _instance: Application;

        public static get instance(): Application {
            if (Application._instance == null) {
                Application._instance = new Application();
            }

            return Application._instance;
        }

        public user: authentication.LogonUserViewModel;
        public activePage: any;

        constructor() {
            this.user = new authentication.LogonUserViewModel()
            this.activePage = "page";
        }

        
    }
}