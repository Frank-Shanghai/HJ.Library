///<reference path="Bindings.ts" />
module hj.library {
    export class MenuStatusBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var ul = $(element);
            ul.children("li").on("click", function () {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
            });
        }
    }


    Bindings.registerCustomBinding("menuState", new MenuStatusBinding());
}