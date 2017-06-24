module hj.library.authentication {
    export class LogonViewModel {
        public name: KnockoutObservable<string> = ko.observable<string>("SuperFrank");
        public password: KnockoutObservable<string> = ko.observable<string>("Abc_1234");
        private token: string = "";
        private tokenType: string = "";

        constructor()
        { }

        public logon = () => {
            Application.instance.isProcessing(true);
            $.ajax({
                type: 'post',
                contentType: "application/x-www-form-urlencoded",
                url: '/oauth/token',
                data: {
                    grant_type: 'password',
                    username: this.name(),
                    password: this.password()
                }
            })
                .done(this.handleLogonResponse)
                .fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to log on.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error);
                })
                .always(() => {
                    Application.instance.isProcessing(false);
                });
        }

        private reset = () => {
            this.name('');
            this.password('');
        }

        private handleLogonResponse = (data: any) => {
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
                url: '/api/accounts/user/' + this.name()
            }).done((data) => {
                library.Application.instance.openHomePageSpace();
                Application.instance.sessionUser(data);
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to get user information.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error);
            });
            
            //library.Application.instance.activePage(new pages.HomePageViewModel());
            //library.Application.instance.sammyApp.run("#/Welcome");
        }

        private onLogonFail(jqXhr: JQueryXHR) {
            console.log(jqXhr);
            alert("failed to logon, press F12, refer to console window output for more details.");
        }
    }
}