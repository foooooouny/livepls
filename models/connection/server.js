/**
 * Created by Administrator on 2016/4/15.
 */
var express = require("express");

var bodyParser = require("body-parser");

var path = require('path');

var port = process.env.PORT || 3000;

var app = express();


app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));  //express.bodyParser()   应该为独立的中间件 bodyParser
app.use(express.static(path.join(__dirname , '../../public')));
app.listen(port);
console.log("Server start on port " + port);


module.exports = app;