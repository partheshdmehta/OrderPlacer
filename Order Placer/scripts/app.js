(function (global) {
    document.addEventListener('deviceready', function () {
        setTimeout(function() {
            navigator.splashscreen.hide();
            navigate("login.html");
        }, 2000);
        //$(document.body).height(window.innerHeight);        
    }, false);
    app = new kendo.mobile.Application(document.body, {transition: "slide", layout: "tabstrip-layout"});
})(window);