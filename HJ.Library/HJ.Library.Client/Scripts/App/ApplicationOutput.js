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
                this.activePage = ko.observable(null);
                this.isAuthenticated = ko.observable(false);
                this.user = new library.authentication.LogonViewModel();
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
                    this.name = ko.observable("");
                    this.password = ko.observable("");
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
                }
                LogonViewModel.prototype.handleLogonResponse = function (data) {
                    this.token = data.access_token;
                    this.tokenType = data.token_type;
                    library.Application.instance.isAuthenticated(true);
                    $.ajaxSetup({
                        headers: {
                            authorization: this.tokenType + " " + this.token
                        }
                    });
                    library.Application.instance.activePage(new library.pages.HomePageViewModel());
                };
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
                }
                return HomePageViewModel;
            }(pages.PageBase));
            pages.HomePageViewModel = HomePageViewModel;
        })(pages = library.pages || (library.pages = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
///<reference path="PageBase.ts" />
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var UsersViewModel = (function (_super) {
                __extends(UsersViewModel, _super);
                function UsersViewModel() {
                    _super.call(this);
                    this.templateId = pages.UsersViewId;
                    this.title("Users");
                }
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
            pages.UsersViewId = "hj-library-pages-UsersView";
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
                bodyElement.append('<script type="text/html" id="hj-library-authentication-LogonView">\u003cdiv\u003e\r\n    Name: \r\n    \u003cinput type=\"text\" data-bind=\"value: name\" /\u003e\r\n    \u003cbr /\u003e\r\n    Password: \r\n    \u003cinput type=\"password\" data-bind=\"value: password\" /\u003e\r\n    \u003cbr /\u003e\r\n    \u003cbutton data-bind=\"click: logon\"\u003eLogon\u003c/button\u003e\r\n\u003c/div\u003e</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-HomePageView">\u003cdiv\u003e\r\n    \u003ch1\u003eWelcome!\u003c/h1\u003e\r\n\u003c/div\u003e\r\n</script>');
                bodyElement.append('<script type="text/html" id="hj-library-pages-UsersView">\u003cdiv\u003e\r\nUser list:\r\n\u003c/div\u003e\r\n</script>');
            }
            views.register = register;
        })(views = library.views || (library.views = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
//# sourceMappingURL=ApplicationOutput.js.map