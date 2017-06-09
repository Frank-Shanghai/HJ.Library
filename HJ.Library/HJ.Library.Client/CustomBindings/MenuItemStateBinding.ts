///<reference path="Bindings.ts" />
module hj.library {
    export class MenuItemStatusBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var li = $(element);
            var menuItem: MenuItem = valueAccessor();

            li.on("click", function () {
                if (!menuItem.hasChildren()) {
                    var navBar = $(this).parents("nav.app-navigation-bar").first();
                    navBar.find("li").removeClass("active");
                    $(this).addClass("active");
                }
            });
        }
    }

    Bindings.registerCustomBinding("menuItemState", new MenuItemStatusBinding());
}