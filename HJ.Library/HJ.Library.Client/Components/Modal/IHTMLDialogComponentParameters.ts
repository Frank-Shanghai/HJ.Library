module hj.library {
    export interface IHTMLDialogComponentParameters {
        context?: IHTMLDialogComponentParameters;

        title: string;

        templateName?: string;

        // Data for template
        data?: any;

        onClose?: () => void;

        isDismissButtonVisible?: any;

        isDismissButtonFocused?: any;

        isMaximizeButtonVisible?: any;

        // for example, html dialog doens't has "Confirm" button, but you can add one custom button to represent it
        customButtons?: any;

        // The size of the HTML dialog (samll, large, and so on if supported)
        size?: string;
    }
}