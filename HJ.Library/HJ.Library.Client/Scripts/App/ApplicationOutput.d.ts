declare module hj.library {
    class Application {
        private static _instance;
        static instance: Application;
        user: authentication.LogonViewModel;
        activePage: any;
        isAuthenticated: KnockoutObservable<boolean>;
        constructor();
    }
}
declare module hj.library.authentication {
    class LogonViewModel {
        name: KnockoutObservable<string>;
        password: KnockoutObservable<string>;
        private token;
        private tokenType;
        constructor();
        logon: () => void;
        private handleLogonResponse(data);
        private onLogonFail(jqXhr);
    }
}
declare module hj.library.pages {
    class UsersViewModel {
        constructor();
    }
}
declare module hj.library.authentication {
    var LogonUserViewId: string;
}
declare module hj.library.views {
    function register(): void;
}
