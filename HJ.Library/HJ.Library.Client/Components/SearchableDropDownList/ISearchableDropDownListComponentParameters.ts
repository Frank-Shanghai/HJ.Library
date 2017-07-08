module hj.library {
    export interface ISearchableDropDownListComponentItem {
        id: any;
        text: any;
    }

    export interface ISearchableDropDownListComponentParameters {
        context?: ISearchableDropDownListComponentParameters;
        multiple?: boolean;
        placeholder?: string;
        data: Array<ISearchableDropDownListComponentItem> | KnockoutObservableArray<ISearchableDropDownListComponentItem>;
        enabled: boolean | KnockoutObservable<boolean>;
        tags?: boolean;
        allowClear: boolean;

        /*
		 * Fires when item selection changed.
		 * KnockoutObservable<T>
		 * KnockoutObservableArray<T>
		 * (e: ISearchableDropDownListComponentSelectEvent<T>): void;
		 */
        select?: any;
    }

    export interface ISearchableDropDownListComponentSelectEvent<T> {
        dataItem: T;
        dataItems: T[];
    }
}