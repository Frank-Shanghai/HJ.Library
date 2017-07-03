///<reference path="../Bindings.ts" />
module hj.library {
    export class GridBinding implements KnockoutBindingHandler {
        public update(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var context = ko.unwrap(valueAccessor());
            var options = ko.unwrap(context.options);
            if (ko.isObservable(context.dataSource)) {
                $.extend(options, {
                    data: ko.unwrap(context.dataSource)
                });

                context.dataSource.subscribe((newValue) => {
                    options.data = newValue;
                    (<any>$(element)).bootstrapTable("load", options);
                });
            }
            else {
                $.extend(options, {
                    data: context.dataSource
                });
            }

            var configSelectionChangedEvent = (element: any, context: any) => {
                var options = ko.unwrap(context.options);
                var selectionChanged = context.selectionChanged;

                // onCheck
                if (options.onCheck) {
                    var originalOnCheck = options.onCheck;
                    options.onCheck = (row, $ele) => {
                        originalOnCheck(row, $ele);
                        selectionChanged((<any>$(element)).bootstrapTable('getSelections'));
                    };
                }
                else {
                    options.onCheck = (row, $ele) => {
                        selectionChanged((<any>$(element)).bootstrapTable('getSelections'));
                    };
                }

                // onUncheck
                if (options.onUncheck) {
                    var originalOnUncheck = options.onUncheck;
                    options.onUncheck = (row, $ele) => {
                        originalOnUncheck(row, $ele);
                        selectionChanged((<any>$(element)).bootstrapTable('getSelections'));
                    };
                }
                else {
                    options.onUncheck = (row, $ele) => {
                        selectionChanged((<any>$(element)).bootstrapTable('getSelections'));
                    };
                }

                // onCheckAll
                if (options.onCheckAll) {
                    var originalOnCheckAll = options.onCheckAll;
                    options.onCheckAll = (rows) => {
                        originalOnCheckAll(rows);
                        selectionChanged((<any>$(element)).bootstrapTable('getSelections'));
                    }
                }
                else {
                    options.onCheckAll = (rows) => {
                        selectionChanged((<any>$(element)).bootstrapTable('getSelections'));
                    }
                }

                // onUncheckAll
                if (options.onUncheckAll) {
                    var originalOnUncheckAll = options.onUncheckAll;
                    options.originalOnUncheckAll = (rows) => {
                        originalOnCheckAll(rows);
                        selectionChanged((<any>$(element)).bootstrapTable('getSelections'));
                    }
                }
                else {
                    options.onUncheckAll = (rows) => {
                        selectionChanged((<any>$(element)).bootstrapTable('getSelections'));
                    }
                }
            }

            if (options) {
                if (context.selectionChanged) {
                    configSelectionChangedEvent(element, context);
                }

                (<any>$(element)).bootstrapTable(options);
            }
        }
    }

    Bindings.registerCustomBinding("grid", new GridBinding());
}