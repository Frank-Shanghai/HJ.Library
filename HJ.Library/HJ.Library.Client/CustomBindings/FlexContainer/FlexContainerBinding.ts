/// <reference path="../Bindings.ts" />
module hj.library {
    export class FlexContainerBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: any, allBindings: any, viewModel: any, bindingContext: KnockoutBindingContext) {
            var $element = $(element);

            // Register an event we can fire anytime the flex container is resized. Other controls can listen for this and adapt if needed
            // Currently, no places using this event
            var flexResizeEvent: Event;
            try {
                flexResizeEvent = new Event('resize', {
                    "bubbles": false, cancelable: false
                });
            }
            catch (e) {
                // For IE or old browsers not support the way in try block
                // https://developer.mozilla.org/en-US/docs/Web/API/Event/initEvent
                // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
                flexResizeEvent = document.createEvent("Event");
                flexResizeEvent.initEvent("resize", false, false);
            }

            // Resize logic
            var updateContainerHeight = () => {
                if (!$element.is(":visible")) return;

                // Can have multiple flexShrink elements
                var flexShrinks = bindingContext.$flexContainerContent.shrinkComponents;
                var flexGrows = bindingContext.$flexContainerContent.growComponents;

                var flexShrinkHeight = 0;
                for (var i = 0; i < flexShrinks.length; i++) {
                    flexShrinkHeight += $(flexShrinks[i]).outerHeight();
                }

                var containerHeight = $element.innerHeight();
                var availableHeight = containerHeight - flexShrinkHeight;
                // Can have multiple flexGrow elements, if have more than 1, they will divide the available height equally
                var numberOfFlexGrowElements = Math.max(flexGrows.length, 1);
                var flexGrowHeight = Math.floor(availableHeight / numberOfFlexGrowElements);

                for (var i = 0; i < flexGrows.length; i++) {
                    var growDiv = $(flexGrows[i]).first();
                    if (growDiv.height() !== flexGrowHeight) {
                        growDiv.height(flexGrowHeight);

                        // growDiv is  a JQuery object
                        // use growDiv[0] to get the DOM object inside of the JQuery object
                        // call dispatchEvent to trigger the event
                        growDiv[0].dispatchEvent(flexResizeEvent);
                    }
                }
            }

            // Calculate the height per 100 milliseconds since we couldn't depend on any trigger to do the calculation
            // For example, the flex shrink's height can be changed by user input, data (which controls elmenets' visibility) changed and so on.
            var intervalHandle = setInterval(updateContainerHeight, 100);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                clearInterval(intervalHandle);
            });
        }
    }

    Bindings.registerCustomBinding('hj-flex-container', new FlexContainerBinding());
}