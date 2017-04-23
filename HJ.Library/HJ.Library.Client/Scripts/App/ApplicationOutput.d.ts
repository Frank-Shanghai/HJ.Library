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
        sessionUser: KnockoutObservable<any>;
        userFullName: KnockoutComputed<string>;
        oldPassword: KnockoutObservable<string>;
        newPassword: KnockoutObservable<string>;
        confirmPassword: KnockoutObservable<string>;
        navigationMenus: Array<any>;
        sammyApp: Sammy.Application;
        constructor();
        private initializeRouters();
        private changePassword;
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
        private reset;
        private handleLogonResponse;
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
declare module hj.library {
    class MenuStatusBinding implements KnockoutBindingHandler {
        init(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void;
    }
}
declare module hj.library.pages {
    class BooksViewModel extends PageBase {
        gridOptions: KnockoutObservable<any>;
        selectedBooks: KnockoutObservableArray<any>;
        constructor();
        private refreshSelection;
        private detailFormatter;
        private initialize();
        private add;
        private edit;
        private remove;
        private refresh;
    }
}
declare module hj.library.pages {
    class EditBook extends PageBase {
        private bookId;
        isEditingMode: KnockoutObservable<boolean>;
        isbn: KnockoutObservable<string>;
        bookTitle: KnockoutObservable<string>;
        author: KnockoutObservable<string>;
        publisher: KnockoutObservable<string>;
        publicationDate: KnockoutObservable<Date>;
        pages: KnockoutObservable<number>;
        copies: KnockoutObservable<any>;
        owner: KnockoutObservable<string>;
        comment: KnockoutObservable<string>;
        constructor(bookId?: string);
        private initialize(bookId?);
        private create;
        private update;
        private cancel;
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
        private cancel;
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
    var LogonView: string;
    var LogonViewId: string;
}
declare module hj.library.pages {
    var HomePageView: string;
    var HomePageViewId: string;
}
declare module hj.library.pages.books {
    var BookDetailsTemplateView: string;
    var BookDetailsTemplateViewId: string;
    var BooksView: string;
    var BooksViewId: string;
    var EditBookView: string;
    var EditBookViewId: string;
}
declare module hj.library.pages.modaldialogs {
    var changePasswordView: string;
    var changePasswordViewId: string;
    var InformationDialogView: string;
    var InformationDialogViewId: string;
    var UserProfileView: string;
    var UserProfileViewId: string;
}
declare module hj.library.pages.users {
    var EditUserView: string;
    var EditUserViewId: string;
    var UsersView: string;
    var UsersViewId: string;
}
declare module hj.library.views {
    function register(): void;
}
