var mysql = require('mysql');
var session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);

var db_config = {
    connectionLimit: 10,
    host:"qdm175441403.my3w.com",
    user:"qdm175441403",
    password:"yzb960104",
    database:"qdm175441403_db",
    port:"3306",
    expiration:3600000,    //设置session存储时间
    createDatabaseTable:true,
    schema:{
        tableName: 'sessions',
        columnNames:{
            session_id:'session_id',
            expires:'expires',
            data:'data'
        }
    }
};
var conn;
function handleDisconnect() {
    conn = mysql.createConnection(db_config);
    conn.connect(function(err) {
        if(err){
            console.log("进行断线重连" + new Date());
            setTimeout(handleDisconnect,2000);
            return;
        }
        console.log("连接成功");
    });
    conn.on('error' , function(err) {
        console.log('db error' , err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    })
}
handleDisconnect();


var sessionStore = new MySQLStore(db_config);

app.use(session({
    key : 'session_user',
    secret: 'session_secret',
    store: sessionStore,
    resave: true,
    saveUninitializd: true
}));
