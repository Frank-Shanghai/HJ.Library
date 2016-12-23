
module hj.library.authentication {
	export var LogonViewId:string = "hj-library-authentication-LogonView";
}
module hj.library.pages {
	export var HomePageViewId:string = "hj-library-pages-HomePageView";
	export var UsersViewId:string = "hj-library-pages-UsersView";
}
module hj.library.views {
	export function register(){
		var bodyElement = $('body');
		bodyElement.append('<script type="text/html" id="hj-library-authentication-LogonView">\u003cdiv\u003e\r\n    Name: \r\n    \u003cinput type=\"text\" data-bind=\"value: name\" /\u003e\r\n    \u003cbr /\u003e\r\n    Password: \r\n    \u003cinput type=\"password\" data-bind=\"value: password\" /\u003e\r\n    \u003cbr /\u003e\r\n    \u003cbutton data-bind=\"click: logon\"\u003eLogon\u003c/button\u003e\r\n\u003c/div\u003e</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-HomePageView">\u003cdiv\u003e\r\n    \u003ch1\u003eWelcome!\u003c/h1\u003e\r\n\u003c/div\u003e\r\n</script>');
		bodyElement.append('<script type="text/html" id="hj-library-pages-UsersView">\u003cdiv\u003e\r\nUser list:\r\n\u003c/div\u003e\r\n</script>');
	}
}

