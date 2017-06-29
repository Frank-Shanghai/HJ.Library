///<reference path="../Bindings.ts" />
module hj.library {
    export class FlexShrinkBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: any, allBindings: any, viewModel: any, bindingContext: KnockoutBindingContext) {
            bindingContext.$flexContainerContent.shrinkComponents.push(element);

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                bindingContext.$flexContainerContent.shrinkComponents = bindingContext.$flexContainerContent.shrinkComponents.filter(x => { return x !== element; });
            });
        }
    }

    Bindings.registerCustomBinding("hj-flex-shrink", new FlexShrinkBinding());
}