﻿///<reference path="../PageBase.ts" />
module hj.library.pages {
    export class UsersViewModel extends PageBase {
        public dataSource: KnockoutObservableArray<any> = ko.observableArray([]);
        public gridOptions = {
            columns: [
                {
                    checkbox: true
                },
                {
                    title: "Name",
                    formatter: (value, row) => {
                        return row.firstName + ' ' + row.lastName;
                    }
                },
                {
                    title: "Logon Name",
                    field: "userName"
                },
                {
                    title: "Email",
                    field: "email"
                },
                {
                    title: "Roles",
                    field: "roles",
                    formatter: (value) => {
                        return value.toString();
                    }
                },
                {
                    title: "Id",
                    field: "id",
                    visible: false
                }
            ],
            striped: true,
            sortable: true,
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            clickToSelect: true
        };

        public selectedUsers: KnockoutObservableArray<any> = ko.observableArray([]);

        constructor() {
            super();
            this.templateId = users.UsersViewId;
            this.title("Users");
            this.refreshDataGrid();
        }

        private refreshDataGrid() {
            this.isProcessing(true);
            $.ajax({
                type: 'get',
                accepts: "application/json",
                url: '/api/accounts/users'
            }).done((users) => {
                this.dataSource(users);
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                var error: IError = new Error("Failed to get users list.");
                error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                ErrorHandler.report(error, null, this);
            }).always(() => {
                this.isProcessing(false);
            });
        }

        private refreshSelection = (selectedRows: any) => {
            this.selectedUsers(selectedRows);
        }

        private edit = (userName: string) => {
            //Application.instance.activePage(new EditUserViewModel(this.selectedUsers()[0]));
            this.space.addPage(new EditUserViewModel(this.selectedUsers()[0]), null);
        }

        private add = () => {
            this.space.addPage(new EditUserViewModel(), null);
            //Application.instance.activePage(new EditUserViewModel());
        }

        private remove = () => {
            //TODO: 
            // 2. Check if it has any books not returned or owned any books, handle these things first and then delete it
            InformationHandler.report({
                title: "Delete",
                header: "Please Confirm",
                message: "Are you sure you want to delete the selected record(s)?",
                isOKButtonVisible: true,
                okButtonText: "Delete",
                isCancelButtonVisible: true,
                cancelButtonText: "Cancel",
                onConfirm: () => {
                    removeHandler();
                }
            }, this);

            var removeHandler = () => {
                this.isProcessing(true);
                var promises = [];
                for (var i = 0; i < this.selectedUsers().length; i++) {
                    var deferredObject = $.Deferred();
                    var promise = () => {
                        $.ajax({
                            type: 'delete',
                            url: '/api/accounts/user/' + this.selectedUsers()[i].id
                        }).done(() => {
                            deferredObject.resolve();
                        }).fail((jqXhr: any, textStatus: any, err: any) => {
                            deferredObject.reject(jqXhr, textStatus, err);
                        });

                        return deferredObject.promise();
                    };

                    promises.push(promise());
                }

                $.when.apply($, promises).done(() => {
                    this.refreshDataGrid();
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to delete selected users.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error, null, this);
                }).always(() => {
                    this.isProcessing(false);
                });
            }
        }
    }
}