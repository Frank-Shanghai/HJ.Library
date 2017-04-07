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
        private updateActive;
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
declare module hj.library {
    class Bindings {
        static registerCustomBinding(name: string, binding: KnockoutBindingHandler, allowVirtualElements?: boolean): void;
    }
}
declare module hj.library {
    class GridBinding implements KnockoutBindingHandler {
        update(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void;
    }
}
declare module hj.library.pages {
    class HomePageViewModel extends PageBase {
        constructor();
    }
}
declare module hj.library.pages {
    class EditUserViewModel extends PageBase {
        private userId;
        email: KnockoutObservable<string>;
        userName: KnockoutObservable<string>;
        firstName: KnockoutObservable<string>;
        lastName: KnockoutObservable<string>;
        roleName: KnockoutObservable<string>;
        password: KnockoutObservable<string>;
        confirmPassword: KnockoutObservable<string>;
        isUserRole: KnockoutObservable<boolean>;
        isAdminRole: KnockoutObservable<boolean>;
        isSuperAdmin: KnockoutObservable<boolean>;
        selectedRoles: KnockoutObservableArray<any>;
        isEditingMode: KnockoutObservable<boolean>;
        constructor(user?: any);
        private initialize(user);
        private createUser;
        private updateUser;
    }
}
declare module hj.library.pages {
    class UsersViewModel extends PageBase {
        users: KnockoutObservableArray<any>;
        gridOptions: KnockoutObservable<any>;
        selectedUsers: KnockoutObservableArray<any>;
        constructor();
        private initialize();
        private refreshSelection;
        private edit;
        private add;
        private remove;
        private refresh;
    }
}
declare module hj.library.authentication {
    var LogonViewId: string;
}
declare module hj.library.pages {
    var HomePageViewId: string;
}
declare module hj.library.pages.users {
    var EditUserViewId: string;
    var UsersViewId: string;
}
declare module hj.library.views {
    function register(): void;
}
