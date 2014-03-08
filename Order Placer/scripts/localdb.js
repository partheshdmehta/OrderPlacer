var app = new kendo.mobile.Application(document.body, { transition: "slide"});

app.db = null;

app.onError = function(tx, e) {
    customAlert("The following error occured: " + e.message);
} 

function initLocalDB() {
    showLoader();
    app.openDb();
    //createOrderTable();
    //createOrderItemTable();
    app.createItemTable();
    app.itemFill();
    //app.itemSelectAll();
}

app.openDb = function() {
    if (window.navigator.simulator === true) {
        // For debugin in simulator fallback to native SQL Lite
        console.log("Use built in SQL Lite");
        app.db = window.openDatabase("Todo", "1.0", "Cordova Demo", 200000);
    } else {
        app.db = window.sqlitePlugin.openDatabase("Todo");
    }
}

app.createItemTable = function() {
    var db = app.db;
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS item(itemno TEXT, description TEXT, price TEXT)", []);
    });
}

app.itemFill = function() {
    try {
        $.get("../data/itemlist.xml", {}, function (xml) {
            $('ITEM', xml).each(function () {
                app.addItem(GetXMLAttributeValue(this, 'ITEMNO'), GetXMLAttributeValue(this, 'DESC'), GetXMLAttributeValue(this, 'PRICE'));            
            });
            hideLoader();
            navigator.splashscreen.hide();
            navigate("../Order/order.html");
        });
    } catch (err) { 					
        customAlert("The following error occured: " + err.message);        
    }
}

app.addItem = function(itemNo, description, price) {
    var db = app.db;
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO item(itemno, description, price) VALUES (?,?,?)",
                      [itemNo, description, price],
                      app.onSuccess,
                      app.onError);
    });
}

app.itemSelectAll = function() {
    debugger;
    var renderTodo = function (row) {
        return "<li>" + "<div class='todo-check'></div>" + row.todo + "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
    }
    
    var render = function (tx, rs) {
        var rowOutput = "";
        var todoItems = document.getElementById("todoItems");
        for (var i = 0; i < rs.rows.length; i++) {
            rowOutput += renderTodo(rs.rows.item(i));
        }
      
        todoItems.innerHTML = rowOutput;
    }
    
    var db = app.db;
    db.transaction(function(tx) {
        debugger;
        tx.executeSql("SELECT * FROM item", [], 
                      render, 
                      app.onError);
    });
}

app.createOrderTable = function() {
    var db = app.db;
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS order(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
    });
}

app.createOrderItemTable = function() {
    var db = app.db;
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS orderitem(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
    });
}

app.deleteOrderItem = function(id) {
    var db = app.db;
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM todo WHERE ID=?", [id],
                      app.onSuccess,
                      app.onError);
    });
}

app.onSuccess = function(tx, r) {
    //app.refresh();
}