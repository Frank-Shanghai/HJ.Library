module hj.library {
    export class SearchableDropDownListBinding implements KnockoutBindingHandler {
        public init(element: any, valueAccessor: () => any, allBindings: any, viewModel: any, bindingContext: KnockoutBindingContext) {
            var _options = ko.unwrap(valueAccessor());

            var $select2 = $(element).select2({
                placeholder: _options.placeholder,
                allowClear: _options.allowClear,
                data: ko.unwrap(_options.data),
                tags: _options.tags
            });

            var updateControlState = (disabled: boolean) => {
                $select2.prop("disabled", disabled);
            };

            $(element).on("change", (e: any) => {
                var select = _options.select;

                if (ko.isObservable(select)) {
                    select($select2.val());
                }
                else if ($.isFunction(select)) {
                    select($select2.val());
                }
            });

            if (!($.isFunction(_options.select)) || ko.isObservable(_options.select)) {
                $select2.val(ko.unwrap(_options.select)).trigger("change");
            }
            else {
                $select2.val(null).trigger("change");
            }

            updateControlState(ko.unwrap(_options.enabled) === false ? true : false);

            // Update options if selection data source changed
            if (ko.isObservable(_options.data)) {
                (<KnockoutObservableArray<ISearchableDropDownListComponentItem>>_options.data).subscribe((newValue) => {
                    var newData = newValue;
                    var selectedValue = $select2.val();

                    // #region
                    //=========== Here is one way to refresh the data without first destory select2 control and re-initialize it==============
                    // Frank: I think the feature to dynamically refresh select2 data without re-building control is not offically implemented until 6/2017
                    // https://github.com/select2/select2/issues/2830 This is the discussion thread in git that are require such feature, and the workarounds
                    // developers are using, I used one of the solutions.

                    // Reference link: https://stackoverflow.com/questions/13268083/select2-changing-items-dynamically
                    // Ways porivded in this page don't work for me
                    // https://stackoverflow.com/questions/16480910/update-select2-data-without-rebuilding-the-control
                    // Clear selections
                    $(element).html("<optioin></options>"); // A plcaceholder is necessary

                    // Fill options with new data source
                    newData.forEach((item: any) => {
                        $(element).append($("<option></option>").attr("value", item.id).html(item.text));
                    });
                    // #end-region
                                        
                    // Update selected values 
                    if (selectedValue) {
                        if (_options.multiple === true) {
                            var multipleValue = [];
                            for (var j = 0; j < selectedValue.length; j++) {
                                for (var i = 0; i < newData.length; i++) {
                                    if (newData[i].id == selectedValue[j]) {
                                        multipleValue.push(selectedValue[j]);
                                        break;
                                    }
                                }
                            }

                            $select2.val(multipleValue).trigger("change");
                        }
                        else {
                            var value = null;
                            for (var i = 0; i < newData.length; i++) {
                                if (newData[i].id == selectedValue) {
                                    value = selectedValue;
                                    break;
                                }
                            }

                            $select2.val(value).trigger("change");
                        }
                    }
                    else {
                        $select2.val(null).trigger("change");
                    }
                });
            }

            // update control state
            if (ko.isObservable(_options.enabled)) {
                (<KnockoutObservable<boolean>>_options.enabled).subscribe((newValue) => {
                    updateControlState(!newValue);
                });
            }
        }
    }

    Bindings.registerCustomBinding("searchableDropDownList", new SearchableDropDownListBinding());
}










































// *********************************************************************************************************
//***************** The ways to first destory the select2 control and re-initialize it ****************************
// ***********************************************************************************************************
//module hj.library {
//    export class SearchableDropDownListBinding implements KnockoutBindingHandler {
//        private _options: ISearchableDropDownListComponentParameters;

//        public init(element: any, valueAccessor: () => any, allBindings: any, viewModel: any, bindingContext: KnockoutBindingContext) {
//            this._options = ko.unwrap(valueAccessor());
//            var updateControlState = (disabled: boolean) => {
//                $select2.prop("disabled", disabled);
//            };


//            var select2Options = {
//                placeholder: this._options.placeholder,
//                allowClear: this._options.allowClear,
//                data: ko.unwrap(this._options.data),
//                tags: this._options.tags

//            };

//            var $select2 = $(element).select2(select2Options);

//            $select2.val(null).trigger("change");
//            updateControlState(!ko.unwrap(this._options.enabled));

//            if (ko.isObservable(this._options.data)) {
//                // Handler if data has items changed (added, deleted or updated)
//                (<KnockoutObservableArray<ISearchableDropDownListComponentItem>>this._options.data).subscribe((newValue) => {
//                    var selectedValue = $select2.val();
//                    var newData = newValue;

//                    select2Options.data = newData;

//                    $(element).select2().empty();
//                    $(element).append("<option></option>"); // for placeholder

//                    $select2 = $(element).select2(select2Options);

//                    // Update selected values 
//                    if (selectedValue) {
//                        if (this._options.multiple === true) {
//                            var multipleValue = [];
//                            for (var j = 0; j < selectedValue.length; j++) {
//                                for (var i = 0; i < newData.length; i++) {
//                                    if (newData[i].id == selectedValue[j]) {
//                                        multipleValue.push(selectedValue[j]);
//                                        break;
//                                    }
//                                }
//                            }

//                            $select2.val(multipleValue).trigger("change");
//                        }
//                        else {
//                            var value = null;
//                            for (var i = 0; i < newData.length; i++) {
//                                if (newData[i].id == selectedValue) {
//                                    value = selectedValue;
//                                    break;
//                                }
//                            }

//                            $select2.val(value).trigger("change");
//                        }
//                    }
//                });
//                //}, null, "arrayChange");
//            }

//            // update control state
//            if (ko.isObservable(this._options.enabled)) {
//                (<KnockoutObservable<boolean>>this._options.enabled).subscribe((newValue) => {
//                    updateControlState(!newValue);
//                });
//            }
//        } 
//    }

//    Bindings.registerCustomBinding("searchableDropDownList", new SearchableDropDownListBinding());
//}