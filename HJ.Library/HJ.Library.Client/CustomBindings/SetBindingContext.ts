/// <reference path="Bindings.ts" />
module hj.library {
    export class SetBindingContext implements KnockoutBindingHandler{
        public init(element: any, valueAccessor: any, allBindings: any, viewModel: any, bindingContext: KnockoutBindingContext) {
            var value: any = ko.unwrap(valueAccessor());

            if (!value) return;

            var extensions: any = {};

            if (value.flexContainerContent) {
                extensions.$flexContainerContent = ko.unwrap(value.flexContainerContent);
            }

            var innerBindingContext = bindingContext.extend(extensions);
            ko.applyBindingsToDescendants(innerBindingContext, element);

            return { controlsDescendantBindings: true };
        }
    }

    Bindings.registerCustomBinding("hj-set-binding-context", new SetBindingContext(), true);
}