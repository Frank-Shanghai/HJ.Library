///<reference path="../PageBase.ts" />

module hj.library.pages {
    
    export class DataCenterViewModel extends PageBase {

        constructor() {
            super();
            this.templateId = gcc.DataCenterViewId;
            this.title("Data Center");
            this.prepareData();
        }

        private prepareData() {

        }
    }
}