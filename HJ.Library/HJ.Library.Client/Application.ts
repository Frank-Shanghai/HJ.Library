///<reference path="Pages/PageBase.ts" />
module hj.library {

    export class Application {
        public homePageSpace: Space;

        // Books can be borrowed for 4 weeks/28 days
        // Loan period
        public userMaximumTimespan = 28;

        // One user can borrow at most 3 books
        // Users have up to 3 items on loan
        public userMaximumBookCount = 3;

        private static _instance: Application;

        public static get instance(): Application {
            if (Application._instance == null) {
                Application._instance = new Application();
            }

            return Application._instance;
        }

        public spaceList: SpaceList;
        public user: authentication.LogonViewModel;
        public changePasswordDialog: dialogs.ChangePasswordViewModel = new dialogs.ChangePasswordViewModel();
        public informationDialog: KnockoutObservable<IInformationDialogComponentParameters> = ko.observable(null);
        public errorDialog: KnockoutObservable<IErrorDialogParameters> = ko.observable(null);
        public htmlDialog: KnockoutObservable<IHTMLDialogComponentParameters> = ko.observable(null);
        public isAuthenticated: KnockoutObservable<boolean> = ko.observable(false);
        public isProcessing: KnockoutObservable<boolean> = ko.observable(false);
        public sessionUser = ko.observable(null); // type return user
        public userFullName = ko.computed(() => {
            if (this.sessionUser()) {
                return this.sessionUser().firstName + ' ' + this.sessionUser().lastName;
            }
        });

        public isMenuBarVisible = ko.observable(true);
        public isSpaceBarVisible = ko.observable(false);

        public toggleMenuBar = () => {
            this.isMenuBarVisible(!this.isMenuBarVisible());
            this.isSpaceBarVisible(false);
        }

        public toggleSpaceBar = () => {
            this.isSpaceBarVisible(!this.isSpaceBarVisible());
            this.isMenuBarVisible(false);
        }

        public isNavigationViewVisible = ko.computed(() => {
            return this.isMenuBarVisible() || this.isSpaceBarVisible();
        });

        public navigationMenus: KnockoutObservableArray<any> = ko.observableArray([]);
        //public navigationMenus: Array<any> = [
        //    {
        //        title: "Home", route: "#/Welcome", isActive: true,
        //        navigateHandler: () => {
        //            this.openHomePageSpace();
        //            //this.activePage(new pages.HomePageViewModel());
        //        }
        //     },
        //    {
        //        title: "Users", route: "#/Users", isActive: false,
        //        navigateHandler: () => {
        //            var space = new Space("Users");
        //            space.addPage(new pages.UsersViewModel(), null);
        //            // By default, replace can closed active space
        //            this.spaceList.replaceActive(space);      
        //        }
        //    }, 
        //    {
        //        title: "Books", route: "#/Books", isActive: false,
        //        navigateHandler: () => {
        //            var space = new Space("Books");
        //            space.addPage(new pages.BooksViewModel(), null);
        //            // By default, replace can closed active space
        //            this.spaceList.replaceActive(space);                    
        //            //this.activePage(new pages.BooksViewModel());
        //        }
        //    }
        //];

        constructor() {
            this.spaceList = new SpaceList();
            this.user = new authentication.LogonViewModel();
        }

        public initializeNavigationMenu() {
            var menuNodes: Array<IMenuNode> = [];
            if (this.sessionUser().isAdmin === true) {
                menuNodes = [
                    {
                        text: "Users",
                        // No need the full namespace path since it has been handled when generating menu items in Menu.ts
                        targetPageName: "UsersViewModel" // Should be the class name
                    },
                    {
                        text: "Books",
                        // No need the full namespace path since it has been handled when generating menu items in Menu.ts
                        targetPageName: "BooksViewModel"
                    },
                    {
                        text: "Borrow/Return Mgr",
                        nodes: [
                            {
                                text: "Borrow",
                                targetPageName: "BorrowBooksViewModel"
                            },
                            {
                                text: "Return",
                                targetPageName: "ReturnBooksViewModel"
                            },
                            {
                                text: "B/R Record",
                                targetPageName: "BorrowingRecordsViewModel"
                            }
                        ]
                    },
                    {
                        text: "Test Pages",
                        nodes: [
                            {
                                text: "Modal",
                                targetPageName: "ModalTestViewModel"
                            },
                            {
                                text: "FlexContainer",
                                nodes: [
                                    {
                                        text: "CanScroll",
                                        targetPageName: "CanScrollViewModel"
                                    },
                                    {
                                        text: "CanReAddGrow",
                                        targetPageName: "CanReAddGrowViewModel"
                                    },
                                    {
                                        text: "MultipleFlexElements",
                                        targetPageName: "MultipleFlexElementsViewModel"
                                    }
                                ]
                            },
                            {
                                text: "SearchableDropDownList",
                                nodes: [
                                    {
                                        text: "Searchable DDL",
                                        targetPageName: "SearchableDropDownListTestViewModel"
                                    }
                                ]
                            }
                        ]
                    }
                ];
            }
            else {
                menuNodes = [
                    {
                        text: "All Books",
                        // No need the full namespace path since it has been handled when generating menu items in Menu.ts
                        targetPageName: "AllBooksViewModel" // Should be the class name
                    },
                    {
                        text: "Borrowed Books",
                        targetPageName: "BorrowedBooksViewModel"
                    },
                    {
                        text: "Borrowing History",
                        targetPageName: "BorrowingHistoryViewModel"
                    }
                ];
            }

            this.navigationMenus(new Menu(menuNodes).navigationMenu);
        }

        public openHomePageSpace = () => {
            if (!this.homePageSpace) {
                this.homePageSpace = new Space("Home", true, false);
                this.spaceList.openNew(this.homePageSpace, true);
                this.homePageSpace.addPage(new pages.HomePageViewModel(), null);
            }
            else {
                this.spaceList.open(this.homePageSpace);
            }

            return this.homePageSpace;
        }

        public closeSpace = (space: Space) => {
            if (!space.canClose)
                return;

            // No such scenarios?
            if (space.pages().length === 0) {
                this.spaceList.close(space);
                return;
            }

            var doCloseSpace = () => {
                if (space.activePage()) {
                    space.activePage().onBeforeNavigateAway(() => {
                        this.spaceList.close(space);
                    });
                }
                else {
                    this.spaceList.close(space);
                }
            }

            InformationHandler.report({
                title: "Close Space",
                header: "Please Confirm",
                message: "Are you sure you want to close space " + space.title() + "? ",
                isOKButtonVisible: true,
                okButtonText: "Yes",
                isCancelButtonVisible: true,
                cancelButtonText: "Cancel",
                onConfirm: () => {
                    doCloseSpace();
                }
            });
        }

        public logout = () => {
            InformationHandler.report({
                title: "Logout",
                header: "Please Confirm",
                message: "You are about to close all pages and logout from HJ Library system.",
                isOKButtonVisible: true,
                okButtonText: "Logout",
                isCancelButtonVisible: true,
                cancelButtonText: "Cancel",
                onConfirm: () => {
                    logoutHandler();
                }
            });

            var logoutHandler = () => {
                $.ajax({
                    type: 'get',
                    url: '/api/accounts/logout'
                }).done(() => {
                    window.onbeforeunload = undefined;
                    window.location.reload();
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to log out.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error);
                });
            };
        }

        public sammyApp: Sammy.Application = Sammy();

        //private initializeRouters() {
        //    this.sammyApp.get("#/Welcome", (context: any) => {
        //        this.activePage(new pages.HomePageViewModel());
        //    });

        //    this.sammyApp.get("#/Users", (context) => {
        //        this.activePage(new pages.UsersViewModel());
        //    });

        //    this.sammyApp.get("#/Books", (context) => {
        //        this.activePage(new pages.BooksViewModel());
        //    });
        //}
    }
}