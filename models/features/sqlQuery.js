/**
 * Created by Administrator on 2016/4/12.
 */

var sqlQuery = {};

sqlQuery.selectAll = "select * from videojj_live_user";

sqlQuery.selectOneSQL = "select * from videojj_live_user where id = ?";

sqlQuery.selectOneByUserNameSQL = "select * from videojj_live_user where username = ?";

sqlQuery.delectOneSQL = "delete from videojj_live_user where id = ?";

sqlQuery.insertSQL = "insert into videojj_live_user(username,password,name,nickname,personstatus,liveurl,createdate,updatedate,summary,poster) values(?,?,?,?,?,?,?,?,?,?)";

sqlQuery.updateSQL = "update videojj_live_user set username = ? , password = ? , name = ? , nickname = ? , personstatus = ? , liveurl =? , updatedate = ? , summary = ? , poster = ? where id = ?";

sqlQuery.updatePassSQL = "update videojj_live_user set password = ? , updatedate = ? where username = ? and id = ?";

sqlQuery.updateMsgSQL = "update videojj_live_user set poster = ? , nickname = ? , updatedate = ? where username = ? and id = ?";

sqlQuery.updateUpgradeSQL = "update videojj_live_user set personstatus = ? , liveurl = ? , poster = ? , upgrade = ? , upgradedate = ? where id = ?";

sqlQuery.updatePersonStatus =  "update videojj_live_user set personstatus = ? , updatedate = ? where id = ?";

sqlQuery.loginSQL = "select * from videojj_live_user where username = ? and password = ? ";


module.exports = sqlQuery;