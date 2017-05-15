module hj.library {
    export interface BeforeCloseSpaceHandler {
        (space: Space, proceed: () => void): void;
    }

    export interface AfterCloseSpaceHandler {
        (): void;
    }

    export class SpaceList {
        private _onBeforeAddPage: BeforeAddPageHandler;
        private _onBeforeCloseSpace: BeforeCloseSpaceHandler;
        private _onAfterCloseSpace: AfterCloseSpaceHandler;

        public spaces: KnockoutObservableArray<Space> = ko.observableArray([]);
        public activeSpace: KnockoutObservable<Space> = ko.observable(null);
        public activePage: KnockoutObservable<pages.PageBase> = ko.pureComputed(() => {
            return this.activeSpace() ? this.activeSpace().activePage() : null;
        });

        public openNew(space: Space, insertAtBeginning?: boolean) {
            space.onBeforeAddPage(this._onBeforeAddPage); // space list's _onBeforeAddPage has higher priority than space's _onBeforeAddPage

            if (insertAtBeginning) {
                this.spaces.unshift(space);
            }
            else {
                this.spaces.push(space);
            }

            this.open(space);
        }

        public open = (space: Space) => {
            if (space === this.activeSpace()) return;

            if (this.spaces.indexOf(space) < 0) return;

            if (this.activeSpace()) {
                this.activeSpace().isActive(false);
            }

            space.isActive(true);
            this.activeSpace(space);
        }

        public replaceActive(space: Space) {
            space.onBeforeAddPage(this._onBeforeAddPage);

            if (this.spaces().length > 0) {
                var activeSpace = this.activeSpace();
                if (activeSpace.canClose) {//Home space cannnot be closed
                    var index = this.spaces.indexOf(activeSpace);
                    activeSpace.pages().forEach((page) => { page.dispose(); });
                    this.spaces.remove(activeSpace);
                    this.spaces.splice(index, 0, space);
                }
                else {
                    this.spaces.push(space);
                }
            }
            else {
                this.spaces.push(space);
            }

            this.open(space);
        }

        public closeAll = (except: Space = null): void => {
            var spacesToRemove: Space[] = [];

            this.spaces().forEach((space) => {
                if (space.canClose === true && space !== except) {
                    spacesToRemove.push(space);
                } 
            });

            spacesToRemove.forEach((space) => {
                space.pages().forEach(page => page.dispose());
                this.spaces.remove(space);
            });

            if (this.spaces().length === 0) {
                this.activeSpace(null);
            }
            else {
                this.activeSpace(except || this.spaces()[0]);
                this.activeSpace().isActive(true);
            }
        }

        public close = (space: Space) => {
            var closeSpaceHandler = () => {
                space.pages().forEach(page => page.dispose());
                this.spaces.remove(space);

                if (this.activeSpace() === space) {
                    if (this.spaces().length > 0) {
                        this.open(this.spaces()[this.spaces().length - 1]);
                    }
                    else {
                        this.activeSpace(null);
                    }
                }

                if (this._onAfterCloseSpace) {
                    this._onAfterCloseSpace();
                }
            }

            if (this._onBeforeCloseSpace) {
                this._onBeforeCloseSpace(space, closeSpaceHandler);
            }
            else {
                closeSpaceHandler();
            }
        }

        //public navigate(navigateHandler: (space: Space) => void, space?: hj.Space, newSpaceTitle?: string, replaceActiveSpace?: boolean, singleInstanceId?: string) {
        //    if (space) {
        //        if (space.isActive() === true && space.activePage()) {
        //            space.activePage().onBeforeNavigateAway(() => navigateHandler(space));
        //        }
        //        else {
        //            navigateHandler(space);
        //        }
        //    }
        //    else {
        //        if (newSpaceTitle) {
        //            if (replaceActiveSpace) {
        //                var handler = () => {
        //                    space = new Space(newSpaceTitle, false, true, singleInstanceId);
        //                    var replaceActiveSpaceHandler = () => {
        //                        this.replaceActive(space);
        //                        navigateHandler(space);
        //                    };
        //                    var activeSpace = this.activeSpace();
        //                    if (this.spaces().length > 0 && activeSpace && activeSpace.canClose && this._onBeforeCloseSpace) {
        //                        this._onBeforeCloseSpace(activeSpace, replaceActiveSpaceHandler);
        //                    }
        //                    else {
        //                        replaceActiveSpaceHandler();
        //                    }
        //                };

        //                if (this.activePage()) {
        //                    this.activePage().onBeforeNavigateAway(handler);
        //                }
        //                else {
        //                    handler();
        //                }
        //            }
        //            else {
        //                space = new Space(newSpaceTitle, false, true, singleInstanceId);
        //                this.openNew(space);
        //                navigateHandler(space);
        //            }
        //        }
        //        else {
        //            var handler = () => {
        //                space = this.activeSpace();
        //                navigateHandler(space);
        //            };

        //            if (this.activePage()) {
        //                this.activePage().onBeforeNavigateAway(handler);
        //            }
        //            else {
        //                handler();
        //            }
        //        }
        //    }
        //}

    }
}