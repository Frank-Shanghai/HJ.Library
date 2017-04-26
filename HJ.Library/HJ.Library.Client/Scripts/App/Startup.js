$(document).ready(function () {
    $.ajaxSetup({ xhrFields: {crossDomain: true, withCredentials: true} });

    //register knockout template here
    hj.library.views.register();

    //register custom component
    hj.library.ComponentRegistry.register();

    var application = hj.library.Application.instance;
    ko.applyBindings(application, document.documentElement);
});