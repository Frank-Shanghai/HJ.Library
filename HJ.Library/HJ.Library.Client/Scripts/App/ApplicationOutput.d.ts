declare module hj.library {
    class Application {
        private static _instance;
        static instance: Application;
        user: authentication.LogonUserViewModel;
        activePage: any;
        constructor();
    }
}
declare module hj.library.authentication {
    class LogonUserViewModel {
        name: KnockoutObservable<string>;
        password: KnockoutObservable<string>;
        constructor();
        logon: () => void;
    }
}
declare module hj.library.authentication {
    var LogonUserViewId: string;
}
declare module hj.library.views {
    function register(): void;
}
