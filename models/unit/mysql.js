
db_config = {
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

module.exports = db_config;


