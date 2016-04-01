
//连接mysql数据库      ---start
var mysql = require('mysql');
var conn = mysql.createConnection({    //createPool 和 createConnection 都是用于完成数据库的连接，只是方式不一样，pool更灵活一点
    connectionLimit: 10,
    host:"qdm175441403.my3w.com",
    user:"qdm175441403",
    password:"yzb960104",
    database:"qdm175441403_db",
    port:"3306"
});

conn.connect();

//sql操作数据函数

//根据表名查询所有数据
function findAllByTable(table,callback){
    var findAllByTableSQL = 'select * from ' + table;
    conn.query(findAllByTableSQL , function(err , rows) {
       if(err) {
           throw err;
       }else {
           return callback(rows);
       }
    })
}

//根据 表名及数据id 查询数据
function findOneById(table , id , callback) {
    var findOneByIdSQL = 'select * from ' + table + ' where _id = ' +id;
    conn.query(findOneByIdSQL , function (err , rows ) {
        if(err) {
            throw err;
        }else {
            return callback(rows);
        }
    })
}

//根据 表名及数据id 更新数据
function uptOneById(table , id , resData , callback) {
    var  uptOneByIdSQL = 'update ' + table + ' set resData where _id = ' + id;
    conn.query(uptOneByIdSQL , function (err , rows) {
        if(err) {
            throw err;
        }else {
            return callback(rows);
        }
    })
}



//mysql  sql语句

//查询所有数据
var selectAllSQL = 'select * from test_movie';

//根据_id查询数据
var selectOneByIdSQL = 'select * from ?? where _id = ?';

//添加数据
var addMovieSQL = 'insert into test_movie(doctor,country,title,year,poster,language,flash,summary) values(?,?,?,?,?,?,?,?)';
var addMovieSQL_params = [];
//根据_id修改数据
var updateOneByIdSQL = 'update ?? set';

//根据_id删除数据
var delOneByIdSQL = 'delete from ?? where _id = ?';

var insertSQL = '';