var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var PageBase = (function () {
                function PageBase() {
                    this.templateId = "";
                    this.isVisible = ko.observable(false);
                    this.title = ko.observable('');
                    this.parameters = ko.observable();
                    //TODO: Move this property to space when space is implemented.
                    this.isProcessing = ko.observable(false);
                }
                //public navigator: Services.INavigator;
                //public errorDialog = ko.observable<IErrorDialogParameters>(null);
                //public htmlDialog = ko.observable<IHtmlDialogParameters>(null);
                // TODO: Page information dialog
                //public informationDialog = ko.observable<IInformationDialogParameters>(null);
                PageBase.prototype.onBeforeNavigateAway = function (navigate, cancel) {
                    if (navigate) {
                        navigate();
                    }
                };
                PageBase.prototype.equals = function (page) {
                    //TODO: what is the base logic for pages equlity? page id/tag/name and parameters?
                    // Answer: here we recognize 2 pages as equal pages if they have the same template id
                    return page.templateId === this.templateId;
                };
                PageBase.prototype.dispose = function () {
                };
                return PageBase;
            }());
            pages.PageBase = PageBase;
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
///<reference path="Pages/PageBase.ts" />
var hj;
(function (hj) {
    var library;
    (function (library) {
        var Application = (function () {
            function Application() {
                var _this = this;
                this.activeSpace = ko.observable(null);
                this.changePasswordDialog = new library.dialogs.ChangePasswordViewModel();
                this.informationDialog = ko.observable(null);
                this.activePage = ko.observable(null);
                this.isAuthenticated = ko.observable(false);
                this.isProcessing = ko.observable(false);
                this.sessionUser = ko.observable(null); // type return user
                this.userFullName = ko.computed(function () {
                    if (this.sessionUser()) {
                        return _this.sessionUser().firstName + ' ' + _this.sessionUser().lastName;
                    }
                });
                this.navigationMenus = [
                    {
                        title: "Home", route: "#/Welcome", isActive: true,
                        navigateHandler: function () {
                            _this.activeSpace().title("Home");
                            _this.activeSpace().pages([]);
                            _this.activeSpace().addPage(new library.pages.HomePageViewModel(), null);
                            //this.activePage(new pages.HomePageViewModel());
                        }
                    },
                    {
                        title: "Users", route: "#/Users", isActive: false,
                        navigateHandler: function () {
                            _this.activeSpace().title("Users");
                            _this.activeSpace().pages([]);
                            _this.activeSpace().addPage(new library.pages.UsersViewModel(), null);
                            //this.activePage(new pages.UsersViewModel());
                        }
                    },
                    {
                        title: "Books", route: "#/Books", isActive: false,
                        navigateHandler: function () {
                            _this.activeSpace().title("Books");
                            _this.activeSpace().pages([]);
                            _this.activeSpace().addPage(new library.pages.BooksViewModel(), null);
                            //this.activePage(new pages.BooksViewModel());
                        }
                    }
                ];
                this.sammyApp = Sammy();
                this.user = new library.authentication.LogonViewModel();
                //this.initializeRouters();
            }
            Object.defineProperty(Application, "instance", {
                get: function () {
                    if (Application._instance == null) {
                        Application._instance = new Application();
                    }
                    return Application._instance;
                },
                enumerable: true,
                configurable: true
            });
            return Application;
        }());
        library.Application = Application;
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var authentication;
        (function (authentication) {
            var LogonViewModel = (function () {
                function LogonViewModel() {
                    var _this = this;
                    this.name = ko.observable("SuperFrank");
                    this.password = ko.observable("Abc_1234");
                    this.token = "";
                    this.tokenType = "";
                    this.logon = function () {
                        library.Application.instance.isProcessing(true);
                        $.ajax({
                            type: 'post',
                            contentType: "application/x-www-form-urlencoded",
                            url: '/oauth/token',
                            data: {
                                grant_type: 'password',
                                username: this.name(),
                                password: this.password()
                            }
                        }).done(this.handleLogonResponse)
                            .fail(this.onLogonFail)
                            .always(function () {
                            library.Application.instance.isProcessing(false);
                        });
                    };
                    this.reset = function () {
                        _this.name('');
                        _this.password('');
                    };
                    this.handleLogonResponse = function (data) {
                        _this.token = data.access_token;
                        _this.tokenType = data.token_type;
                        library.Application.instance.isAuthenticated(true);
                        $.ajaxSetup({
                            headers: {
                                authorization: _this.tokenType + " " + _this.token
                            }
                        });
                        $.ajax({
                            type: 'get',
                            dataType: 'json',
                            url: '/api/accounts/user/' + _this.name()
                        }).done(function (data) {
                            library.Application.instance.activeSpace(new library.Space("Home"));
                            library.Application.instance.activeSpace().addPage(new library.pages.HomePageViewModel(), null);
                            library.Application.instance.sessionUser(data);
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
                        });
                        //library.Application.instance.activePage(new pages.HomePageViewModel());
                        //library.Application.instance.sammyApp.run("#/Welcome");
                    };
                }
                LogonViewModel.prototype.onLogonFail = function (jqXhr) {
                    console.log(jqXhr);
                    alert("failed to logon, press F12, refer to console window output for more details.");
                };
                return LogonViewModel;
            }());
            authentication.LogonViewModel = LogonViewModel;
        })(authentication = library.authentication || (library.authentication = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var ComponentRegistry = (function () {
            function ComponentRegistry() {
            }
            ComponentRegistry.register = function () {
                // Register hj-information-dialog
                ko.components.register("hj-information-dialog", {
                    viewModel: library.dialogs.InformationDialogComponentViewModel, template: library.pages.dialogs.InformationDialogComponentView, synchronous: true
                });
            };
            return ComponentRegistry;
        }());
        library.ComponentRegistry = ComponentRegistry;
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var Bindings = (function () {
            function Bindings() {
            }
            Bindings.registerCustomBinding = function (name, binding, allowVirtualElements) {
                if (allowVirtualElements === void 0) { allowVirtualElements = false; }
                var customHandlers = ko.bindingHandlers;
                customHandlers[name] = binding;
                if (allowVirtualElements) {
                    ko.virtualElements.allowedBindings[name] = true;
                }
            };
            return Bindings;
        }());
        library.Bindings = Bindings;
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
///<reference path="Bindings.ts" />
var hj;
(function (hj) {
    var library;
    (function (library) {
        var CloseOverlayBinding = (function () {
            function CloseOverlayBinding() {
            }
            CloseOverlayBinding.prototype.init = function (element, valueAccessor, allowBindingAccessor, viewModel, bindingContext) {
                var $element = $(element);
                var options = valueAccessor();
                var closeOverlayHandler = function (e) {
                    // Only call this handler if the target is *not* a child element, which means all the other spaces except for this element or its children
                    if ($element.has(e.target).length === 0 && options.action) {
                        options.action();
                    }
                };
                $(document).on("click", closeOverlayHandler);
                // Remove the event handler if Knockout dispose the element
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(document).off("click", closeOverlayHandler);
                });
            };
            return CloseOverlayBinding;
        }());
        library.CloseOverlayBinding = CloseOverlayBinding;
        library.Bindings.registerCustomBinding("closeOverlay", new CloseOverlayBinding());
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
///<reference path="../Bindings.ts" />
var hj;
(function (hj) {
    var library;
    (function (library) {
        var GridBinding = (function () {
            function GridBinding() {
            }
            GridBinding.prototype.update = function (element, valueAccessor, allowBindingAccessor, viewModel, bindingContext) {
                var context = ko.unwrap(valueAccessor());
                var options = ko.unwrap(context.options);
                var configSelectionChangedEvent = function (element, context) {
                    var options = ko.unwrap(context.options);
                    var selectionChanged = context.selectionChanged;
                    // onCheck
                    if (options.onCheck) {
                        var originalOnCheck = options.onCheck;
                        options.onCheck = function (row, $ele) {
                            originalOnCheck(row, $ele);
                            selectionChanged($(element).bootstrapTable('getSelections'));
                        };
                    }
                    else {
                        options.onCheck = function (row, $ele) {
                            selectionChanged($(element).bootstrapTable('getSelections'));
                        };
                    }
                    // onUncheck
                    if (options.onUncheck) {
                        var originalOnUncheck = options.onUncheck;
                        options.onUncheck = function (row, $ele) {
                            originalOnUncheck(row, $ele);
                            selectionChanged($(element).bootstrapTable('getSelections'));
                        };
                    }
                    else {
                        options.onUncheck = function (row, $ele) {
                            selectionChanged($(element).bootstrapTable('getSelections'));
                        };
                    }
                    // onCheckAll
                    if (options.onCheckAll) {
                        var originalOnCheckAll = options.onCheckAll;
                        options.onCheckAll = function (rows) {
                            originalOnCheckAll(rows);
                            selectionChanged($(element).bootstrapTable('getSelections'));
                        };
                    }
                    else {
                        options.onCheckAll = function (rows) {
                            selectionChanged($(element).bootstrapTable('getSelections'));
                        };
                    }
                    // onUncheckAll
                    if (options.onUncheckAll) {
                        var originalOnUncheckAll = options.onUncheckAll;
                        options.originalOnUncheckAll = function (rows) {
                            originalOnCheckAll(rows);
                            selectionChanged($(element).bootstrapTable('getSelections'));
                        };
                    }
                    else {
                        options.onUncheckAll = function (rows) {
                            selectionChanged($(element).bootstrapTable('getSelections'));
                        };
                    }
                };
                if (options) {
                    if (context.selectionChanged) {
                        configSelectionChangedEvent(element, context);
                    }
                    $(element).bootstrapTable(options);
                }
            };
            return GridBinding;
        }());
        library.GridBinding = GridBinding;
        library.Bindings.registerCustomBinding("grid", new GridBinding());
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
///<reference path="Bindings.ts" />
var hj;
(function (hj) {
    var library;
    (function (library) {
        var MenuStatusBinding = (function () {
            function MenuStatusBinding() {
            }
            MenuStatusBinding.prototype.init = function (element, valueAccessor, allowBindingAccessor, viewModel, bindingContext) {
                var ul = $(element);
                ul.children("li").on("click", function () {
                    $(this).siblings().removeClass("active");
                    $(this).addClass("active");
                });
            };
            return MenuStatusBinding;
        }());
        library.MenuStatusBinding = MenuStatusBinding;
        library.Bindings.registerCustomBinding("menuState", new MenuStatusBinding());
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var InformationHandler = (function () {
            function InformationHandler() {
            }
            /**
            * Displays an information dialog
            */
            InformationHandler.report = function (dialogParameters) {
                // TODO: Currently, the information dialog is only for application level, can refactored the code to allow the pages have their own information dialog
                var originalCloseAction = dialogParameters.onClose;
                dialogParameters.onClose = function () {
                    if (originalCloseAction) {
                        originalCloseAction();
                    }
                    library.Application.instance.informationDialog(null);
                };
                library.Application.instance.informationDialog(dialogParameters);
            };
            return InformationHandler;
        }());
        library.InformationHandler = InformationHandler;
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
///<reference path="../PageBase.ts" />
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var BooksViewModel = (function (_super) {
                __extends(BooksViewModel, _super);
                function BooksViewModel() {
                    var _this = this;
                    _super.call(this);
                    this.gridOptions = ko.observable(null);
                    this.selectedBooks = ko.observableArray([]);
                    this.refreshSelection = function (selectedRows) {
                        _this.selectedBooks(selectedRows);
                    };
                    this.detailFormatter = function (index, row, element) {
                        element.html(pages.books.BookDetailsTemplateView);
                        ko.applyBindings(row, element.get(0));
                    };
                    this.add = function () {
                        _this.space.addPage(new pages.EditBookViewModel(), null);
                        //Application.instance.activePage(new EditBook());
                    };
                    this.edit = function (bookId) {
                        _this.space.addPage(new pages.EditBookViewModel(_this.selectedBooks()[0].bookId), null);
                        //Application.instance.activePage(new EditBook(this.selectedBooks()[0].bookId));
                    };
                    this.remove = function () {
                        //TODO: 
                        // 2. Check if it is borrowed by any users/readers, handle these things first and then delete it
                        library.InformationHandler.report({
                            title: "Delete",
                            header: "Please Confirm",
                            message: "Are you sure you want to delete the selected record(s)?",
                            isOKButtonVisible: true,
                            okButtonText: "Delete",
                            isCancelButtonVisible: true,
                            cancelButtonText: "Cancel",
                            onConfirm: function () {
                                removeHandler();
                            }
                        });
                        var removeHandler = function () {
                            _this.isProcessing(true);
                            var promises = [];
                            for (var i = 0; i < _this.selectedBooks().length; i++) {
                                var promise = $.ajax({
                                    type: 'delete',
                                    url: '/api/books/' + _this.selectedBooks()[i].bookId
                                });
                                promises.push(promise);
                            }
                            $.when.apply($, promises).done(function (data) {
                                _this.refresh();
                            }).fail(function (jqXhr, textStatus, err) {
                                alert(err.message);
                            }).always(function () {
                                _this.isProcessing(false);
                            });
                        };
                    };
                    this.refresh = function () {
                        _this.space.addPage(new BooksViewModel(), null);
                        //Application.instance.activePage(new BooksViewModel());
                    };
                    this.templateId = pages.books.BooksViewId;
                    this.title("Books");
                    this.initialize();
                }
                BooksViewModel.prototype.initialize = function () {
                    var _this = this;
                    this.isProcessing(true);
                    $.ajax({
                        type: 'get',
                        accepts: 'application/json',
                        url: '/api/books'
                    }).done(function (books) {
                        _this.gridOptions({
                            data: books,
                            columns: [
                                {
                                    checkbox: true
                                },
                                {
                                    title: 'Title',
                                    field: 'name'
                                },
                                {
                                    title: 'Author',
                                    field: 'author'
                                },
                                {
                                    title: 'Publisher',
                                    field: "publisher"
                                },
                                {
                                    title: "Publication Date",
                                    field: 'publicationDate',
                                    formatter: function (value) {
                                        return moment(value).format("MM-DD-YYYY");
                                    }
                                }
                            ],
                            striped: true,
                            sortable: true,
                            pagination: true,
                            pageNumber: 1,
                            pageSize: 10,
                            pageList: [10, 20, 50, 100],
                            clickToSelect: true,
                            detailView: true,
                            detailFormatter: _this.detailFormatter
                        });
                    }).fail(function (jqXhr, textStatus, err) {
                        alert(err.message);
                    }).always(function () {
                        _this.isProcessing(false);
                    });
                };
                return BooksViewModel;
            }(pages.PageBase));
            pages.BooksViewModel = BooksViewModel;
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var EditBookViewModel = (function (_super) {
                __extends(EditBookViewModel, _super);
                function EditBookViewModel(bookId) {
                    var _this = this;
                    _super.call(this);
                    this.bookId = bookId;
                    this.isEditingMode = ko.observable(false);
                    this.isbn = ko.observable('');
                    this.bookTitle = ko.observable('');
                    this.author = ko.observable('');
                    this.publisher = ko.observable('');
                    this.publicationDate = ko.observable(null);
                    this.pages = ko.observable(undefined);
                    this.copies = ko.observable(undefined);
                    this.owner = ko.observable('');
                    this.comment = ko.observable('');
                    this.create = function () {
                        _this.isProcessing(true);
                        $.ajax({
                            type: 'post',
                            contentType: 'application/json',
                            url: '/api/books',
                            data: JSON.stringify({
                                BookId: '3a519f4d-107d-4d5f-9572-325a3c027a50',
                                ISBN: _this.isbn(),
                                Name: _this.bookTitle(),
                                Author: _this.author(),
                                Publisher: _this.publisher(),
                                PublicationDate: _this.publicationDate(),
                                Pages: _this.pages(),
                                Copies: _this.copies(),
                                Owner: _this.owner(),
                                Comment: _this.comment()
                            })
                        }).done(function () {
                            _this.space.addPage(new pages.BooksViewModel(), null);
                            //Application.instance.activePage(new BooksViewModel());
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
                        }).always(function () {
                            _this.isProcessing(false);
                        });
                    };
                    this.update = function () {
                        _this.isProcessing(true);
                        $.ajax({
                            type: 'put',
                            contentType: 'application/json',
                            url: '/api/books/' + _this.bookId,
                            data: JSON.stringify({
                                BookId: _this.bookId,
                                ISBN: _this.isbn(),
                                Name: _this.bookTitle(),
                                Author: _this.author(),
                                Publisher: _this.publisher(),
                                PublicationDate: _this.publicationDate(),
                                Pages: _this.pages(),
                                Copies: _this.copies(),
                                Owner: _this.owner(),
                                Comment: _this.comment()
                            })
                        }).done(function (data, textStatus, jqXHR) {
                            _this.space.addPage(new pages.BooksViewModel(), null);
                            //Application.instance.activePage(new BooksViewModel());
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
                        }).always(function () {
                            _this.isProcessing(false);
                        });
                    };
                    this.cancel = function () {
                        library.Application.instance.activePage(new pages.BooksViewModel());
                    };
                    this.templateId = pages.books.EditBookViewId;
                    this.initialize(bookId);
                }
                EditBookViewModel.prototype.initialize = function (bookId) {
                    var _this = this;
                    if (bookId) {
                        this.isEditingMode(true);
                        this.title('Edit Book');
                        this.isProcessing(true);
                        $.ajax({
                            type: 'get',
                            accepts: 'application/json',
                            url: "/api/books/" + bookId
                        }).done(function (book) {
                            _this.isbn(book.isbn);
                            _this.bookTitle(book.name);
                            _this.author(book.author);
                            _this.publisher(book.publisher);
                            _this.publicationDate(book.publicationDate);
                            _this.pages(book.pages);
                            _this.copies(book.copies);
                            _this.owner(book.owner);
                            _this.comment(book.comment);
                        }).fail(function (jqXHR, textStatus, err) {
                            alert(err.message);
                        }).always(function () {
                            _this.isProcessing(false);
                        });
                    }
                    else {
                        this.isEditingMode(false);
                        this.title('Create New Book');
                    }
                };
                return EditBookViewModel;
            }(pages.PageBase));
            pages.EditBookViewModel = EditBookViewModel;
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var dialogs;
        (function (dialogs) {
            var ChangePasswordViewModel = (function () {
                function ChangePasswordViewModel() {
                    var _this = this;
                    this.oldPassword = ko.observable('');
                    this.newPassword = ko.observable('');
                    this.confirmPassword = ko.observable('');
                    this.changePassword = function () {
                        if (_this.newPassword() !== _this.confirmPassword()) {
                            alert('The new password and confirm password should be identical.');
                            return;
                        }
                        library.Application.instance.isProcessing(true);
                        $.ajax({
                            type: 'post',
                            contentType: 'application/json',
                            url: '/api/accounts/changepassword',
                            data: JSON.stringify({
                                OldPassword: _this.oldPassword(),
                                NewPassword: _this.newPassword()
                            })
                        }).done(function () {
                            alert("Password changed sucessfully.");
                            _this.oldPassword('');
                            _this.newPassword('');
                            _this.confirmPassword('');
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
                        }).always(function () {
                            library.Application.instance.isProcessing(false);
                        });
                    };
                }
                return ChangePasswordViewModel;
            }());
            dialogs.ChangePasswordViewModel = ChangePasswordViewModel;
        })(dialogs = library.dialogs || (library.dialogs = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var dialogs;
        (function (dialogs) {
            var InformationDialogComponentViewModel = (function () {
                function InformationDialogComponentViewModel(parameters) {
                    this.confirmClick = function () {
                        if (this._onClose) {
                            this._onClose();
                        }
                        if (this._onConfirm) {
                            this._onConfirm();
                        }
                    };
                    this.cancelClick = function () {
                        if (this._onClose) {
                            this._onClose();
                        }
                        if (this._onCancel) {
                            this._onCancel();
                        }
                    };
                    parameters = ko.unwrap(parameters.context || parameters);
                    this._title = parameters.title;
                    this._header = parameters.header;
                    this._message = parameters.message;
                    this._okButtonText = parameters.okButtonText;
                    this._cancelButtonText = parameters.cancelButtonText;
                    this._onConfirm = parameters.onConfirm;
                    this._onCancel = parameters.onCancel;
                    this._onClose = parameters.onClose;
                    if (parameters.isOKButtonVisible === true || parameters.isOKButtonVisible === false) {
                        this._isOKButtonVisible = parameters.isOKButtonVisible;
                    }
                    else {
                        this._isOKButtonVisible = true; // By default, OK button is visible.
                    }
                    if (parameters.isCancelButtonVisible === true || parameters.isCancelButtonVisible === false) {
                        this._isCancelButtonVisible = parameters.isCancelButtonVisible;
                    }
                    else {
                        this._isCancelButtonVisible = true; // By default, Cancel button is visible.
                    }
                }
                return InformationDialogComponentViewModel;
            }());
            dialogs.InformationDialogComponentViewModel = InformationDialogComponentViewModel;
        })(dialogs = library.dialogs || (library.dialogs = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
///<reference path="PageBase.ts" />
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var HomePageViewModel = (function (_super) {
                __extends(HomePageViewModel, _super);
                function HomePageViewModel() {
                    _super.call(this);
                    this.templateId = hj.library.pages.HomePageViewId;
                    this.title("Home");
                }
                return HomePageViewModel;
            }(pages.PageBase));
            pages.HomePageViewModel = HomePageViewModel;
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
///<reference path="../PageBase.ts" />
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var EditUserViewModel = (function (_super) {
                __extends(EditUserViewModel, _super);
                function EditUserViewModel(user) {
                    var _this = this;
                    _super.call(this);
                    this.email = ko.observable('');
                    this.userName = ko.observable('');
                    this.firstName = ko.observable('');
                    this.lastName = ko.observable('');
                    this.roleName = ko.observable('');
                    this.password = ko.observable('');
                    this.confirmPassword = ko.observable('');
                    this.isUserRole = ko.observable(false);
                    this.isAdminRole = ko.observable(false);
                    this.isSuperAdmin = ko.observable(false);
                    this.selectedRoles = ko.observableArray([]);
                    this.isEditingMode = ko.observable(false);
                    this.createUser = function () {
                        _this.isProcessing(true);
                        $.ajax({
                            type: 'post',
                            contentType: 'application/json',
                            url: '/api/accounts/create',
                            dataType: 'json',
                            data: JSON.stringify({
                                FirstName: _this.firstName(),
                                LastName: _this.lastName(),
                                UserName: _this.userName(),
                                Email: _this.email(),
                                RoleName: _this.selectedRoles().toString(),
                                Password: _this.password()
                            })
                        }).done(function () {
                            _this.space.addPage(new pages.UsersViewModel(), null);
                            //Application.instance.activePage(new UsersViewModel());
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
                        }).always(function () {
                            _this.isProcessing(false);
                        });
                    };
                    this.updateUser = function () {
                        _this.isProcessing(true);
                        $.ajax({
                            type: 'put',
                            contentType: 'application/json',
                            url: '/api/accounts/user',
                            data: JSON.stringify({
                                Id: _this.userId,
                                FirstName: _this.firstName(),
                                LastName: _this.lastName(),
                                RoleName: _this.selectedRoles().toString()
                            })
                        }).done(function () {
                            _this.space.addPage(new pages.UsersViewModel(), null);
                            //Application.instance.activePage(new UsersViewModel());
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
                        }).always(function () {
                            _this.isProcessing(false);
                        });
                    };
                    this.cancel = function () {
                        library.Application.instance.activePage(new pages.UsersViewModel());
                    };
                    this.title('Create User');
                    this.templateId = pages.users.EditUserViewId;
                    this.initialize(user);
                }
                EditUserViewModel.prototype.initialize = function (user) {
                    var _this = this;
                    if (user) {
                        this.isEditingMode(true);
                        this.title('Edit User');
                        this.isProcessing(true);
                        $.ajax({
                            type: 'get',
                            accepts: "application/json",
                            url: '/api/accounts/user/' + user.userName
                        }).done(function (user) {
                            _this.userId = user.id;
                            _this.email(user.email);
                            _this.userName(user.userName);
                            _this.firstName(user.firstName);
                            _this.lastName(user.lastName);
                            _this.selectedRoles(user.roles);
                        }).fail(function () {
                        }).always(function () {
                            _this.isProcessing(false);
                        });
                    }
                };
                return EditUserViewModel;
            }(pages.PageBase));
            pages.EditUserViewModel = EditUserViewModel;
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
///<reference path="../PageBase.ts" />
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var UsersViewModel = (function (_super) {
                __extends(UsersViewModel, _super);
                function UsersViewModel() {
                    var _this = this;
                    _super.call(this);
                    this.users = ko.observableArray([]);
                    this.gridOptions = ko.observable(null);
                    this.selectedUsers = ko.observableArray([]);
                    this.refreshSelection = function (selectedRows) {
                        _this.selectedUsers(selectedRows);
                    };
                    this.edit = function (userName) {
                        //Application.instance.activePage(new EditUserViewModel(this.selectedUsers()[0]));
                        _this.space.addPage(new pages.EditUserViewModel(_this.selectedUsers()[0]), null);
                    };
                    this.add = function () {
                        _this.space.addPage(new pages.EditUserViewModel(), null);
                        //Application.instance.activePage(new EditUserViewModel());
                    };
                    this.remove = function () {
                        //TODO: 
                        // 2. Check if it has any books not returned or owned any books, handle these things first and then delete it
                        library.InformationHandler.report({
                            title: "Delete",
                            header: "Please Confirm",
                            message: "Are you sure you want to delete the selected record(s)?",
                            isOKButtonVisible: true,
                            okButtonText: "Delete",
                            isCancelButtonVisible: true,
                            cancelButtonText: "Cancel",
                            onConfirm: function () {
                                removeHandler();
                            }
                        });
                        var removeHandler = function () {
                            _this.isProcessing(true);
                            var promises = [];
                            for (var i = 0; i < _this.selectedUsers().length; i++) {
                                var promise = $.ajax({
                                    type: 'delete',
                                    url: '/api/accounts/user/' + _this.selectedUsers()[i].id
                                });
                                promises.push(promise);
                            }
                            $.when.apply($, promises).done(function () {
                                _this.refresh();
                            }).fail(function (jqXhr, textStatus, err) {
                                alert(err.message);
                            }).always(function () {
                                _this.isProcessing(false);
                            });
                        };
                    };
                    this.refresh = function () {
                        _this.space.addPage(new UsersViewModel(), null);
                        //Application.instance.activePage(new UsersViewModel());
                    };
                    this.templateId = pages.users.UsersViewId;
                    this.title("Users");
                    this.initialize();
                }
                UsersViewModel.prototype.initialize = function () {
                    var _this = this;
                    this.isProcessing(true);
                    $.ajax({
                        type: 'get',
                        accepts: "application/json",
                        url: '/api/accounts/users'
                    }).done(function (users) {
                        _this.users(users);
                        _this.gridOptions({
                            data: users,
                            columns: [
                                {
                                    checkbox: true
                                },
                                {
                                    title: "Name",
                                    formatter: function (value, row) {
                                        return row.firstName + ' ' + row.lastName;
                                    }
                                },
                                {
                                    title: "Logon Name",
                                    field: "userName"
                                },
                                {
                                    title: "Email",
                                    field: "email"
                                },
                                {
                                    title: "Roles",
                                    field: "roles",
                                    formatter: function (value) {
                                        return value.toString();
                                    }
                                },
                                {
                                    title: "Id",
                                    field: "id",
                                    visible: false
                                }
                            ],
                            striped: true,
                            sortable: true,
                            pagination: true,
                            pageNumber: 1,
                            pageSize: 10,
                            pageList: [10, 20, 50, 100],
                            clickToSelect: true
                        });
                    })
                        .fail(function () { })
                        .always(function () {
                        _this.isProcessing(false);
                    });
                };
                return UsersViewModel;
            }(pages.PageBase));
            pages.UsersViewModel = UsersViewModel;
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var Space = (function () {
            function Space(title) {
                var _this = this;
                this.pages = ko.observableArray([]);
                this.activePage = ko.observable(null);
                this.isProcessing = ko.observable(false);
                this.isActive = ko.observable(true);
                this.isPreviousButtonEnabled = ko.computed(function () {
                    var that = _this;
                    return _this.pages().indexOf(_this.activePage()) > 0 && (_this.activePage() && !_this.activePage().isProcessing());
                });
                this.isNextButtonEnabled = ko.computed(function () {
                    return _this.pages().indexOf(_this.activePage()) < _this.pages().length - 1 && (_this.activePage() && !_this.activePage().isProcessing());
                });
                this.isPagesButtonEnabled = ko.computed(function () {
                    return _this.activePage() && !_this.activePage().isProcessing();
                });
                this.goToPreviousPage = function () {
                    if (_this.activePage()) {
                        _this.activePage().onBeforeNavigateAway(_this.doGoToPreviousPage);
                    }
                };
                this.doGoToPreviousPage = function () {
                    var previousPageIndex = Math.max(0, _this.pages().indexOf(_this.activePage()) - 1);
                    _this.setActivePage(_this.pages()[previousPageIndex]);
                };
                this.goToNextPage = function () {
                    if (_this.activePage()) {
                        _this.activePage().onBeforeNavigateAway(_this.doGoToNextPage);
                    }
                };
                this.doGoToNextPage = function () {
                    var nextPageIndex = Math.max(_this.pages().length - 1, _this.pages().indexOf(_this.activePage()) + 1);
                    _this.setActivePage(_this.pages()[nextPageIndex]);
                };
                this.goToPage = function (page) {
                    if (_this.activePage()) {
                        _this.activePage().onBeforeNavigateAway(function () { _this.setActivePage(page); });
                    }
                    else {
                        _this.setActivePage(page);
                    }
                };
                this.setActivePage = function (page) {
                    if (_this.activePage()) {
                        _this.activePage().isVisible(false);
                    }
                    page.isVisible(true);
                    _this.activePage(page);
                };
                this.id = library.Utils.guid();
                this.title = ko.observable(title);
            }
            Space.prototype.addPage = function (page, parameters, removeForwardPages) {
                var _this = this;
                if (removeForwardPages === void 0) { removeForwardPages = true; }
                var handler = function () {
                    page.space = _this;
                    page.parameters = parameters;
                    var existingPage = ko.utils.arrayFirst(_this.pages(), function (x) { return x.equals(page); });
                    if (existingPage) {
                        _this.pages.replace(existingPage, page);
                    }
                    else {
                        if (removeForwardPages) {
                            _this.removeAllPagesAfterActive();
                        }
                        _this.pages.push(page);
                    }
                    _this.setActivePage(page);
                };
                if (this._onBeforeAddPage) {
                    this._onBeforeAddPage(page, this, handler, function () { });
                }
                else {
                    handler();
                }
            };
            Space.prototype.removePage = function (page) {
                page.dispose();
                this.pages.remove(page);
                if (this.activePage() === page) {
                    if (this.pages().length > 0) {
                        // Set the last page as acitve page
                        this.setActivePage(this.pages()[this.pages().length - 1]);
                    }
                    else {
                        this.setActivePage(null);
                    }
                }
            };
            Space.prototype.onBeforeAddPage = function (onBeforeAddPage) {
                if (!this._onBeforeAddPage) {
                    this._onBeforeAddPage = onBeforeAddPage;
                }
            };
            Space.prototype.removeAllPagesAfterActive = function () {
                var _this = this;
                if (this.pages().length === 0)
                    return;
                var activePageIndex = this.pages().indexOf(this.activePage());
                if (activePageIndex === this.pages().length - 1)
                    return;
                var pagesToRemove = this.pages().slice(activePageIndex + 1);
                pagesToRemove.forEach(function (page) {
                    page.dispose();
                    _this.pages.remove(page);
                });
            };
            return Space;
        }());
        library.Space = Space;
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var Utils = (function () {
            function Utils() {
            }
            Utils.guid = function () {
                var p8 = function (s) {
                    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
                };
                return p8(false) + p8(true) + p8(true) + p8(false);
            };
            return Utils;
        }());
        library.Utils = Utils;
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var authentication;
        (function (authentication) {
            authentication.LogonView = "\u003cdiv class=\"container logon\"\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-offset-3 col-md-6\"\u003e\r\n            \u003cdiv class=\"header\"\u003e\r\n                \u003cspan\u003eLogin\u003c/span\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"form-group\"\u003e\r\n                \u003cinput type=\"text\" class=\"form-control\" placeholder=\"account\" data-bind=\"value: name\" /\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"form-group\"\u003e\r\n                \u003cinput type=\"password\" class=\"form-control\" placeholder=\"password\" data-bind=\"value: password\" /\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"footer\"\u003e\r\n                \u003cbutton class=\"btn btn-default\" data-bind=\"click: reset\"\u003eReset\u003c/button\u003e\r\n                \u003cbutton class=\"btn btn-default\" data-bind=\"click: logon\"\u003eSign In\u003c/button\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e";
            authentication.LogonViewId = "hj-library-authentication-LogonView";
        })(authentication = library.authentication || (library.authentication = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            pages.HomePageView = "\u003cdiv\u003e\r\n    \u003cspn\u003eWelcome!\u003c/spn\u003e\r\n\u003c/div\u003e\r\n";
            pages.HomePageViewId = "hj-library-pages-HomePageView";
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var books;
            (function (books) {
                books.BookDetailsTemplateView = "\u003cdiv class=\"container\"\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eTitle:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: name\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eAuthor:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: author\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eISBN:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: isbn\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003ePublisher:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: publisher\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003ePublication Date:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: moment(publicationDate).format(\u0027MM-DD-YYYY\u0027)\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003ePages:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: pages\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eCopies:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: copies\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eOwner:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: owner\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eComment:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-10\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: comment\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n";
                books.BookDetailsTemplateViewId = "hj-library-pages-books-BookDetailsTemplateView";
                books.BooksView = "\u003cdiv id=\"books-toolbar\" class=\"grid-toolbar\"\u003e\r\n    \u003cbutton id=\"books-add\" class=\"btn btn-default\" data-bind=\"click: add\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-plus\"\u003e\u003c/i\u003eAdd\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"books-edit\" class=\"btn btn-default\" data-bind=\"click: edit, enable: selectedBooks().length === 1 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-edit\"\u003e\u003c/i\u003eEdit\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"books-remove\" class=\"btn btn-danger\" data-bind=\"click: remove, enable: selectedBooks().length \u003e 0 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-remove\"\u003e\u003c/i\u003eDelete\r\n    \u003c/button\u003e\r\n\u003c/div\u003e\r\n\u003ctable data-bind=\"grid: {options: gridOptions, selectionChanged: refreshSelection}\"\u003e\u003c/table\u003e";
                books.BooksViewId = "hj-library-pages-books-BooksView";
                books.EditBookView = "\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eISBN\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"ISBN\" data-bind=\"value: isbn\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eTitle\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Title\" data-bind=\"value: bookTitle\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eAuthor\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Author\" data-bind=\"value: author\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003ePublisher\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Publisher\" data-bind=\"value: publisher\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003ePublication Date\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Publication Date\" data-bind=\"datepicker: publicationDate, datepickerOptions: {format: \u0027MM/DD/YYYY\u0027}\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003ePages\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Pages\" data-bind=\"value: pages\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eCopies\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Copies\" data-bind=\"value: copies\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eOwner\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Owner\" data-bind=\"value: owner\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eComment\u003c/label\u003e\r\n    \u003ctextarea class=\"form-control\" rows=\"3\" placeholder=\"any comments\" data-bind=\"value: comment\" /\u003e\r\n\u003c/div\u003e\r\n\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: create, visible: !isEditingMode()\"\u003eCreate\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: update, visible: isEditingMode\"\u003eSave\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: cancel\"\u003eCancel\u003c/button\u003e";
                books.EditBookViewId = "hj-library-pages-books-EditBookView";
            })(books = pages.books || (pages.books = {}));
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var dialogs;
            (function (dialogs) {
                dialogs.ChangePasswordDialogView = "\u003cdiv id=\"changePassword\" class=\"modal fade change-password\" data-backdrop=\"static\"\u003e\r\n    \u003cdiv class=\"modal-dialog\"\u003e\r\n        \u003cdiv class=\"modal-content\"\u003e\r\n            \u003cdiv class=\"modal-header\"\u003e\r\n                \u003cbutton class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"\u003e\u0026times;\u003c/button\u003e\r\n                \u003ch3 class=\"modal-title\"\u003eChange Password\u003c/h3\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"modal-body\"\u003e\r\n                \u003cdiv class=\"form-group\"\u003e\r\n                    \u003clabel\u003eOld Password\u003c/label\u003e\r\n                    \u003cinput class=\"form-control\" type=\"password\" placeholder=\"old password\" data-bind=\"value: oldPassword\" /\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv class=\"form-group\"\u003e\r\n                    \u003clabel\u003eNew Password\u003c/label\u003e\r\n                    \u003cinput class=\"form-control\" type=\"password\" placeholder=\"new password\" data-bind=\"value: newPassword\" /\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv class=\"form-group\"\u003e\r\n                    \u003clabel\u003eConfirm Password\u003c/label\u003e\r\n                    \u003cinput class=\"form-control\" type=\"password\" placeholder=\"confirm password\" data-bind=\"value: confirmPassword\" /\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"modal-footer\"\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cbutton class=\"btn btn-default\" data-dismiss=\"modal\"\u003eClose\u003c/button\u003e\r\n                    \u003cbutton class=\"btn btn-default change-button\" data-dismiss=\"modal\" data-bind=\"click: changePassword\"\u003eChange\u003c/button\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n";
                dialogs.ChangePasswordDialogViewId = "hj-library-pages-dialogs-ChangePasswordDialogView";
                dialogs.InformationDialogComponentView = "\u003cdiv class=\"dialog-overlay-layer\"\u003e\r\n    \u003cdiv class=\"dialog-container\"\u003e\r\n        \u003cdiv class=\"dialog-header\"\u003e\r\n            \u003cspan class=\"dialog-page-title\" data-bind=\"text: _title\"\u003e\u003c/span\u003e\r\n        \u003c/div\u003e\r\n        \u003cdiv class=\"dialog-content\"\u003e\r\n            \u003cspan class=\"dialog-header-message\" data-bind=\"text: _header\"\u003e\u003c/span\u003e\r\n            \u003cdiv class=\"dialog-message\" data-bind=\"text: _message\"\u003e\u003c/div\u003e\r\n        \u003c/div\u003e\r\n        \u003cdiv class=\"dialog-footer\"\u003e\r\n            \u003c!-- ko if: _isOKButtonVisible --\u003e\r\n            \u003cbutton class=\"btn btn-default\" data-bind=\"text: _okButtonText, click: confirmClick\"\u003e\u003c/button\u003e\r\n            \u003c!-- /ko --\u003e\r\n            \u003c!-- ko if: _isCancelButtonVisible --\u003e\r\n            \u003cbutton class=\"btn btn-default\" data-bind=\"text: _cancelButtonText, click: cancelClick\"\u003e\u003c/button\u003e\r\n            \u003c!-- /ko --\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n";
                dialogs.InformationDialogComponentViewId = "hj-library-pages-dialogs-InformationDialogComponentView";
                dialogs.ProgressBarView = "\u003cdiv class=\"dialog-overlay-layer\"\u003e\r\n    \u003cdiv class=\"progress progress-striped active progress-bar-dialog\"\u003e\r\n        \u003cdiv class=\"progress-bar progress-bar-info\"\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n";
                dialogs.ProgressBarViewId = "hj-library-pages-dialogs-ProgressBarView";
                dialogs.UserProfileDialogView = "\u003cdiv id=\"userProfile\" class=\"modal fade user-profile\" data-backdrop=\"static\"\u003e\r\n    \u003cdiv class=\"modal-dialog\"\u003e\r\n        \u003cdiv class=\"modal-content\"\u003e\r\n            \u003cdiv class=\"modal-header\"\u003e\r\n                \u003cbutton class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"\u003e\u0026times;\u003c/button\u003e\r\n                \u003ch3 class=\"modal-title\"\u003eUser Profile\u003c/h3\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"modal-body\"\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eFirst Name: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: firstName\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eLast Name: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: lastName\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eLogon Name: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: userName\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eEmail: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: email\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eRoles: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: roles.toString()\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"modal-footer\"\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cbutton class=\"btn btn-default\" data-dismiss=\"modal\"\u003eOK\u003c/button\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n";
                dialogs.UserProfileDialogViewId = "hj-library-pages-dialogs-UserProfileDialogView";
            })(dialogs = pages.dialogs || (pages.dialogs = {}));
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var users;
            (function (users) {
                users.EditUserView = "\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eEmail\u003c/label\u003e\r\n    \u003cinput type=\"email\" class=\"form-control\" placeholder=\"email address\" data-bind=\"value: email, enable: !isEditingMode()\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eLogin Name\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Login Name\" data-bind=\"value: userName, enable: !isEditingMode()\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eFirst Name\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"First Name\" data-bind=\"value: firstName\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eLast Name\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Last Name\" data-bind=\"value: lastName\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eRoles\u003c/label\u003e\r\n    \u003cdiv class=\"panel panel-default\"\u003e\r\n        \u003cdiv class=\"panel-body\"\u003e\r\n            \u003cdiv class=\"checkbox\"\u003e\r\n                \u003clabel\u003e\u003cinput type=\"checkbox\" value=\"User\" data-bind=\"checked: selectedRoles\" /\u003eUser\u003c/label\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"checkbox\"\u003e\r\n                \u003clabel\u003e\u003cinput type=\"checkbox\" value=\"Admin\" data-bind=\"checked: selectedRoles\" /\u003eAdmin\u003c/label\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"checkbox\"\u003e\r\n                \u003clabel\u003e\u003cinput type=\"checkbox\" value=\"SuperAdmin\" data-bind=\"checked: selectedRoles\" /\u003eSuperAdmin\u003c/label\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n\u003c!-- TODO: Add the option to use default password --\u003e\r\n\u003cdiv class=\"form-group\" data-bind=\"visible: !isEditingMode()\"\u003e\r\n    \u003clabel\u003ePassword\u003c/label\u003e\r\n    \u003cinput type=\"password\"class=\"form-control\" placeholder=\"Password\" data-bind=\"value: password\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\" data-bind=\"visible: !isEditingMode()\"\u003e\r\n    \u003clabel\u003eConfirm Password\u003c/label\u003e\r\n    \u003cinput type=\"password\" class=\"form-control\" placeholder=\"Confirm Password\" data-bind=\"value: confirmPassword\" /\u003e\r\n\u003c/div\u003e\r\n\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: createUser, visible: !isEditingMode()\"\u003eCreate\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: updateUser, visible: isEditingMode\"\u003eSave\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: cancel\"\u003eCancel\u003c/button\u003e";
                users.EditUserViewId = "hj-library-pages-users-EditUserView";
                users.UsersView = "\u003cdiv id=\"users-toolbar\" class=\"grid-toolbar\"\u003e\r\n    \u003cbutton id=\"users-add\" class=\"btn btn-default\" data-bind=\"click: add\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-plus\"\u003e\u003c/i\u003eAdd\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"users-edit\" class=\"btn btn-default\" data-bind=\"click: edit, enable: selectedUsers().length === 1 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-edit\"\u003e\u003c/i\u003eEdit\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"users-remove\" class=\"btn btn-danger\" data-bind=\"click: remove, enable: selectedUsers().length \u003e 0 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-remove\"\u003e\u003c/i\u003eDelete\r\n    \u003c/button\u003e\r\n\u003c/div\u003e\r\n\u003ctable id=\"users\" data-bind=\"grid: {options: gridOptions, selectionChanged: refreshSelection}\"\u003e\u003c/table\u003e\r\n";
                users.UsersViewId = "hj-library-pages-users-UsersView";
            })(users = pages.users || (pages.users = {}));
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
var hj;
(function (hj) {
    var library;
    (function (library) {
        var views;
        (function (views) {
            function register() {
                var bodyElement = $('body');
                bodyElement.append('<script type="text/html" id="hj-library-authentication-LogonView">' + hj.library.authentication.LogonView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-HomePageView">' + hj.library.pages.HomePageView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-books-BookDetailsTemplateView">' + hj.library.pages.books.BookDetailsTemplateView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-books-BooksView">' + hj.library.pages.books.BooksView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-books-EditBookView">' + hj.library.pages.books.EditBookView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-dialogs-ChangePasswordDialogView">' + hj.library.pages.dialogs.ChangePasswordDialogView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-dialogs-InformationDialogComponentView">' + hj.library.pages.dialogs.InformationDialogComponentView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-dialogs-ProgressBarView">' + hj.library.pages.dialogs.ProgressBarView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-dialogs-UserProfileDialogView">' + hj.library.pages.dialogs.UserProfileDialogView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-users-EditUserView">' + hj.library.pages.users.EditUserView + '</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-users-UsersView">' + hj.library.pages.users.UsersView + '</script>');
            }
            views.register = register;
        })(views = library.views || (library.views = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
//# sourceMappingURL=ApplicationOutput.js.map