///<reference path="PageBase.ts" />
module hj.library.pages {
    export class UsersViewModel extends PageBase {
        public users: KnockoutObservableArray<any> = ko.observableArray([]);

        constructor() {
            super();
            this.templateId = UsersViewId;
            this.title("Users");
            this.initialize();
        }

        private initialize() {
            $.ajax({
                type: 'get',
                accepts: "application/json",
                url: '/api/accounts/users'
            }).done((data) => {
                this.users(data);
            })
                .fail(() => { });
        }
    }
}