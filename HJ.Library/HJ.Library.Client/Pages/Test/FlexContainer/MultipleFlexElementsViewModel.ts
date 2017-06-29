module hj.library.pages {
    export class MultipleFlexElementsViewModel extends PageBase {
        public labels1 = ko.observableArray<string>();
        public labels2 = ko.observableArray<string>();
        public header1 = ko.observable<string>("This is the header 1 text.");
        public header2 = ko.observable<string>("This is the header 2 text.");
        public footer1 = ko.observable<string>("This is the footer 1 text.");
        public footer2 = ko.observable<string>("This is the footer 2 text.");
        public middle1 = ko.observable<string>("This is the middle 1 text.");
        public middle2 = ko.observable<string>("This is the middle 2 text.");

        constructor() {
            super();
            this.templateId = test.flexcontainer.MultipleFlexElementsViewId;
            this.title('hj-flexcontainer - Multiple Flex Elements');

            var labels1 = [], labels2 = [];
            for (var i = 0; i < 50; i++) {
                labels1.push(i.toString() + " - 1");
                labels2.push(i.toString() + " - 2");
            }
            this.labels1(labels1);
            this.labels2(labels2);
        }    
    }
}