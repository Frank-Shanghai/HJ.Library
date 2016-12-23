///<reference path="PageBase.ts" />
module hj.library.pages {
    export class UsersViewModel extends PageBase{
        constructor() {
            super();
            this.templateId = UsersViewId;
            this.title("Users");
        }
    }
}