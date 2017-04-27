﻿module hj.library.pages {
    export class PageBase {
        public templateId: string = "";
        public isVisible: KnockoutObservable<boolean> = ko.observable<boolean>(false);
        public title = ko.observable('');

        //TODO: Move this property to space when space is implemented.
        public isProcessing = ko.observable(false);

        //public navigator: Services.INavigator;

        //public errorDialog = ko.observable<IErrorDialogParameters>(null);
        //public htmlDialog = ko.observable<IHtmlDialogParameters>(null);

        // TODO: Page information dialog
        //public informationDialog = ko.observable<IInformationDialogParameters>(null);
    }
}