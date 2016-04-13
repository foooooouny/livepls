var express = require("express");

var bodyParser = require("body-parser");

var path = require('path');

var mysql = require('mysql');

var port = process.env.PORT || 3000;

var app = express();

var db_config = require("./mysql");

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

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));  //express.bodyParser()   应该为独立的中间件 bodyParser
app.use(express.static(path.join(__dirname , 'public')));
app.listen(port);
console.log("Server start on port " + port);

module.exports.appExpress = app;