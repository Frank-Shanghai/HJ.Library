///<reference path="Bindings.ts" />
module hj.library {
    export class IndentBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var basePaddingLeft = 10; // The default padding left value as required
            var item: any = ko.unwrap(valueAccessor());

            $(element).css("padding-left", item.depth * 15 + basePaddingLeft);
            $(element).prop("tabindex", -1);
        }
    }

    Bindings.registerCustomBinding("indent", new IndentBinding());
}