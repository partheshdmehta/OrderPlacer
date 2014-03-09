var app = new kendo.mobile.Application(document.body, {layout: "tabstrip-layout", transition: "slide"});

app.db = null;

app.onSuccess = function(tx, r) {
    //customAlert("onSuccess");    
}

app.onError = function(tx, e) {
    hideLoader();
    customAlert("The following error occured: " + e.message);
} 

function initLocalDB() {
    showLoader();
    app.openDb();
    app.createItemTable();
    app.itemFill();
    app.createCustomerTable();
    app.createOrderTable();
    app.createOrderItemTable();
}

app.openDb = function() {
    try {
        if (window.navigator.simulator === true) {
            // For debugin in simulator fallback to native SQL Lite
            console.log("Use built in SQL Lite");
            app.db = window.openDatabase("orderplacer", "1.0", "Cordova Demo", 200000);
        } else {
            app.db = window.sqlitePlugin.openDatabase("orderplacer");
        }
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
}

app.createItemTable = function() {
    try {
        app.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS item(itemno TEXT, description TEXT, price TEXT)", []);
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }    
}

app.itemFill = function() {
    try {
        //check whether item exists or not
        var render = function (tx, rs) {
            alert(rs.rows.item(0).totalRecord);
            if (rs.rows.item(0).totalRecord == 0) {
                var fileName="../data/itemlist.xml";
                if (window.navigator.simulator === true) {
                    fileName = "../data/itemlist.min.xml";
                }
                $.get(fileName, {}, function (xml) {
                    $('ITEM', xml).each(function () {
                        app.addItem(GetXMLAttributeValue(this, 'ITEMNO'), GetXMLAttributeValue(this, 'DESC'), GetXMLAttributeValue(this, 'PRICE'));            
                    });
                    hideLoader();
                    navigate("../Order/order.html");
                });        
            } else {
                hideLoader();
                navigate("../Order/order.html");
            }
        }            
        app.db.transaction(function(tx) {    
            tx.executeSql("SELECT COUNT(*) AS totalRecord FROM item", [], render, app.onError);
        });        
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
}

app.addItem = function(itemNo, description, price) {
    try {
        app.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO item(itemno, description, price) VALUES (?,?,?)",
                          [itemNo, description, price],
                          app.onSuccess,
                          app.onError);
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
}

app.itemSelectAll = function() {
    try {
        showLoader();
        var renderTodo = function (row) {
            return "<li>" + "<div class='todo-check'></div>" + row.itemno + " : " + row.description + "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
        }
    
        var render = function (tx, rs) {
            var rowOutput = "";
            var todoItems = document.getElementById("todoItems");
            for (var i = 0; i < rs.rows.length; i++) {
                rowOutput += renderTodo(rs.rows.item(i));
            }
            todoItems.innerHTML = rowOutput;
            hideLoader();
        }
    
        app.db.transaction(function(tx) {    
            tx.executeSql("SELECT * FROM item", [], render, app.onError);
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
}

app.createCustomerTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS customer(IDCUST TEXT PRIMARY KEY ASC, NAMECUST TEXT, ADDRESS TEXT)", []);
    });
}

app.createOrderTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS order(ORDERNO TEXT PRIMARY KEY ASC, IDCUST TEXT, NAMECUST TEXT, DATE DATETIME, AMOUNT TEXT)", []);
    });
}

app.createOrderItemTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS orderitem(ORDERNO TEXT, ITEMNO TEXT, DESCRIPTION TEXT, QTY TEXT, PRICE TEXT)", []);
    });
}

app.deleteOrderItem = function(itenNo) {
    app.db.transaction(function(tx) {
        tx.executeSql("DELETE FROM orderitem WHERE ITEMNO=?", [itenNo], app.onSuccess, app.onError);
    });
}