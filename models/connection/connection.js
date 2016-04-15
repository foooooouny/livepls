/**
 * Created by Administrator on 2016/4/14.
 */

var app = require('./server');

var db_config = require("../unit/mysql");

var mysql = require('mysql');

var session = require("express-session");

var MySQLStore = require('express-mysql-session')(session);

var sessionStore = new MySQLStore(db_config);

app.use(session({
    key : 'session_user',
    secret: 'session_secret',
    store: sessionStore,
    resave: true,
    saveUninitializd: true
}));

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


module.exports = conn;