$(document).ready(function () {
    $.ajaxSetup({ xhrFields: {crossDomain: true, withCredentials: true} });

    //rigister knockout template here
    hj.library.views.register();

    var application = hj.library.Application.instance;
    ko.applyBindings(application, document.documentElement);
});