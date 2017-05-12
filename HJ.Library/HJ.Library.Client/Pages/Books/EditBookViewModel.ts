module hj.library.pages {
    export class EditBookViewModel extends PageBase {
        public isEditingMode: KnockoutObservable<boolean> = ko.observable(false);

        public isbn: KnockoutObservable<string> = ko.observable('');
        public bookTitle: KnockoutObservable<string> = ko.observable('');
        public author = ko.observable('');
        public publisher = ko.observable('');
        public publicationDate: KnockoutObservable<Date> = ko.observable(null);
        public pages: KnockoutObservable<number> = ko.observable(undefined);
        public copies = ko.observable(undefined);
        public owner = ko.observable('');
        public comment = ko.observable('');

        constructor(private bookId?: string) {
            super();
            this.templateId = books.EditBookViewId;
            this.initialize(bookId);
        }

        private initialize(bookId?: string) {
            if (bookId) {
                this.isEditingMode(true);
                this.title('Edit Book');

                this.isProcessing(true);
                $.ajax({
                    type: 'get',
                    accepts: 'application/json',
                    url: "/api/books/" + bookId
                }).done(book => {
                    this.isbn(book.isbn);
                    this.bookTitle(book.name);
                    this.author(book.author);
                    this.publisher(book.publisher);
                    this.publicationDate(book.publicationDate);
                    this.pages(book.pages);
                    this.copies(book.copies);
                    this.owner(book.owner);
                    this.comment(book.comment);
                }).fail((jqXHR: JQueryXHR, textStatus: any, err: any) => {
                    alert(err.message);
                }).always(() => {
                    this.isProcessing(false);
                });
            }
            else {
                this.isEditingMode(false);
                this.title('Create New Book');
            }
        }

        private create = () => {
            this.isProcessing(true);
            $.ajax({
                type: 'post',
                contentType: 'application/json',
                url: '/api/books',
                data: JSON.stringify({
                    BookId: '3a519f4d-107d-4d5f-9572-325a3c027a50', // just pass an valid value here, won't be used as the real bookId, real guid will be generate on server side before creating new book
                    ISBN: this.isbn(),
                    Name: this.bookTitle(),
                    Author: this.author(),
                    Publisher: this.publisher(),
                    PublicationDate: this.publicationDate(),
                    Pages: this.pages(),
                    Copies: this.copies(),
                    Owner: this.owner(),
                    Comment: this.comment()
                })
            }).done(() => {
                this.space.addPage(new BooksViewModel(), null);
                //Application.instance.activePage(new BooksViewModel());
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                alert(err.message);
            }).always(() => {
                this.isProcessing(false);
            });
        }

        private update = () => {
            this.isProcessing(true);
            $.ajax({
                type: 'put',
                contentType: 'application/json',
                url: '/api/books/' + this.bookId,
                data: JSON.stringify({
                    BookId: this.bookId,
                    ISBN: this.isbn(),
                    Name: this.bookTitle(),
                    Author: this.author(),
                    Publisher: this.publisher(),
                    PublicationDate: this.publicationDate(),
                    Pages: this.pages(),
                    Copies: this.copies(),
                    Owner: this.owner(),
                    Comment: this.comment()
                })
            }).done((data: any, textStatus: any, jqXHR: any) => {
                this.space.addPage(new BooksViewModel(), null);
                //Application.instance.activePage(new BooksViewModel());
            }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                alert(err.message);
            }).always(() => {
                this.isProcessing(false);
            });
        }

        private cancel = () => {
            this.space.addPage(new BooksViewModel(), null);
            //Application.instance.activePage(new BooksViewModel());
        }
    }
}