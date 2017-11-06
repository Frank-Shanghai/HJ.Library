///<reference path="../Bindings.ts" />
module hj.library {
    export class CollapseNavPanelBinding implements KnockoutBindingHandler {
        private widthPercentage: number;

        public update(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var isNavigationPanelVisible = valueAccessor();
            var $element = $(element);
            var $quickNavBar = $element.find("nav.quick-nav").first();
            var $mainScreen = $(document).find("section#content.app-main-screen").first();

            this.widthPercentage = $element.width() / window.innerWidth * 100;

            var handler = (newValue) => {
                window.setTimeout(() => {
                    // Reason: There is one time issue if you try to only find the active tab pane.
                    // When all tabs are collapsed, when you click any one of them, the bootstrap first works, make the corresponding tab appear, no animation here.
                    // Then you said you could first make it invisible when newValue is true. To do that, you need to first find the acitve tab pane when newValue is ture, but as debugged, 
                    // you found that $element.find("div.tab-content>nav.app-navigation-bar.active") didn't work as expected. 
                    // Seems this subscriber happened before bootstrap making the corresponding tab appear
                    // To solve this timing issue, you can find all tabs and apply animations to all of them, but only the active (visible in UI) tab effects.
                    //var $activeTabPane = $element.find("div.tab-content>nav.app-navigation-bar.active");

                    var $activeTabPane = $element.find("div.tab-content>nav.app-navigation-bar");
                    if (newValue === true) {
                        // First make the tab invisible, because as the bunch of comments above said, bootstrap will make tab appear immediately. To apply animation,
                        // first make it invisible with code below and then make it visible with animation.
                        $activeTabPane.css("margin-right", $element.width() - $quickNavBar.width());

                        $activeTabPane.animate({ "margin-right": 0, "margin-left": $quickNavBar.width() }, 500);
                        $mainScreen.animate({ left: this.widthPercentage + "%" }, 500);
                    }
                    else {
                        // There will be one issue if you only change the element width. While the width changing(animation), the menu item text
                        // will wrap into multiple lines, which looks bad. To solve this issue, 
                        // update the active tab's maring-left and margin-right (the code below)
                        // in this way, we can ensure that the actual width doesn't change during the animation, so the menu item text won't be wrap.
                        // But if you don't use animation, then just update its width is OK.
                        //$element.animate({ width: $quickNavBar.width() }, 500);                       

                        //At the same time, update the margin-left property. Take into the original margin-left (which is $quickNavBar.width) value into account when calculating
                        $activeTabPane.animate({ "margin-right": $element.width() - $quickNavBar.width(), "margin-left": -($element.width() - $quickNavBar.width() - $quickNavBar.width()) }, 500);
                        $mainScreen.animate({ left: $quickNavBar.width() }, 500);
                    }
                }, 10);
            };

            var isNavigationPanelVisibleSubscription = (<KnockoutObservable<boolean>>isNavigationPanelVisible).subscribe(handler);


            var windowResizeHandler = () => {
                if (!ko.unwrap(isNavigationPanelVisible)) {
                    var $activeTabPane = $element.find("div.tab-content>nav.app-navigation-bar");
                    var width = window.innerHeight * this.widthPercentage;
                    $activeTabPane.css("margin-right", width - $quickNavBar.width());
                    $activeTabPane.css("margin-left", -(width - $quickNavBar.width() - $quickNavBar.width()));
                    $mainScreen.css("left", $quickNavBar.width());
                }
            };

            // on window resizing, need to update navigaition panel layout [defect #89]
            $(window).on("resize", windowResizeHandler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                $(window).off("resize", windowResizeHandler);
                if (isNavigationPanelVisibleSubscription) {
                    isNavigationPanelVisibleSubscription.dispose();
                }
            });
        }
    }

    Bindings.registerCustomBinding("collapseNavPanel", new CollapseNavPanelBinding());
}