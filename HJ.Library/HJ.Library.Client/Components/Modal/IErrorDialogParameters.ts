module hj.library {
    export interface IErrorDialogParameters {
        context?: IErrorDialogParameters;
		/**
			* The title of the message to display
			* Type: string or ko.observable<string>
			*/
        title: any;

		/**
            * The error messages to display
            */
        messages: IErrorDialogMessage[];

		/**
			* Call back to execute when the Error Dialog is dismissed.
			*/
        onClose?: () => void;
    }

    export interface IErrorDialogMessage {
		/**
			* The error message to display
			* Type: string or ko.observable<string>
			*/
        message: any;
		/**
			* The title of the message to display
			* Type: string or ko.observable<string>
			*/
        title: any;
    }
}