module hj.library.pages {
    export class CanReAddGrowViewModel extends PageBase {
        public isTopVisible = ko.observable<boolean>(true);

        constructor() {
            super();
            this.templateId = test.flexcontainer.CanReAddGrowViewId;
            this.title('hj-flexcontainer - Can ReAdd Grow');
        }

        public toggleTopSection = () => {
            this.isTopVisible(!this.isTopVisible());
        }
    }
}