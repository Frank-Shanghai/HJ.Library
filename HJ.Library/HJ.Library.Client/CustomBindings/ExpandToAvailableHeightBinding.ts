///<reference path="Bindings.ts" />
module hj.library {
    // TODO: Need to update this binding handler when implemented the hj-flex-container
    export class ExpandToAvailableHeightBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var $element = $(element);

            var updateHeight = () => {
                if (!$element.is(":visible")) return;

                var top: number;
                var availableHeight: number;

                top = $element.position().top + ($element.outerHeight() - $element.height());
                availableHeight = $element.parent().outerHeight();

                $element.height(availableHeight - top);
            }

            $(window).on("resize", updateHeight);

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                $(window).off("resize", updateHeight);
            });

            setTimeout(updateHeight, 1);
        }
    }

    Bindings.registerCustomBinding("expandToAvailableHeight", new ExpandToAvailableHeightBinding());
}