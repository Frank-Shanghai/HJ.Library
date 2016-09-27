var hj;
(function (hj) {
    (function (Library) {
        var Application = (function () {
            function Application() {
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
        })();
        Library.Application = Application;
    })(hj.Library || (hj.Library = {}));
    var Library = hj.Library;
})(hj || (hj = {}));
//# sourceMappingURL=Application.js.map
