module hj.library {
    export class ComponentRegistry {
        static register() {
            // Register hj-information-dialog
            ko.components.register("hj-information-dialog", {
                viewModel: dialogs.InformationDialogComponentViewModel, template: pages.dialogs.InformationDialogComponentView, synchronous: true
            });

            // Register hj-error-dialog 
            ko.components.register("hj-error-dialog", {
                viewModel: dialogs.ErrorDialogComponentViewModel,
                template: pages.dialogs.ErrorDialogComponentView,
                synchronous: true
            });
        }
    }
}