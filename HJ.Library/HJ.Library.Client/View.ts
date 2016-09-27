
module hj.library.authentication {
	export var LogonUserViewId:string = "hj-library-authentication-LogonUserView";
}
module hj.library.views {
	export function register(){
		var bodyElement = $('body');
		bodyElement.append('<script type="text/html" id="hj-library-authentication-LogonUserView">\u003cdiv\u003e\r\n    Name: \r\n    \u003cinput type=\"text\" data-bind=\"value: name\" /\u003e\r\n    \u003cbr /\u003e\r\n    Password: \r\n    \u003cinput type=\"password\" data-bind=\"value: password\" /\u003e\r\n    \u003cbr /\u003e\r\n    \u003cbutton data-bind=\"click: logon\"\u003eLogon\u003c/button\u003e\r\n\u003c/div\u003e</script>');
	}
}

