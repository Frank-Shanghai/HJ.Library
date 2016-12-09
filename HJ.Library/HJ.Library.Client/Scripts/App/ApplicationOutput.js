var hj;
(function (hj) {
    var library;
    (function (library) {
        var Application = (function () {
            function Application() {
                this.isAuthenticated = ko.observable(false);
                this.user = new library.authentication.LogonViewModel();
                this.activePage = "page";
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
                                username: this.name(),
                                password: this.password()
                            }
                        }).done(this.handleLogonResponse)
                            .fail(this.onLogonFail);
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
var hj;
(function (hj) {
    var library;
    (function (library) {
        var pages;
        (function (pages) {
            var UsersViewModel = (function () {
                function UsersViewModel() {
                    $.ajax({
                        type: 'get',
                    });
                }
                return UsersViewModel;
            }());
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
            authentication.LogonUserViewId = "hj-library-authentication-LogonUserView";
        })(authentication = library.authentication || (library.authentication = {}));
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
                bodyElement.append('<script type="text/html" id="hj-library-authentication-LogonUserView">\u003cdiv\u003e\r\n    Name: \r\n    \u003cinput type=\"text\" data-bind=\"value: name\" /\u003e\r\n    \u003cbr /\u003e\r\n    Password: \r\n    \u003cinput type=\"password\" data-bind=\"value: password\" /\u003e\r\n    \u003cbr /\u003e\r\n    \u003cbutton data-bind=\"click: logon\"\u003eLogon\u003c/button\u003e\r\n\u003c/div\u003e</script>');
            }
            views.register = register;
        })(views = library.views || (library.views = {}));
    })(library = hj.library || (hj.library = {}));
})(hj || (hj = {}));
//# sourceMappingURL=ApplicationOutput.js.map