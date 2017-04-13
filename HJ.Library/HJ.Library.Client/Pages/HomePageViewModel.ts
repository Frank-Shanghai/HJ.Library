///<reference path="PageBase.ts" />
module hj.library.pages{
    export class HomePageViewModel extends PageBase {
        constructor() {
            super();
            this.templateId = hj.library.pages.HomePageViewId;
            this.title("Home");
        }
    }
}