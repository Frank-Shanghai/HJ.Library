module hj.library {
    export class SearchableDropDownListComponentViewModel {
        private _multiple = false;
        private _placeholder: string;
        private _data: Array<ISearchableDropDownListComponentItem> | KnockoutObservableArray<ISearchableDropDownListComponentItem>;
        private _enabled: boolean | KnockoutObservable<boolean>;
        private _tags: boolean = false;
        private _allowClear: boolean = true;
        private _select: any;

        constructor(parameters: ISearchableDropDownListComponentParameters) {
            parameters = ko.unwrap(parameters.context || parameters);
            if (parameters.multiple === true) {
                this._multiple = true;
            }
            else {
                this._multiple = false;
            }

            this._placeholder = parameters.placeholder;
            this._data = parameters.data;
            this._enabled = parameters.enabled;
            this._select = parameters.select;

            if (parameters.tags === true) {
                this._tags = true;
            }

            if (parameters.allowClear === false) {
                this._allowClear = false;
            }
        }
    }
}