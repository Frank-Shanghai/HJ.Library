module hj.library.pages {
    export class CanScrollViewModel extends PageBase {
        public labels = ko.observableArray<string>();
        public header = ko.observable<string>("This is the header text.");
        public footer = ko.observable<string>("This is the footer text.");

        constructor() {
            super();
            this.templateId = test.flexcontainer.CanScrollViewId;
            this.title('hj-flexcontainer - Can Scroll Flex');

            var labels = [];
            for (var i = 0; i < 50; i++) {
                labels.push(i.toString());
            }
            this.labels(labels);
        }   
    }
}