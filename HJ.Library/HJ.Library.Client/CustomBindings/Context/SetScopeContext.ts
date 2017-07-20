/// <reference path="../Bindings.ts" />
module hj.library {
    //Exposes properties in parent datacontexts to all child binding contexts in your knockout bindings.
	//All variables exposed by this handler must begin with $$.
    export class SetScopeContext implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: any, allBindings: any, viewModel: any, bindingContext: KnockoutBindingContext) {
            var value = ko.unwrap(valueAccessor());

            if (!value) return;

            var extensions: any = {};

            var anyFound = false;

            _.each(value, (value: any, key: string) => {
                //All variables exposed by this handler must begin with $$.
				//This is to avoid overwritting other variables on the binding context.
                if (key && key.length > 2 && key.slice(0, 2) === "$$") {
                    extensions[key] = value;
                    anyFound = true;
                }
                else {
                    console.log("hj-set-scoped-context: Ignoring " + key + " because it is not prefixed with $$");
                }
            });

            if (anyFound) {
                var innerBindingContext = bindingContext.extend(extensions);
                ko.applyBindingsToDescendants(innerBindingContext, element);

                return { controlsDescendantBindings: true };
            }
        }
    }

    Bindings.registerCustomBinding("hj-set-scoped-context", new SetScopeContext(), true);
}