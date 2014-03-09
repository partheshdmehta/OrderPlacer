var app = new kendo.mobile.Application(document.body, {layout: "tabstrip-layout", transition: "slide"});

app.db = null;

app.onSuccess = function(tx, r) {
    //customAlert("onSuccess");    
}

app.onError = function(tx, e) {
    debugger;
    hideLoader();
    customAlert("The following error occured: " + e.message);
} 

function initLocalDB() {
    try {
        showLoader();
        app.openDb();
        app.createItemTable();
        app.itemFill();
        //app.createCustomerTable();
        //app.deleteOrderTable();
        //app.createOrderTable();
        //app.orderFill();
        //app.createOrderItemTable();
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
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
                for (var i = 0; i < itemlist.length; i++) {
                    app.addItem(itemlist[i].ITEMNO, itemlist[i].DESC, itemlist[i].PRICE);
                }
                /*for (var i = 0; i < 10000; i++) {
                app.addItem("item-" + (i + 1), "desc-" + (i + 1), (i + 1) * 100);
                }*/
                hideLoader();
                navigate("../Order/order.html");
                /*var fileName = "../data/itemlist.xml";
                if (window.navigator.simulator === true) {
                fileName = "../data/itemlist.min.xml";
                }
                $.get(fileName, {}, function (xml) {
                $('ITEM', xml).each(function () {
                app.addItem(GetXMLAttributeValue(this, 'ITEMNO'), GetXMLAttributeValue(this, 'DESC'), GetXMLAttributeValue(this, 'PRICE'));            
                });
                hideLoader();
                navigate("../Order/order.html");
                });*/        
            } else {
                hideLoader();
                navigate("../Order/order.html");
            }
        }    
        app.db.transaction(function(tx) {
            tx.executeSql("DELETE FROM item", [], app.onSuccess, app.onError);
        });
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
            //alert(rs.rows.item(0).totalRecord);
            var rowOutput = "";
            var todoItems = document.getElementById("todoItems");
            for (var i = 0; i < rs.rows.length; i++) {
                rowOutput += renderTodo(rs.rows.item(i));
            }
            todoItems.innerHTML = rowOutput;
            hideLoader();
        }
        app.db.transaction(function(tx) {    
            tx.executeSql("SELECT TOP 1 * FROM item ORDER BY price DESC", [], render, app.onError);
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
}

app.createCustomerTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS customer(idcust TEXT PRIMARY KEY ASC, namecust TEXT, address TEXT)", []);
    });
}

app.createOrderTable = function() {
    try {
        app.db.transaction(function(tx) {
            debugger;
            tx.executeSql("CREATE TABLE IF NOT EXISTS order(orderno TEXT, idcust TEXT, namecust TEXT, date DATE, amount TEXT)", []);
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
}

app.orderFill = function() {
    try {
        var render = function (tx, rs) {
            debugger;
            alert(rs.rows.item(0).totalRecord);
            if (rs.rows.item(0).totalRecord == 0) {
                for (var i = 0; i < 2; i++) {
                    debugger;
                    app.addOrder("O-" + (i + 1), "custID-" + (i + 1), "custName-" + (i + 1), new Date(), (i + 1) * 100);
                }
                hideLoader();
                navigate("../Order/order.html");       
            } else {
                hideLoader();
                navigate("../Order/order.html");
            }            
        }
        
        /*app.db.transaction(function(tx) {
        debugger;
        tx.executeSql("DELETE FROM order", [], app.onSuccess, app.onError);
        });*/
        app.db.transaction(function(tx) {    
            debugger;
            tx.executeSql("SELECT COUNT(*) AS totalRecord FROM order", [], render, app.onError);
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }     
}

app.orderSelectAll = function() {
    try {
        debugger;
        showLoader();
        var renderTodo = function (row) {
            return "<li>" + "<div class='todo-check'></div>" + row.orderno + " : " + row.amount + "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
        }
    
        var render = function (tx, rs) {
            debugger;
            var rowOutput = "";
            var todoItems = document.getElementById("todoItems");
            for (var i = 0; i < rs.rows.length; i++) {
                rowOutput += renderTodo(rs.rows.item(i));
            }
            todoItems.innerHTML = rowOutput;
            hideLoader();
        }
    
        app.db.transaction(function(tx) {    
            tx.executeSql("SELECT * FROM order", [], render, app.onError);
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
}

app.addOrder = function(orderno, idcust, namecust, date, amount) {
    try {
        app.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO order(orderno, idcust, namecust, date, amount) VALUES (?,?,?,?,?)",
                          [orderno, idcust, namecust, date, amount],
                          app.onSuccess,
                          app.onError);
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
}

app.deleteOrderTable = function() {
    try {
        app.db.transaction(function(tx) {
            debugger;
            tx.executeSql("DROP TABLE order", [], app.onSuccess, app.onError);
        });
    } catch (err) { 					
        debugger;
        customAlert("The following error occured: " + err.message);        
    }
}

app.deleteOrderItemTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql("DROP TABLE orderitem", []);
    });
}

app.deleteCustomerTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql("DROP TABLE customer", []);
    });
}

app.createOrderItemTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS orderitem(orderno TEXT, itemno TEXT, description TEXT, qty TEXT, price TEXT)", []);
    });
}

app.deleteOrderItem = function(itenNo) {
    app.db.transaction(function(tx) {
        tx.executeSql("DELETE FROM orderitem WHERE ITEMNO=?", [itenNo], app.onSuccess, app.onError);
    });
}