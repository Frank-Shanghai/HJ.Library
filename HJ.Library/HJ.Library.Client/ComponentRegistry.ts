module hj.library {
    export class ComponentRegistry {
        static register() {
            // Register hj-information-dialog
            ko.components.register("hj-information-dialog", {
                viewModel: InformationDialogComponentViewModel, template: components.modal.InformationDialogComponentView, synchronous: true
            });

            // Register hj-error-dialog 
            ko.components.register("hj-error-dialog", {
                viewModel: ErrorDialogComponentViewModel,
                template: components.modal.ErrorDialogComponentView,
                synchronous: true
            });

            // Register hj-flex-container
            ko.components.register("hj-flex-container", {
                viewModel: FlexContainerComponentViewModel,
                template: components.flexcontainer.FlexContainerComponentView,
                synchronous: true
            });

            // Register hj-flex-shrink
            ko.components.register("hj-flex-shrink", {
                viewModel: FlexShrinkComponentViewModel,
                template: components.flexcontainer.FlexShrinkComponentView,
                synchronous: true
            });

            // Register hj-flex-scroll
            ko.components.register("hj-flex-scroll", {
                viewModel: FlexScrollComponentViewModel,
                template: components.flexcontainer.FlexScrollComponentView,
                synchronous: true
            });

            // Register hj-flex-grow
            ko.components.register("hj-flex-grow", {
                viewModel: FlexGrowComponentViewModel,
                template: components.flexcontainer.FlexGrowComponentView,
                synchronous: true
            });
        }
    }
}