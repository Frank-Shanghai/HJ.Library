///<reference path="../Bindings.ts" />
module hj.library {
    export class GridBinding implements KnockoutBindingHandler {
        public update(element: any, valueAccessor: () => any, allowBindingAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
            var context = ko.unwrap(valueAccessor());
            var options = ko.unwrap(context.options);
            if (!(options.url) && context.dataSource) {
                if (ko.isObservable(context.dataSource)) {
                    context.dataSource.subscribe((newValue) => {
                        options.data = newValue;
                        (<any>$(element)).bootstrapTable("load", options);
                    });
                }

                $.extend(options, {
                    data: ko.unwrap(context.dataSource)
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

                if (options.customQueryParameters) {
                    // here the customQueryParameters is not one parameter mentioned in the bootstrap table document, but dynamically added when set up grid options.
                    // by setting it as an observable object, can implement the query functionality as the following code shows
                    // it would be good if there is one document can specify this feature
                    $.extend(options, {
                        queryParams: (params: any) => {
                            return $.extend(params, { queryData: ko.unwrap(options.customQueryParameters) });
                        }
                    });

                    if (ko.isObservable(options.customQueryParameters)) {
                        options.customQueryParameters.subscribe((newValue: any) => {
                            (<any>$(element)).bootstrapTable('refresh', {pageNumber: 1});
                        });
                    }
                }

                (<any>$(element)).bootstrapTable(options);                
            }
        }
    }

    Bindings.registerCustomBinding("grid", new GridBinding());
}