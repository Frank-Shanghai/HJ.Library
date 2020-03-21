///<reference path="../PageBase.ts" />

module hj.library.pages {
    export class DataCenterConfigurationViewModel extends PageBase {
        constructor() {
            super();
            this.templateId = gcc.DataCenterConfigurationViewId;
            this.title("Data Center Configuration");
        }
    }
}