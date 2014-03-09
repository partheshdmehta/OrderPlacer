function showOrderList() {
    //app.itemSelectAll();
    onsearchitem();
}

function onsearchitem() {
    try {
        showLoader();
        var desc = 'Item not found!';
        for (var i = 0; i < itemlist.length; i++) {
            if (itemlist[i].ITEMNO == '091204442642') {    
                desc = itemlist[i].DESC;
                break;
            }
        }
        hideLoader();
        customAlert(desc);
        
        /*itemlist.filter(function(item) {
            if (item.ITEMNO == 'STH207726LGN') {
                hideLoader();
                customAlert("description:" + item.DESC);
                //desc = item.description;
                return;
            }
        });*/
        //customAlert("Item not found!");
        /*var render = function (tx, rs) {
        alert("render");
        hideLoader();
        if (rs.rows.length != 1)
        customAlert("Item not found!");
        else {
        customAlert(rs.rows.item(0).description);                
        }
        }
        app.db.transaction(function(tx) {    
        tx.executeSql("SELECT * FROM item WHERE itemno=?", ['STH207726LGN'], render, app.onError);
        });*/
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }    
    finally {
        //customAlert(desc);
    }
}