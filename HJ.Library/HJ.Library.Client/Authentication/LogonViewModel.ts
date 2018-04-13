module hj.library.authentication {
    export class LogonViewModel {
        private name: KnockoutObservable<string> = ko.observable<string>("SuperFrank");
        private password: KnockoutObservable<string> = ko.observable<string>("Abc_1234");
        private nameValidationError = ko.observable('');
        private serverValidationError = ko.observable('');
        private token: string = "";
        private tokenType: string = "";

        constructor()
        { }

        private onKeyUp = (data, event) => {
            if (event.keyCode == 13) {
                this.logon();
            }
        }

        public logon = () => {            
            if (!this.name()) {
                this.nameValidationError("Cannot be empty.");
            }
            else {
                this.clearValidationErrors();
                Application.instance.isProcessing(true);
                $.ajax({
                    type: 'post',
                    contentType: "application/x-www-form-urlencoded",
                    // 下面的url是使用绝对路径。第一个'/'指明从网站部署的根目录开始加上这里url指定的数据。https://my.oschina.net/daladida/blog/854173 http://www.3023.com/6318/092943996027138.html
                    url: '/oauth/token',
                    data: {
                        grant_type: 'password',
                        username: this.name(),
                        password: this.password()
                    }
                })
                    .done(this.handleLogonResponse)
                    .fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                        //var error: IError = new Error("Failed to log on. Incorrect user or password.");
                        //error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                        //ErrorHandler.report(error);
                        this.serverValidationError("* Failed to log on. Incorrect user or password.");
                    })
                    .always(() => {
                        Application.instance.isProcessing(false);
                    });
            }
        }

        private reset = () => {
            this.clearValidationErrors();
            this.name('');
            this.password('');
        }

        private clearValidationErrors = () => {
            this.nameValidationError('');
            this.serverValidationError('');
        }

        private handleLogonResponse = (data: any) => {
            this.nameValidationError('');
            this.token = data.access_token;
            this.tokenType = data.token_type;
            library.Application.instance.isAuthenticated(true);
            $.ajaxSetup({
                headers: {
                    authorization: this.tokenType + " " + this.token
                }
            });

            $.ajax({
                type: 'get',
                dataType: 'json',
                // It's not safe to allow all users get user information by login name.
                // So, make the API that get user by name as Admin authorized.
                // For normal user, first getCurrentUserId, and then use this Id to get detailed user information as session user.
                // It's safter than make get user by name API be available to all  users because Id is just one GUID string
                //url: '/api/accounts/user/name/' + this.name()
                url: '/api/accounts/user/getCurrentUserId'
            }).done((currentUserId) => {
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/api/accounts/user/id/' + currentUserId
                }).done((data) => {
                    library.Application.instance.openHomePageSpace();
                    Application.instance.sessionUser($.extend({}, data, { isAdmin: this.isAdmin(data), userId: currentUserId }));
                    Application.instance.initializeNavigationMenu();
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to get user information.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error);
                });
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to get user information.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error);
            });

            //library.Application.instance.activePage(new pages.HomePageViewModel());
            //library.Application.instance.sammyApp.run("#/Welcome");
        }

        private isAdmin(user: any) {
            if ((<Array<string>>user.roles).indexOf("Admin") > -1 || (<Array<string>>user.roles).indexOf("SuperAdmin") > -1) {
                return true;
            }

            return false;
        }

        //private onLogonFail(jqXhr: JQueryXHR) {
        //    console.log(jqXhr);
        //    alert("failed to logon, press F12, refer to console window output for more details.");
        //}
    }
}