﻿
module hj.library.authentication {
	export var LogonView:string = "\u003cdiv class=\"container logon\"\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-offset-3 col-md-6\"\u003e\r\n            \u003cdiv class=\"header\"\u003e\r\n                \u003cspan\u003eLogin\u003c/span\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"form-group\"\u003e\r\n                \u003cinput type=\"text\" class=\"form-control\" placeholder=\"account\" data-bind=\"value: name\" /\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"form-group\"\u003e\r\n                \u003cinput type=\"password\" class=\"form-control\" placeholder=\"password\" data-bind=\"value: password\" /\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"footer\"\u003e\r\n                \u003cbutton class=\"btn btn-default\" data-bind=\"click: reset\"\u003eReset\u003c/button\u003e\r\n                \u003cbutton class=\"btn btn-default\" data-bind=\"click: logon\"\u003eSign In\u003c/button\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e";
	export var LogonViewId:string = "hj-library-authentication-LogonView";
}
module hj.library.pages {
	export var HomePageView:string = "\u003cdiv\u003e\r\n    \u003ch1\u003eWelcome!\u003c/h1\u003e\r\n\u003c/div\u003e\r\n";
	export var HomePageViewId:string = "hj-library-pages-HomePageView";
}
module hj.library.pages.books {
	export var BookDetailsTemplateView:string = "\u003cdiv class=\"container\"\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eTitle:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: name\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eAuthor:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: author\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eISBN:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: isbn\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003ePublisher:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: publisher\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003ePublication Date:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: moment(publicationDate).format(\u0027MM-DD-YYYY\u0027)\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003ePages:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: pages\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eCopies:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: copies\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eOwner:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-4\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: owner\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n    \u003cdiv class=\"row\"\u003e\r\n        \u003cdiv class=\"col-md-2\" style=\"text-align: right; padding-right: 0; font-weight: 700\"\u003e\u003cspan\u003eComment:\u003c/span\u003e\u003c/div\u003e\r\n        \u003cdiv class=\"col-md-10\" style=\"text-align: left\"\u003e\u003cspan data-bind=\"text: comment\"\u003e\u003c/span\u003e\u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n";
	export var BookDetailsTemplateViewId:string = "hj-library-pages-books-BookDetailsTemplateView";
	export var BooksView:string = "\u003cdiv id=\"books-toolbar\" class=\"grid-toolbar\"\u003e\r\n    \u003cbutton id=\"books-add\" class=\"btn btn-default\" data-bind=\"click: add\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-plus\"\u003e\u003c/i\u003eAdd\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"books-edit\" class=\"btn btn-default\" data-bind=\"click: edit, enable: selectedBooks().length === 1 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-edit\"\u003e\u003c/i\u003eEdit\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"books-remove\" class=\"btn btn-danger\" data-bind=\"click: remove, enable: selectedBooks().length \u003e 0 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-remove\"\u003e\u003c/i\u003eDelete\r\n    \u003c/button\u003e\r\n\u003c/div\u003e\r\n\u003ctable data-bind=\"grid: {options: gridOptions, selectionChanged: refreshSelection}\"\u003e\u003c/table\u003e";
	export var BooksViewId:string = "hj-library-pages-books-BooksView";
	export var EditBookView:string = "\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eISBN\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"ISBN\" data-bind=\"value: isbn\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eTitle\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Title\" data-bind=\"value: bookTitle\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eAuthor\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Author\" data-bind=\"value: author\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003ePublisher\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Publisher\" data-bind=\"value: publisher\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003ePublication Date\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Publication Date\" data-bind=\"datepicker: publicationDate, datepickerOptions: {format: \u0027MM/DD/YYYY\u0027}\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003ePages\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Pages\" data-bind=\"value: pages\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eCopies\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Copies\" data-bind=\"value: copies\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eOwner\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Owner\" data-bind=\"value: owner\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eComment\u003c/label\u003e\r\n    \u003ctextarea class=\"form-control\" rows=\"3\" placeholder=\"any comments\" data-bind=\"value: comment\" /\u003e\r\n\u003c/div\u003e\r\n\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: create, visible: !isEditingMode()\"\u003eCreate\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: update, visible: isEditingMode\"\u003eSave\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: cancel\"\u003eCancel\u003c/button\u003e";
	export var EditBookViewId:string = "hj-library-pages-books-EditBookView";
}
module hj.library.pages.dialogs {
	export var ChangePasswordDialogView:string = "\u003cdiv id=\"changePassword\" class=\"modal fade change-password\" data-backdrop=\"static\"\u003e\r\n    \u003cdiv class=\"modal-dialog\"\u003e\r\n        \u003cdiv class=\"modal-content\"\u003e\r\n            \u003cdiv class=\"modal-header\"\u003e\r\n                \u003cbutton class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"\u003e\u0026times;\u003c/button\u003e\r\n                \u003ch3 class=\"modal-title\"\u003eChange Password\u003c/h3\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"modal-body\"\u003e\r\n                \u003cdiv class=\"form-group\"\u003e\r\n                    \u003clabel\u003eOld Password\u003c/label\u003e\r\n                    \u003cinput class=\"form-control\" type=\"password\" placeholder=\"old password\" data-bind=\"value: oldPassword\" /\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv class=\"form-group\"\u003e\r\n                    \u003clabel\u003eNew Password\u003c/label\u003e\r\n                    \u003cinput class=\"form-control\" type=\"password\" placeholder=\"new password\" data-bind=\"value: newPassword\" /\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv class=\"form-group\"\u003e\r\n                    \u003clabel\u003eConfirm Password\u003c/label\u003e\r\n                    \u003cinput class=\"form-control\" type=\"password\" placeholder=\"confirm password\" data-bind=\"value: confirmPassword\" /\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"modal-footer\"\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cbutton class=\"btn btn-default\" data-dismiss=\"modal\"\u003eClose\u003c/button\u003e\r\n                    \u003cbutton class=\"btn btn-default change-button\" data-dismiss=\"modal\" data-bind=\"click: changePassword\"\u003eChange\u003c/button\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n";
	export var ChangePasswordDialogViewId:string = "hj-library-pages-dialogs-ChangePasswordDialogView";
	export var InformationDialogComponentView:string = "\u003cdiv class=\"dialog-overlay-layer\"\u003e\r\n    \u003cdiv class=\"dialog-container\"\u003e\r\n        \u003cdiv class=\"dialog-header\"\u003e\r\n            \u003cspan class=\"dialog-page-title\" data-bind=\"text: _title\"\u003e\u003c/span\u003e\r\n        \u003c/div\u003e\r\n        \u003cdiv class=\"dialog-content\"\u003e\r\n            \u003cspan class=\"dialog-header-message\" data-bind=\"text: _header\"\u003e\u003c/span\u003e\r\n            \u003cdiv class=\"dialog-message\" data-bind=\"text: _message\"\u003e\u003c/div\u003e\r\n        \u003c/div\u003e\r\n        \u003cdiv class=\"dialog-footer\"\u003e\r\n            \u003c!-- ko if: _isOKButtonVisible --\u003e\r\n            \u003cbutton class=\"btn btn-default\" data-bind=\"text: _okButtonText, click: confirmClick\"\u003e\u003c/button\u003e\r\n            \u003c!-- /ko --\u003e\r\n            \u003c!-- ko if: _isCancelButtonVisible --\u003e\r\n            \u003cbutton class=\"btn btn-default\" data-bind=\"text: _cancelButtonText, click: cancelClick\"\u003e\u003c/button\u003e\r\n            \u003c!-- /ko --\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n";
	export var InformationDialogComponentViewId:string = "hj-library-pages-dialogs-InformationDialogComponentView";
	export var UserProfileDialogView:string = "\u003cdiv id=\"userProfile\" class=\"modal fade user-profile\"\u003e\r\n    \u003cdiv class=\"modal-dialog\"\u003e\r\n        \u003cdiv class=\"modal-content\"\u003e\r\n            \u003cdiv class=\"modal-header\"\u003e\r\n                \u003cbutton class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"\u003e\u0026times;\u003c/button\u003e\r\n                \u003ch3 class=\"modal-title\"\u003eUser Profile\u003c/h3\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"modal-body\"\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eFirst Name: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: firstName\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eLast Name: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: lastName\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eLogon Name: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: userName\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eEmail: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: email\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cspan class=\"field-name\"\u003eRoles: \u003c/span\u003e\r\n                    \u003cspan data-bind=\"text: roles.toString()\"\u003e\u003c/span\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"modal-footer\"\u003e\r\n                \u003cdiv\u003e\r\n                    \u003cbutton class=\"btn btn-default\" data-dismiss=\"modal\"\u003eOK\u003c/button\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n";
	export var UserProfileDialogViewId:string = "hj-library-pages-dialogs-UserProfileDialogView";
}
module hj.library.pages.users {
	export var EditUserView:string = "\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eEmail\u003c/label\u003e\r\n    \u003cinput type=\"email\" class=\"form-control\" placeholder=\"email address\" data-bind=\"value: email, enable: !isEditingMode()\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eLogin Name\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Login Name\" data-bind=\"value: userName, enable: !isEditingMode()\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eFirst Name\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"First Name\" data-bind=\"value: firstName\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eLast Name\u003c/label\u003e\r\n    \u003cinput type=\"text\" class=\"form-control\" placeholder=\"Last Name\" data-bind=\"value: lastName\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\"\u003e\r\n    \u003clabel\u003eRoles\u003c/label\u003e\r\n    \u003cdiv class=\"panel panel-default\"\u003e\r\n        \u003cdiv class=\"panel-body\"\u003e\r\n            \u003cdiv class=\"checkbox\"\u003e\r\n                \u003clabel\u003e\u003cinput type=\"checkbox\" value=\"User\" data-bind=\"checked: selectedRoles\" /\u003eUser\u003c/label\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"checkbox\"\u003e\r\n                \u003clabel\u003e\u003cinput type=\"checkbox\" value=\"Admin\" data-bind=\"checked: selectedRoles\" /\u003eAdmin\u003c/label\u003e\r\n            \u003c/div\u003e\r\n            \u003cdiv class=\"checkbox\"\u003e\r\n                \u003clabel\u003e\u003cinput type=\"checkbox\" value=\"SuperAdmin\" data-bind=\"checked: selectedRoles\" /\u003eSuperAdmin\u003c/label\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e\r\n\u003c!-- TODO: Add the option to use default password --\u003e\r\n\u003cdiv class=\"form-group\" data-bind=\"visible: !isEditingMode()\"\u003e\r\n    \u003clabel\u003ePassword\u003c/label\u003e\r\n    \u003cinput type=\"password\"class=\"form-control\" placeholder=\"Password\" data-bind=\"value: password\" /\u003e\r\n\u003c/div\u003e\r\n\u003cdiv class=\"form-group\" data-bind=\"visible: !isEditingMode()\"\u003e\r\n    \u003clabel\u003eConfirm Password\u003c/label\u003e\r\n    \u003cinput type=\"password\" class=\"form-control\" placeholder=\"Confirm Password\" data-bind=\"value: confirmPassword\" /\u003e\r\n\u003c/div\u003e\r\n\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: createUser, visible: !isEditingMode()\"\u003eCreate\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: updateUser, visible: isEditingMode\"\u003eSave\u003c/button\u003e\r\n\u003cbutton class=\"btn btn-default\" data-bind=\"click: cancel\"\u003eCancel\u003c/button\u003e";
	export var EditUserViewId:string = "hj-library-pages-users-EditUserView";
	export var UsersView:string = "\u003cdiv id=\"users-toolbar\" class=\"grid-toolbar\"\u003e\r\n    \u003cbutton id=\"users-add\" class=\"btn btn-default\" data-bind=\"click: add\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-plus\"\u003e\u003c/i\u003eAdd\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"users-edit\" class=\"btn btn-default\" data-bind=\"click: edit, enable: selectedUsers().length === 1 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-edit\"\u003e\u003c/i\u003eEdit\r\n    \u003c/button\u003e\r\n    \u003cbutton id=\"users-remove\" class=\"btn btn-danger\" data-bind=\"click: remove, enable: selectedUsers().length \u003e 0 ? true : false\"\u003e\r\n        \u003ci class=\"glyphicon glyphicon-remove\"\u003e\u003c/i\u003eDelete\r\n    \u003c/button\u003e\r\n\u003c/div\u003e\r\n\u003ctable id=\"users\" data-bind=\"grid: {options: gridOptions, selectionChanged: refreshSelection}\"\u003e\u003c/table\u003e\r\n";
	export var UsersViewId:string = "hj-library-pages-users-UsersView";
}
module hj.library.views {
	export function register(){
		var bodyElement = $('body');
		bodyElement.append('<script type="text/html" id="hj-library-authentication-LogonView">' + hj.library.authentication.LogonView + '</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-HomePageView">' + hj.library.pages.HomePageView + '</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-books-BookDetailsTemplateView">' + hj.library.pages.books.BookDetailsTemplateView + '</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-books-BooksView">' + hj.library.pages.books.BooksView + '</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-books-EditBookView">' + hj.library.pages.books.EditBookView + '</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-dialogs-ChangePasswordDialogView">' + hj.library.pages.dialogs.ChangePasswordDialogView + '</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-dialogs-InformationDialogComponentView">' + hj.library.pages.dialogs.InformationDialogComponentView + '</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-dialogs-UserProfileDialogView">' + hj.library.pages.dialogs.UserProfileDialogView + '</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-users-EditUserView">' + hj.library.pages.users.EditUserView + '</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-users-UsersView">' + hj.library.pages.users.UsersView + '</script>');
	}
}

