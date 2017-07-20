module hj.library {
    export class HTMLDialogTemplateViewModel {
        public firstName = "Frank";
        public lastName = "Sun";

        constructor() { }

        public click = () => {
            alert("You clicked the button.");
        }
    }
}