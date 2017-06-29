///<reference path="../Bindings.ts" />
module hj.library {
    export class FlexGrowBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: any, allBindings: any, viewModel: any, bindingContext: KnockoutBindingContext) {
            bindingContext.$flexContainerContent.growComponents.push(element);

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                bindingContext.$flexContainerContent.growComponents = bindingContext.$flexContainerContent.growComponents.filter(x => { return x !== element });
            });
        }
    }

    Bindings.registerCustomBinding("hj-flex-grow", new FlexGrowBinding());
}