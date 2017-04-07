///<reference path="../PageBase.ts" />
module hj.library.pages {
    export class UsersViewModel extends PageBase {
        public users: KnockoutObservableArray<any> = ko.observableArray([]);
        public gridOptions: KnockoutObservable<any> = ko.observable(null);
        public selectedUsers: KnockoutObservableArray<any> = ko.observableArray([]);

        constructor() {
            super();
            this.templateId = users.UsersViewId;
            this.title("Users");
            this.initialize();
        }

        private initialize() {
            $.ajax({
                type: 'get',
                accepts: "application/json",
                url: '/api/accounts/users'
            }).done((users) => {
                this.users(users);
                this.gridOptions({
                    data: users,
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
                });
            })
                .fail(() => { });
        }

        private refreshSelection = (selectedRows: any) => {
            this.selectedUsers(selectedRows);
        }

        private edit = (userName: string) => {
            Application.instance.activePage(new EditUserViewModel(this.selectedUsers()[0]));
        }

        private add = () => {
            Application.instance.activePage(new EditUserViewModel());
        }

        private remove = () => {
            $.ajax({
                type: 'delete',
                url: '/api/accounts/user/' + this.selectedUsers()[0].id
            }).done(() => {
                this.refresh();
            }).fail((jqXhr: any, textStatus: any, err: any) => {
                alert(err.message);
            });
        }

        private refresh = () => {
            Application.instance.activePage(new UsersViewModel());
        }
    }
}