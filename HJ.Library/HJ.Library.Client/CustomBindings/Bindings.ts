module hj.library {
    export class Bindings {
        public static registerCustomBinding(name: string, binding: KnockoutBindingHandler, allowVirtualElements: boolean = false) {
            var customHandlers = <any>ko.bindingHandlers;
            customHandlers[name] = binding;
            if (allowVirtualElements) {
                ko.virtualElements.allowedBindings[name] = true;
            }
        }
    } 
}