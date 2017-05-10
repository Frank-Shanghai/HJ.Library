///<reference path="Bindings.ts" />
module hj.library {
    export class CloseOverlayBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var $element = $(element);
            var options = valueAccessor();

            var closeOverlayHandler = (e: JQueryEventObject) => {
                // Only call this handler if the target is *not* a child element, which means all the other spaces except for this element or its children
                if ($element.has(e.target).length === 0 && options.action) {
                    options.action();
                }
            }

            $(document).on("click", closeOverlayHandler);

            // Remove the event handler if Knockout dispose the element
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                $(document).off("click", closeOverlayHandler);
            });
        }
    }

    Bindings.registerCustomBinding("closeOverlay", new CloseOverlayBinding());
}