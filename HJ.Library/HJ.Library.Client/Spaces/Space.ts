module hj.library {
    export interface BeforeAddPageHandler {
        (page: pages.PageBase, space: Space, proceed: () => void, cancel: () => void): void
    }

    export class Space {
        private _onBeforeAddPage: BeforeAddPageHandler;

        public id: string;
        public isSinglePageSpace: boolean;
        public title: KnockoutObservable<string>;
        public pages: KnockoutObservableArray<pages.PageBase> = ko.observableArray([]);
        public activePage: KnockoutObservable<pages.PageBase> = ko.observable(null);
        public isActive: KnockoutObservable<boolean> = ko.observable(true);
        public canClose: boolean; // Home space cannot be closed and should be a single page space

        public isProcessing: KnockoutObservable<boolean> = ko.observable(false);
        public informationDialog: KnockoutObservable<dialogs.IInformationDialogComponentParameters> = ko.observable(null);
        public errorDialog: KnockoutObservable<dialogs.IErrorDialogParameters> = ko.observable(null);

        constructor(title: string, isSinglePageSpace: boolean = false, canClose: boolean = true) {
            this.id = Utils.guid();
            this.title = ko.observable(title);
            this.isSinglePageSpace = isSinglePageSpace;
            this.canClose = canClose;
        }

        public isPreviousButtonEnabled = ko.computed<boolean>(() => {
            var that = this;
            return this.pages().indexOf(this.activePage()) > 0 && (this.activePage() && !this.activePage().isProcessing());
        });

        public isNextButtonEnabled = ko.computed<boolean>(() => {
            return this.pages().indexOf(this.activePage()) < this.pages().length - 1 && (this.activePage() && !this.activePage().isProcessing());
        });

        public isPagesButtonEnabled = ko.computed<boolean>(() => {
            return this.activePage() && !this.activePage().isProcessing();
        });

        public goToPreviousPage = (): void => {
            if (this.activePage()) {
                this.activePage().onBeforeNavigateAway(this.doGoToPreviousPage);
            }
        }

        private doGoToPreviousPage = (): void => {
            var previousPageIndex: number = Math.max(0, this.pages().indexOf(this.activePage()) - 1);
            this.setActivePage(this.pages()[previousPageIndex]);
        }

        public goToNextPage = (): void => {
            if (this.activePage()) {
                this.activePage().onBeforeNavigateAway(this.doGoToNextPage);
            }
        }

        private doGoToNextPage = () => {
            var nextPageIndex: number = Math.max(this.pages().length - 1, this.pages().indexOf(this.activePage()) + 1);
            this.setActivePage(this.pages()[nextPageIndex]);
        }

        public goToPage = (page: pages.PageBase) => {
            if (this.activePage()) {
                this.activePage().onBeforeNavigateAway(() => { this.setActivePage(page); });
            }
            else {
                this.setActivePage(page);
            }
        }

        public addPage(page: pages.PageBase, parameters: any, removeForwardPages: boolean = true) {
            var handler = () => {
                page.space = this;
                page.parameters = parameters;

                var existingPage = ko.utils.arrayFirst(this.pages(), (x) => x.equals(page));
                if (existingPage) {
                    this.pages.replace(existingPage, page);
                }
                else {
                    if (removeForwardPages) {
                        this.removeAllPagesAfterActive();
                    }

                    this.pages.push(page);
                }

                this.setActivePage(page);
            }

            if (this._onBeforeAddPage) {
                this._onBeforeAddPage(page, this, handler, () => { });
            }
            else {
                handler();
            }
        }

        public removePage(page: pages.PageBase) {
            page.dispose();
            this.pages.remove(page);

            if (this.activePage() === page) {
                if (this.pages().length > 0) {
                    // Set the last page as acitve page
                    this.setActivePage(this.pages()[this.pages().length - 1]);
                }
                else {
                    this.setActivePage(null);
                }
            }
        }

        public onBeforeAddPage(onBeforeAddPage: BeforeAddPageHandler) {
            if (!this._onBeforeAddPage) {
                this._onBeforeAddPage = onBeforeAddPage;
            }
        }

        private setActivePage = (page: pages.PageBase) => {
            if (this.activePage()) {
                this.activePage().isVisible(false);
            }

            page.isVisible(true);

            this.activePage(page);
        }

        private removeAllPagesAfterActive(): void {
            if (this.pages().length === 0) return;

            var activePageIndex = this.pages().indexOf(this.activePage());
            if (activePageIndex === this.pages().length - 1) return;

            var pagesToRemove = this.pages().slice(activePageIndex + 1);
            pagesToRemove.forEach((page) => {
                page.dispose();
                this.pages.remove(page);
            });
        }
    }
}