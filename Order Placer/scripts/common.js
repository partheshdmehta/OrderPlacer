//to navigate to different page
function navigate(pagePath) {
    app.navigate(pagePath); 
}

function showLoader(div) { 
    if (div != undefined)
        $("#" + div).hide();
    $(document.body).append($('<div id="overlay" class="overlayeffect"></div>'));
    app.showLoading();     
};

//to hide loader after page loaded successfully
function hideLoader(div) {    
    $("#overlay").remove();
    app.hideLoading();
    if (div != undefined)
        $("#" + div).show();
};

function customAlert(message) {
    navigator.notification.alert(
        message, // message
        alertDismissed, // callback
        'Order Placer', // title
        'Ok'            // buttonName
        );
}

function alertDismissed() {
}