module hj.library {
    export interface IMenuNode {
        text: string;
        targetPageName?: string;
        isActive?: boolean;
        isExpanded?: boolean;
        nodes?: Array<IMenuNode>;
        // parameters when initializing page instance, so it requires the page constructor to accept only one parameter, but it can be an array or object
        instanceParameters?: any;

        // page parameters for the page field parameters
        parameters?: any;
    }
}