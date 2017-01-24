module hj.library.authentication {
    export class LogonViewModel {
        public name: KnockoutObservable<string> = ko.observable<string>("");
        public password: KnockoutObservable<string> = ko.observable<string>("");
        private token: string = "";
        private tokenType: string = "";

        constructor()
        { }

        public logon = () => {
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
        }

        private handleLogonResponse(data: any) {
            this.token = data.access_token;
            this.tokenType = data.token_type;
            library.Application.instance.isAuthenticated(true);
            $.ajaxSetup({
                headers: {
                    authorization: this.tokenType + " " + this.token
                }
            });

            //library.Application.instance.activePage(new pages.HomePageViewModel());
            library.Application.instance.sammyApp.run("#/Welcome");
        }

        private onLogonFail(jqXhr: JQueryXHR) {
            console.log(jqXhr);
            alert("failed to logon, press F12, refer to console window output for more details.");
        }
    }
}