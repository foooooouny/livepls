/**
 * Created by Administrator on 2016/4/13.
 */
var appExpress = require("./app");

var app = appExpress.appExpress;

var db_config = require("./mysql.js");

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