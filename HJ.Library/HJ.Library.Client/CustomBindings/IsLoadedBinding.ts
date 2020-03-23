///<reference path="Bindings.ts" />
module hj.library {

    export class IsLoadedBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var $element = $(element);

            var value = valueAccessor();
            setTimeout(() => {                
                value.domElement(element);
                value.isLoaded(true);
            }, 10);            
        }
    }

    Bindings.registerCustomBinding("isLoaded", new IsLoadedBinding());
}