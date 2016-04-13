/**
 * Created by Administrator on 2016/4/12.
 */
var conn = require('models/mysql');

var addOne = function(data,callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.query(insertSQL,[data.username,data.password,data.name,data.nickname,data.personstatus,data.liveurl,dateTime,dateTime,data.summary,data.poster] , function(err , rows ,fields) {
        if(err) {
            throw err;
        }
        return callback(rows);
    });
};

module.exports = addOne;