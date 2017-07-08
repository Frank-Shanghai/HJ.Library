module hj.library.pages {
    export class SearchableDropDownListTestViewModel extends PageBase {
        constructor() {
            super();
            this.title("Searchable Drop Down List Component");
            this.templateId = pages.test.searchabledropdownlist.SearchableDropDownListTestViewId;
        }

        // Sample
        private sampleSelect = ko.observable('2');
        public sampleContext = {
            data: ko.observableArray([{ id: 1, text: "sample1" }, { id: 2, text: "sample2" }]),
            placeholder: "Select one item",
        };

        // Basic Select2 control
        private basicSelect = ko.observable('2');
        public basicContext = {
            data: ko.observableArray([{ id: 1, text: "test1" }, { id: 2, text: "test2" }]),
            placeholder: "Select one item",
            select: this.basicSelect
        };

        private index = 3;
        private addNewOption = () => {
            this.basicContext.data.push({
                id: this.index, text: "test" + this.index
            });
            this.index++;
        }

        private removeFirst = () => {
            this.basicContext.data.remove(this.basicContext.data()[0]);
        }

        // Multiple select Select2 control
        private multipleSelect = ko.observable(['1','2']);
        private multipleSelectString = ko.pureComputed(() => {
            return this.multipleSelect().toString();
        });
        public multipleContext = {
            data: ko.observableArray([{ id: 1, text: "test1" }, { id: 2, text: "test2" }, { id: 3, text: "test3" }]),
            placeholder: "Select items",
            multiple: true,
            select: this.multipleSelect
        };

        private index1 = 4;
        private addNewOptionToMultiple = () => {
            this.multipleContext.data.push({
                id: this.index1, text: "test" + this.index1
            });
            this.index1++;
        }

        private removeMFirst = () => {
            this.multipleContext.data.remove(this.multipleContext.data()[0]);
        }

        // Enabled/Disalbed
        public stateContext = {
            data: ko.observableArray([{ id: 1, text: "test1" }, { id: 2, text: "test2" }]),
            placeholder: "Select one item",
            multiple: true,
            enabled: ko.observable(false)
        };

        private toggleState = () => {
            this.stateContext.enabled(!this.stateContext.enabled());
        }
    }
}