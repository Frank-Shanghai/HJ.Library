declare module hj.library.pages {
    class PageBase {
        pageId: string;
        templateId: string;
        isVisible: KnockoutObservable<boolean>;
        title: KnockoutObservable<string>;
        space: Space;
        parameters: KnockoutObservable<any>;
        isProcessing: KnockoutObservable<boolean>;
        onBeforeNavigateAway(navigate: () => void, cancel?: () => void): void;
        equals(page: PageBase): boolean;
        dispose(): void;
    }
}
declare module hj.library {
    class Application {
        private static _instance;
        static instance: Application;
        activeSpace: KnockoutObservable<Space>;
        user: authentication.LogonViewModel;
        changePasswordDialog: dialogs.ChangePasswordViewModel;
        informationDialog: KnockoutObservable<dialogs.IInformationDialogComponentParameters>;
        activePage: KnockoutObservable<pages.PageBase>;
        isAuthenticated: KnockoutObservable<boolean>;
        isProcessing: KnockoutObservable<boolean>;
        sessionUser: KnockoutObservable<any>;
        userFullName: KnockoutComputed<string>;
        navigationMenus: Array<any>;
        sammyApp: Sammy.Application;
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
        private reset;
        private handleLogonResponse;
        private onLogonFail(jqXhr);
    }
}
declare module hj.library {
    class ComponentRegistry {
        static register(): void;
    }
}
declare module hj.library {
    class Bindings {
        static registerCustomBinding(name: string, binding: KnockoutBindingHandler, allowVirtualElements?: boolean): void;
    }
}
declare module hj.library {
    class CloseOverlayBinding implements KnockoutBindingHandler {
        init(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void;
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
declare module hj.library {
    class InformationHandler {
        /**
        * Displays an information dialog
        */
        static report(dialogParameters: dialogs.IInformationDialogComponentParameters): void;
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
    class EditBookViewModel extends PageBase {
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
declare module hj.library.dialogs {
    class ChangePasswordViewModel {
        private oldPassword;
        private newPassword;
        private confirmPassword;
        constructor();
        private changePassword;
    }
}
declare module hj.library.dialogs {
    interface IInformationDialogComponentParameters {
        context?: IInformationDialogComponentParameters;
        title: string | KnockoutObservable<string>;
        header: string | KnockoutObservable<string>;
        message: string | KnockoutObservable<string>;
        okButtonText: string | KnockoutObservable<string>;
        cancelButtonText: string | KnockoutObservable<string>;
        onConfirm?: () => void;
        onCancel?: () => void;
        onClose?: () => void;
        isOKButtonVisible?: boolean | KnockoutObservable<boolean>;
        isCancelButtonVisible?: boolean | KnockoutObservable<boolean>;
    }
}
declare module hj.library.dialogs {
    class InformationDialogComponentViewModel {
        private _title;
        private _header;
        private _message;
        private _okButtonText;
        private _cancelButtonText;
        private _onConfirm;
        private _onCancel;
        private _onClose;
        private _isOKButtonVisible;
        private _isCancelButtonVisible;
        constructor(parameters: IInformationDialogComponentParameters);
        confirmClick: () => void;
        cancelClick: () => void;
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
declare module hj.library {
    interface BeforeAddPageHandler {
        (page: pages.PageBase, space: Space, proceed: () => void, cancel: () => void): void;
    }
    class Space {
        private _onBeforeAddPage;
        id: string;
        isSinglePageSpace: boolean;
        title: KnockoutObservable<string>;
        pages: KnockoutObservableArray<pages.PageBase>;
        activePage: KnockoutObservable<pages.PageBase>;
        isProcessing: KnockoutObservable<boolean>;
        isActive: KnockoutObservable<boolean>;
        canClose: boolean;
        constructor(title: string);
        isPreviousButtonEnabled: KnockoutComputed<boolean>;
        isNextButtonEnabled: KnockoutComputed<boolean>;
        isPagesButtonEnabled: KnockoutComputed<boolean>;
        goToPreviousPage: () => void;
        private doGoToPreviousPage;
        goToNextPage: () => void;
        private doGoToNextPage;
        goToPage: (page: pages.PageBase) => void;
        addPage(page: pages.PageBase, parameters: any, removeForwardPages?: boolean): void;
        removePage(page: pages.PageBase): void;
        onBeforeAddPage(onBeforeAddPage: BeforeAddPageHandler): void;
        private setActivePage;
        private removeAllPagesAfterActive();
    }
}
declare module hj.library {
    class Utils {
        static guid(): string;
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
declare module hj.library.pages.dialogs {
    var ChangePasswordDialogView: string;
    var ChangePasswordDialogViewId: string;
    var InformationDialogComponentView: string;
    var InformationDialogComponentViewId: string;
    var ProgressBarView: string;
    var ProgressBarViewId: string;
    var UserProfileDialogView: string;
    var UserProfileDialogViewId: string;
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
