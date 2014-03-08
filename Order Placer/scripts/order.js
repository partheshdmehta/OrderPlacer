function showOrderList() {
    app.itemSelectAll();
}

function onsearchitem() {
    showLoader();
    try {
        var render = function (tx, rs) {
            hideLoader();
            if (rs.rows.length != 1)
                customAlert("Item not found!");
            else {
                customAlert(rs.rows.item(0).description);                
            }
        }
        
        app.db.transaction(function(tx) {    
            tx.executeSql("SELECT * FROM item WHERE itemno=?", ['5027108708961'], render, app.onError);
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }    
}