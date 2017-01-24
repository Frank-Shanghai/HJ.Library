declare module hj.library.pages {
    class PageBase {
        templateId: string;
        isVisible: KnockoutObservable<boolean>;
        title: KnockoutObservable<string>;
    }
}
declare module hj.library {
    class Application {
        private static _instance;
        static instance: Application;
        user: authentication.LogonViewModel;
        activePage: KnockoutObservable<pages.PageBase>;
        isAuthenticated: KnockoutObservable<boolean>;
        navigationMenus: Array<any>;
        sammyApp: Sammy.Application;
        constructor();
        private initializeRouters();
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
    class HomePageViewModel extends PageBase {
        constructor();
    }
}
declare module hj.library.pages {
    class UsersViewModel extends PageBase {
        users: KnockoutObservableArray<any>;
        constructor();
        private initialize();
    }
}
declare module hj.library.authentication {
    var LogonViewId: string;
}
declare module hj.library.pages {
    var HomePageViewId: string;
    var UsersViewId: string;
}
declare module hj.library.views {
    function register(): void;
}
