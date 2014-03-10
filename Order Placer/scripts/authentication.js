function onlogin() {
    app.initLocalDB();
    app.orderFill();
}

function onLogout(){
    navigate("login.html");    
}