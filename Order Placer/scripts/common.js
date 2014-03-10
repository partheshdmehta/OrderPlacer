function cleanview() {
    //alert('cleanview');
    $("div[data-role=view]").each(function(i, elem) {
        if ($(elem).attr("data-url") && ($(elem).attr("data-url") !== window.location.href.split('#')[1].split('?')[0] && $(elem).attr("data-url") !== window.location.href.split('#')[1])) {
            $(elem).remove();
        }
    });
}

//to navigate to different page
function navigate(pagePath) {
    app.navigate(pagePath); 
}

function showLoader(div) { 
    if (div !== undefined)
        $("#" + div).hide();
    $(document.body).append($('<div id="overlay" class="overlayeffect"></div>'));
    app.showLoading();     
};

//to hide loader after page loaded successfully
function hideLoader(div) {    
    $("#overlay").remove();
    app.hideLoading();
    if (div !== undefined)
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

function GetXMLAttributeValue(obj, attribute) {
    return $(obj).attr(attribute).trim();
}