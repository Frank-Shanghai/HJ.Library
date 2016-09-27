var hj;
(function (hj) {
    var library;
    (function (library) {
        var Application = (function () {
            function Application() {
                this.user = new library.authentication.LogonUserViewModel();
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
            var LogonUserViewModel = (function () {
                function LogonUserViewModel() {
                    var _this = this;
                    this.name = ko.observable("");
                    this.password = ko.observable("");
                    this.logon = function () {
                        $.ajax({
                            type: 'post',
                            contentType: "application/x-www-form-urlencoded",
                            url: 'http://localhost:8010/oauth/token',
                            data: {
                                grant_type: 'password',
                                username: _this.name(),
                                password: _this.password()
                            }
                        }).done(function (data) {
                            alert("scuccess");
                            console.log(data);
                        }).fail(function (data) {
                            alert("fail");
                        });
                    };
                }
                return LogonUserViewModel;
            }());
            authentication.LogonUserViewModel = LogonUserViewModel;
        })(authentication = library.authentication || (library.authentication = {}));
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