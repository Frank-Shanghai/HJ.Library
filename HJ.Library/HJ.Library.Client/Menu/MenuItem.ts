module hj.library {
    export class MenuItem {
        public text: string;
        public parent: MenuItem;
        public subMenus: Array<MenuItem> = [];
        public isActive: KnockoutObservable<boolean> = ko.observable(false);
        public isExpanded: KnockoutObservable<boolean> = ko.observable(false);
        public depth: number = 0;
        public openInNewSpace: boolean = true;

        public click: () => void = () => { };
        public clickNewSpaceIcon: () => void = () => { };

        constructor(parent: MenuItem) {
            this.parent = parent;
            this.depth = this.getDepth();
        }

        public toggleExpandedState = () => {
            if (this.hasChildren()) {
                this.isExpanded(!this.isExpanded());
            }
        }

        public hasChildren = ko.pureComputed(() => {
            return this.subMenus.length > 0;
        });

        private getDepth = () => {
            var depth = 0;
            var parent = this.parent;
            while (parent) {
                depth++;
                parent = parent.parent;
            }

            return depth;
        }
    }
}