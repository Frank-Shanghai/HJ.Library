module hj.library.authentication {
    export class LogonUserViewModel {
        public name: KnockoutObservable<string> = ko.observable<string>("");
        public password: KnockoutObservable<string> = ko.observable<string>("");

        constructor()
        { }

        public logon = () => {
            $.ajax({
                type: 'post',
                contentType: "application/x-www-form-urlencoded",                
                url: 'http://localhost:8010/oauth/token',
                data: {
                    grant_type: 'password',
                    username: this.name(),
                    password: this.password()
                }
            }).done(function (data) {
                alert("scuccess");
                console.log(data);
                }).fail(function (data) {
                    alert("fail");
                });
        }
    }
}