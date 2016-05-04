/**
 * Created by Administrator on 2016/4/13.
 */
var conn = require('../connection/connection');

var sqlQuery = require('./sqlQuery');

var format = require('../unit/dataFormat');

Date.prototype.Format = format;

var sqlFun = {};

//根据 表名 获取所有数据
sqlFun.findAll = function (table, callback) {
    conn.conn.query(sqlQuery.selectAll, function(err , rows , fields) {
        //创建数据List
        var movieList = [];
        var i;
        if(err) {
            throw err;
        }else {
            for (i in rows) {
                movieList.push(rows[i]);
            }
            return callback(movieList);
        }
    });
};


//添加单个数据
sqlFun.addOne = function (data, callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.conn.query(sqlQuery.insertSQL,[data.username,data.password,data.name,data.nickname,data.personstatus,data.liveurl,dateTime,dateTime,data.summary,data.poster] , function(err , rows ,fields) {
        if(err) {
            throw err;
        }
        return callback(rows);
    });
};



//根据id获取单个数据
sqlFun.findOne = function (id, callback){
    conn.conn.query(sqlQuery.selectOneSQL , [id], function(err , rows , fields) {
        if(err) {
            throw err;
        }
        return callback(rows[0]);
    });
};

//根据用户名查询数据
sqlFun.findOneByUserName = function (username, callback) {
    conn.conn.query(sqlQuery.selectOneByUserNameSQL , [username] , function(err , rows ,fields) {
        if(err) throw err;
        return callback(rows[0]);
    })
};


//根据id删除单个数据

sqlFun.deleteOne = function (id, callback) {
    conn.conn.query(sqlQuery.delectOneSQL , [id] ,function (err ,rows ,field) {
        if(err) {
            throw err;
        }
        return callback(rows);
    });
};

//根据id修改单个数据
sqlFun.updateOne = function (data, callback){
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.conn.query(sqlQuery.updateSQL,[data.username,data.password,data.name,data.nickname,data.personstatus,data.liveurl,dateTime,data.summary,data.poster,data.id] , function(err , rows ,fields) {
        if(err) {
            throw  err;
        }
        return callback(rows);
    });
};

//根据id修改人物状态
sqlFun.updateOnePStatus = function (id, pstatus, callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.conn.query(sqlQuery.updatePersonStatus,[pstatus, dateTime, id] , function(err , rows ,fields) {
        if(err) {
            throw  err;
        }
        return callback(rows);
    });
};
//根据id和用户名修改密码
sqlFun.updatePass = function (password, username, id, callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.conn.query(sqlQuery.updatePassSQL,[password,dateTime,username,id] , function(err , rows , filed){
        if(err) {
            throw err;
        }
        return callback(rows);
    })
};
//根据id和用户名，修改个人信息
sqlFun.updateMsg = function (nickname, poster, username, id, callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.conn.query(sqlQuery.updateMsgSQL , [poster , nickname , dateTime , username , id], function(err,rows,field) {
        if(err) throw err;
        return callback(rows);
    })
};
//根据id修改审核信息
sqlFun.updateUpgrade = function (personstatus, liveurl, poster, upgrade, id, callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.conn.query(sqlQuery.updateUpgradeSQL,[personstatus,liveurl,poster,upgrade,dateTime,id] , function(err , rows ,field) {
        if (err) throw err;

        return callback(rows.affectedRows);
    })
};



//验证登录
sqlFun.login = function (username, password, callback) {
    conn.conn.query(sqlQuery.loginSQL,[username , password] , function (err , rows ,fields) {
        if(err) {
            throw err;
        }
        return callback(rows);
    })
};


module.exports = sqlFun;
