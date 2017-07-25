module hj.library.pages {
    export class BorrowReturnContentTemplateViewModel {
        public booksGridOptions = {
            columns: [
                {
                    title: 'Title',
                    field: 'name'
                },
                {
                    title: 'Author',
                    field: 'author'
                },
                {
                    title: 'Publisher',
                    field: "publisher"
                }
            ],
            striped: true,
            sortable: true
        };

        constructor(public userName: string, public userEmail: string, public books: any) {

        }
    }
}