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
                }
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
                this.activePage = ko.observable(null);
                this.isAuthenticated = ko.observable(false);
                this.sessionUser = ko.observable(null); // type return user
                this.userFullName = ko.computed(function () {
                    if (_this.sessionUser()) {
                        return _this.sessionUser().firstName + ' ' + _this.sessionUser().lastName;
                    }
                });
                this.oldPassword = ko.observable('');
                this.newPassword = ko.observable('');
                this.confirmPassword = ko.observable('');
                this.navigationMenus = [
                    { title: "Home", route: "#/Welcome", isActive: true },
                    { title: "Users", route: "#/Users", isActive: false },
                    { title: "Books", route: "#/Books", isActive: false }
                ];
                this.sammyApp = Sammy();
                this.changePassword = function () {
                    if (_this.newPassword() !== _this.confirmPassword()) {
                        alert('The new password and confirm password should be identical.');
                        return;
                    }
                    $.ajax({
                        type: 'post',
                        contentType: 'application/json',
                        url: '/api/accounts/changepassword',
                        data: JSON.stringify({
                            OldPassword: _this.oldPassword(),
                            NewPassword: _this.newPassword()
                        })
                    }).done(function () {
                        $('div#changePassword').modal('hide');
                        alert("Password changed sucessfully.");
                        _this.oldPassword('');
                        _this.newPassword('');
                        _this.confirmPassword('');
                    }).fail(function (jqXhr, textStatus, err) {
                        alert(err.message);
                    });
                };
                this.user = new library.authentication.LogonViewModel();
                this.initializeRouters();
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
            Application.prototype.initializeRouters = function () {
                var _this = this;
                this.sammyApp.get("#/Welcome", function (context) {
                    _this.activePage(new library.pages.HomePageViewModel());
                });
                this.sammyApp.get("#/Users", function (context) {
                    _this.activePage(new library.pages.UsersViewModel());
                });
                this.sammyApp.get("#/Books", function (context) {
                    _this.activePage(new library.pages.HomePageViewModel());
                });
            };
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
                        $.ajax({
                            type: 'post',
                            contentType: "application/x-www-form-urlencoded",
                            url: '/oauth/token',
                            data: {
                                grant_type: 'password',
                                username: _this.name(),
                                password: _this.password()
                            }
                        }).done(_this.handleLogonResponse)
                            .fail(_this.onLogonFail);
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
                            library.Application.instance.sessionUser(data);
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
                        });
                        //library.Application.instance.activePage(new pages.HomePageViewModel());
                        library.Application.instance.sammyApp.run("#/Welcome");
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
                            library.Application.instance.activePage(new pages.UsersViewModel());
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
                        });
                    };
                    this.updateUser = function () {
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
                            library.Application.instance.activePage(new pages.UsersViewModel());
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
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
                        })
                            .fail(function () { });
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
                        library.Application.instance.activePage(new pages.EditUserViewModel(_this.selectedUsers()[0]));
                    };
                    this.add = function () {
                        library.Application.instance.activePage(new pages.EditUserViewModel());
                    };
                    this.remove = function () {
                        //TODO: 
                        // 1. Confirmation dialog
                        // 2. Check if it has any books not returned or owned any books, handl these things first and then delete it
                        $.ajax({
                            type: 'delete',
                            url: '/api/accounts/user/' + _this.selectedUsers()[0].id
                        }).done(function () {
                            _this.refresh();
                        }).fail(function (jqXhr, textStatus, err) {
                            alert(err.message);
                        });
                    };
                    this.refresh = function () {
                        library.Application.instance.activePage(new UsersViewModel());
                    };
                    this.templateId = pages.users.UsersViewId;
                    this.title("Users");
                    this.initialize();
                }
                UsersViewModel.prototype.initialize = function () {
                    var _this = this;
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
                        .fail(function () { });
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
        var authentication;
        (function (authentication) {
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
            var modaldialogs;
            (function (modaldialogs) {
                modaldialogs.changePasswordViewId = "hj-library-pages-modaldialogs-changePasswordView";
                modaldialogs.UserProfileViewId = "hj-library-pages-modaldialogs-UserProfileView";
            })(modaldialogs = pages.modaldialogs || (pages.modaldialogs = {}));
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
                users.EditUserViewId = "hj-library-pages-users-EditUserView";
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
                bodyElement.append('<script type="text/html" id="hj-library-authentication-LogonView">\u003c!--\u003cdiv\u003e\r\n    Name: \r\n    \u003cinput type=\"text\" data-bind=\"value: name\" /\u003e\r\n    \u003cbr /\u003e\r\n    Password: \r\n    \u003cinput type=\"password\" data-bind=\"value: password\" /\u003e\r\n    \u003cbr /\u003e\r\n    \u003cbutton data-bind=\"click: logon\"\u003eLogon\u003c/button\u003e\r\n\u003c/div\u003e--\u003e\r\n\r\n\u003cdiv class=\"container\"\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-offset-3 col-md-6\"\u003e\r\n            \u003cdiv style=\"padding: 10px; text-align: center\"\u003e\r\n                \u003cspan style=\"font-size: 30px\"\u003eLogin\u003c/span\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"form-group\"\u003e\r\n                \u003cinput type=\"text\" class=\"form-control\" placeholder=\"account\" data-bind=\"value: name\" /\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"form-group\"\u003e\r\n                \u003cinput type=\"password\" class=\"form-control\" placeholder=\"password\" data-bind=\"value: password\" /\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv style=\"float: right;\"\u003e\r\n                \u003cbutton class=\"btn btn-default\" data-bind=\"click: reset\"\u003eReset\u003c/button\u003e\r\n                \u003cbutton class=\"btn btn-default\" data-bind=\"click: logon\" style=\"margin: 0 10px\"\u003eSign In\u003c/button\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-HomePageView">\u003cdiv\u003e\r\n    \u003ch1\u003eWelcome!\u003c/h1\u003e\r\n\u003c/div\u003e\r\n</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-modaldialogs-changePasswordView">\u003cdiv id=\"changePassword\" class=\"modal fade\"\u003e\r\n    \u003cdiv class=\"modal-dialog\"\u003e\r\n        \u003cdiv class=\"modal-content\"\u003e\r\n            \u003cdiv class=\"modal-header\"\u003e\r\n                \u003cbutton class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"\u003e\u0026times;\u003c/button\u003e\r\n                \u003ch3 class=\"modal-title\"\u003eChange Password\u003c/h3\u003e\r\n            \u003c/div\u003e\r\n            \u003c!-- ko if: sessionUser--\u003e\r\n            \u003cdiv class=\"modal-body\"\u003e\r\n                \u003cdiv class=\"form-group\"\u003e\r\n                    \u003clabel\u003eOld Password\u003c/label\u003e\r\n                    \u003cinput class=\"form-control\" type=\"password\" placeholder=\"old password\" data-bind=\"value: oldPassword\" /\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv class=\"form-group\"\u003e\r\n                    \u003clabel\u003eNew Password\u003c/label\u003e\r\n                    \u003cinput class=\"form-control\" type=\"password\" placeholder=\"new password\" data-bind=\"value: newPassword\" /\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv class=\"form-group\"\u003e\r\n                    \u003clabel\u003eConfirm Password\u003c/label\u003e\r\n                    \u003cinput class=\"form-control\" type=\"password\" placeholder=\"confirm password\" data-bind=\"value: confirmPassword\" /\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n            \u003c!-- /ko --\u003e\r\n            \u003cdiv class=\"modal-footer\"\u003e\r\n                \u003cdiv style=\"float: right\"\u003e\r\n                    \u003cbutton class=\"btn btn-default\" data-dismiss=\"modal\"\u003eClose\u003c/button\u003e\r\n                    \u003c!-- ko if: sessionUser --\u003e\r\n                    \u003cbutton class=\"btn btn-default\" style=\"margin-left: 10px\" data-bind=\"click: changePassword\"\u003eChange\u003c/button\u003e\r\n                    \u003c!-- /ko --\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-modaldialogs-UserProfileView">\u003cdiv id=\"userProfile\" class=\"modal fade\"\u003e\r\n    \u003cdiv class=\"modal-dialog\"\u003e\r\n        \u003cdiv class=\"modal-content\"\u003e\r\n            \u003cdiv class=\"modal-header\"\u003e\r\n                \u003cbutton class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"\u003e\u0026times;\u003c/button\u003e\r\n                \u003ch3 class=\"modal-title\"\u003eUser Profile\u003c/h3\u003e\r\n            \u003c/div\u003e\r\n            \u003c!-- ko if: sessionUser --\u003e\r\n            \u003cdiv class=\"modal-body\"\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan style=\"font-weight: 700\"\u003eFirst Name: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: sessionUser().firstName\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan style=\"font-weight: 700\"\u003eLast Name: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: sessionUser().lastName\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan style=\"font-weight: 700\"\u003eLogon Name: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: sessionUser().userName\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan style=\"font-weight: 700\"\u003eEmail: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: sessionUser().email\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan style=\"font-weight: 700\"\u003eRoles: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: sessionUser().roles.toString()\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n            \u003c!-- /ko --\u003e\r\n            \u003cdiv class=\"modal-footer\"\u003e\r\n                \u003cdiv style=\"float: right\"\u003e\r\n                    \u003cbutton class=\"btn btn-default\" data-dismiss=\"modal\"\u003eOK\u003c/button\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-users-EditUserView">\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eEmail\u003c/label\u003e\r\n    \u003cinput type=\"email\" class=\"form-control\" placeholder=\"email address\" data-bind=\"value: email, enable: !isEditingMode()\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eLogin Name\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Login Name\" data-bind=\"value: userName, enable: !isEditingMode()\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eFirst Name\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"First Name\" data-bind=\"value: firstName\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eLast Name\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Last Name\" data-bind=\"value: lastName\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eRoles\u003c/label\u003e\r\n    \u003cdiv class=\"panel panel-default\"\u003e\r\n        \u003cdiv class=\"panel-body\"\u003e\r\n            \u003cdiv class=\"checkbox\"\u003e\r\n                \u003clabel\u003e\u003cinput type=\"checkbox\" value=\"User\" data-bind=\"checked: selectedRoles\" /\u003eUser\u003c/label\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"checkbox\"\u003e\r\n                \u003clabel\u003e\u003cinput type=\"checkbox\" value=\"Admin\" data-bind=\"checked: selectedRoles\" /\u003eAdmin\u003c/label\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"checkbox\"\u003e\r\n                \u003clabel\u003e\u003cinput type=\"checkbox\" value=\"SuperAdmin\" data-bind=\"checked: selectedRoles\" /\u003eSuperAdmin\u003c/label\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\" data-bind=\"visible: !isEditingMode()\"\u003e\r\n    \u003clabel\u003ePassword\u003c/label\u003e\r\n    \u003cinput type=\"text\"class=\"form-control\" placeholder=\"Password\" data-bind=\"value: password\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\" data-bind=\"visible: !isEditingMode()\"\u003e\r\n    \u003clabel\u003eConfirm Password\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Confirm Password\" data-bind=\"value: confirmPassword\" /\u003e\r\n\u003c/div\u003e\r\n\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: createUser, visible: !isEditingMode()\"\u003eCreate\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: updateUser, visible: isEditingMode\"\u003eSave\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: cancel\"\u003eCancel\u003c/button\u003e</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-users-UsersView">\u003cdiv id=\"users-toolbar\" style=\"margin: 10px 10px 10px 0\"\u003e\r\n    \u003cbutton id=\"users-add\" class=\"btn btn-default\" data-bind=\"click: add\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-plus\"\u003e\u003c/i\u003eAdd\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"users-edit\" class=\"btn btn-default\" data-bind=\"click: edit, enable: selectedUsers().length === 1 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-edit\" style=\"margin-right: 5px\"\u003e\u003c/i\u003eEdit\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"users-remove\" class=\"btn btn-danger\" data-bind=\"click: remove, enable: selectedUsers().length \u003e 0 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-remove\" style=\"margin-right: 5px\"\u003e\u003c/i\u003eDelete\r\n    \u003c/button\u003e\r\n\u003c/div\u003e\r\n\u003ctable id=\"users\" data-bind=\"grid: {options: gridOptions, selectionChanged: refreshSelection}\"\u003e\u003c/table\u003e\r\n</script>');
            }
            views.register = register;
        })(views = library.views || (library.views = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
//# sourceMappingURL=ApplicationOutput.js.map