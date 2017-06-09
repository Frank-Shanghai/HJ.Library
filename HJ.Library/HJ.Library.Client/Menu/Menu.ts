module hj.library {
    export class Menu {
        public navigationMenu: Array<MenuItem> = [];
        constructor(menuNodes: Array<IMenuNode>) {
            this.createMenu(menuNodes, null);
        }

        private createMenu(menuNodes: Array<IMenuNode>, parent: MenuItem) {
            menuNodes.forEach((node: IMenuNode) => {
                var menu = new MenuItem(parent);
                menu.text = node.text;

                if (node.targetPageName) {
                    // Refer to simple TypeScript reflection 
                    // https://stackoverflow.com/questions/15338610/dynamically-loading-a-typescript-class-reflection-for-typescript
                    // https://www.stevefenton.co.uk/2014/07/creating-typescript-classes-dynamically/
                    var clickHandler = () => {
                        var space = new Space(node.text);
                        // Since we  have specific namespace here, the first parameter here should be hj.libary.pages. So make sure put all pages into the hj.library.pages namespace
                        // If no specific namespace, the first parameter should be window
                        var page: pages.PageBase = InstanceLoader.getInstance<pages.PageBase>(pages, node.targetPageName, node.instanceParameters);
                        space.addPage(page, node.parameters);
                        return space;
                    }

                    menu.click = () => {
                        hj.library.Application.instance.spaceList.replaceActive(clickHandler());
                    }

                    menu.clickNewSpaceIcon = () => {
                        hj.library.Application.instance.spaceList.openNew(clickHandler());
                    }
                }

                menu.isActive(node.isActive ? node.isActive : false);
                menu.isExpanded(node.isExpanded ? node.isExpanded : false);
                if (node.nodes && node.nodes.length > 0) {
                    this.createMenu(node.nodes, menu);
                    if (menu.hasChildren()) {
                        menu.click = () => {
                            menu.toggleExpandedState();
                        }
                    }
                }

                if (parent) {
                    parent.subMenus.push(menu);
                }
                else {
                    this.navigationMenu.push(menu);
                }
            });
        }
    }
}