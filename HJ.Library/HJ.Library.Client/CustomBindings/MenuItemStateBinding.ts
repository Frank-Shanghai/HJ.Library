///<reference path="Bindings.ts" />
module hj.library {
    export class MenuItemStatusBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var li = $(element);
            var menuItem: MenuItem | Space = valueAccessor();
            var clickHandler = () => {
                // For space menu, the menu item is not an MenuItem instance
                if (!(<any>menuItem).hasChildren || !(<any>menuItem).hasChildren()) {
                    var navBar = li.parents("nav.app-navigation-bar").first();
                    navBar.find("li").removeClass("active");
                    li.addClass("active");
                }
            };

            li.on("click", clickHandler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                li.off("click", clickHandler);
            });
        }
    }

    Bindings.registerCustomBinding("menuItemState", new MenuItemStatusBinding());
}