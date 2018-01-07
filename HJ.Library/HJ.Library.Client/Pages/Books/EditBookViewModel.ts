module hj.library.pages {
    export class EditBookViewModel extends PageBase {
        public isEditingMode: KnockoutObservable<boolean> = ko.observable(false);

        public isbn: KnockoutObservable<string> = ko.observable('');
        public bookTitle: KnockoutObservable<string> = ko.observable('');
        public author = ko.observable('');
        public publisher = ko.observable('');
        public publicationDate: KnockoutObservable<Date> = ko.observable(new Date());
        public pages: KnockoutObservable<number> = ko.observable(undefined);
        public copies: KnockoutObservable<number> = ko.observable(undefined);
        public owner = ko.observable('');
        public comment = ko.observable('');

        private emptyNameError = ko.observable(null);
        private emptyAuthorError = ko.observable(null);
        private pagesNumberValidationError = ko.observable(null);
        private copiesNumberValidationError = ko.observable(null);

        private book: any;

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
                    this.copies(parseInt(book.copies));
                    this.owner(book.owner);
                    this.comment(book.comment);
                    this.book = book;
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to initialize book information.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error, null, this);
                }).always(() => {
                    this.isProcessing(false);
                });
            }
            else {
                this.isEditingMode(false);
                this.title('Create New Book');
            }
        }

        private validate(): boolean {
            this.clearValidationError();
            var result = true;
            if (!this.bookTitle().trim()) {
                result = false;
                this.emptyNameError("Book title cannot be empty.");
            }

            if (!this.author().trim()) {
                result = false;
                this.emptyAuthorError("Book author cannot be empty.");
            }

            var regEx = new RegExp("[0-9]+");
            var message = "Please input appropriate number.";
            if ((!this.pages() && this.pages() != 0) || !regEx.test(this.pages().toString())) {
                result = false;
                this.pagesNumberValidationError(message);
            }

            if ((!this.copies() && this.copies() != 0) || !regEx.test(this.copies().toString())) {
                result = false;
                this.copiesNumberValidationError(message);
            }

            return result;
        }

        private clearValidationError() {
            this.emptyNameError(null);
            this.emptyAuthorError(null);
            this.pagesNumberValidationError(null);
            this.copiesNumberValidationError(null);
        }

        private create = () => {
            if (this.validate()) {
                this.isProcessing(true);
                $.ajax({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/api/books',
                    data: JSON.stringify({
                        BookId: Utils.guid(), // just pass an valid value here, won't be used as the real bookId, real guid will be generate on server side before creating new book
                        ISBN: this.isbn(),
                        Name: this.bookTitle(),
                        Author: this.author(),
                        Publisher: this.publisher(),
                        PublicationDate: this.publicationDate(),
                        Pages: this.pages(),
                        Copies: this.copies(),
                        AvailableCopies: this.copies(),
                        Owner: this.owner(),
                        Comment: this.comment()
                    })
                }).done(() => {
                    this.space.removePage(this);
                    this.space.addPage(new BooksViewModel(), null);
                    //Application.instance.activePage(new BooksViewModel());
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to create a new book.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error, null, this);
                }).always(() => {
                    this.isProcessing(false);
                });
            }
        }

        private update = () => {
            if (this.validate()) {
                this.isProcessing(true);
                $.ajax({
                    type: 'put',
                    contentType: 'application/json',
                    url: '/api/books/' + this.bookId,
                    data: JSON.stringify({
                        BookId: this.book.bookId,
                        ISBN: this.isbn(),
                        Name: this.bookTitle(),
                        Author: this.author(),
                        Publisher: this.publisher(),
                        PublicationDate: this.publicationDate(),
                        Pages: this.pages(),
                        Copies: this.copies(),
                        AvailableCopies: this.book.availableCopies + parseInt(this.copies().toString()) - this.book.copies,
                        Owner: this.owner(),
                        Comment: this.comment(),
                        RowVersion: this.book.rowVersion
                    })
                }).done((data: any, textStatus: any, jqXHR: any) => {
                    this.space.removePage(this);
                    this.space.addPage(new BooksViewModel(), null);
                    //Application.instance.activePage(new BooksViewModel());
                }).fail((jqXhr: JQueryXHR, textStatus: any, err: any) => {
                    var error: IError = new Error("Failed to update book.");
                    error.raw = JQueryXHRErrorFormatter.toString(jqXhr, error.message);

                    ErrorHandler.report(error, null, this);
                }).always(() => {
                    this.isProcessing(false);
                });
            }
        }

        private cancel = () => {
            this.space.removePage(this);
            this.space.addPage(new BooksViewModel(), null);
            //Application.instance.activePage(new BooksViewModel());
        }
    }
}