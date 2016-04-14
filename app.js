/**
 * Created by Administrator on 2016/3/15.
 */
var express = require("express");

var bodyParser = require("body-parser");

var path = require('path');
var mysql = require('mysql');
var session = require("express-session");

var MySQLStore = require('express-mysql-session')(session);


//var orm = require('orm');
//var sqlQuery = require('./models/movie');

var port = process.env.PORT || 3000;

var app = express();

//连接mysql数据库      ---start
//var mysql = require('mysql');
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

//conn.end();

//连接mysql数据库      ---end
//orm   -------    begin

//var Movie;
//orm.connect('mysql://qdm175441403:yzb960104@qdm175441403.my3w.com/qdm175441403_db' , function(err,db) {
//    if(err) {
//        return console.error('Connection error : ' + err);
//    }
//    Movie = db.define("test_movie", {
//        id      :Number,
//        doctor  :String,
//        country :String,
//        title   :String,
//        year    :Number,
//        poster  :String,
//        language:String,
//        flash   :String,
//        summary :String
//    });
//
//});
//orm   -------    end


//sql语句  ----------   begin

var selectOneSQL = "select * from videojj_live_user where id = ?";

var selectOneByUserNameSQL = "select * from videojj_live_user where username = ?";

var delectOneSQL = "delete from videojj_live_user where id = ?";

var insertSQL = "insert into videojj_live_user(username,password,name,nickname,personstatus,liveurl,createdate,updatedate,summary,poster) values(?,?,?,?,?,?,?,?,?,?)";

var updateSQL = "update videojj_live_user set username = ? , password = ? , name = ? , nickname = ? , personstatus = ? , liveurl =? , updatedate = ? , summary = ? , poster = ? where id = ?";

var updatePassSQL = "update videojj_live_user set password = ? , updatedate = ? where username = ? and id = ?";

var updateMsgSQL = "update videojj_live_user set poster = ? , nickname = ? , updatedate = ? where username = ? and id = ?";

var updateUpgradeSQL = "update videojj_live_user set personstatus = ? , liveurl = ? , poster = ? , upgrade = ? , upgradedate = ? where id = ?";

var updatePersonStatus =  "update videojj_live_user set personstatus = ? , updatedate = ? where id = ?";

var loginSQL = "select * from videojj_live_user where username = ? and password = ? ";
//sql语句  -----------    end


app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));  //express.bodyParser()   应该为独立的中间件 bodyParser
app.use(express.static(path.join(__dirname , 'public')));
app.listen(port);
console.log("Server start on port " + port);

//首页
app.get('/',function(req , res) {
    findAll("videojj_live_user",function(data){
        if(req.session.myUser) {
            res.render('index',{
                title:'首页',
                users: data,
                myusername:req.session.myUser.myusername,
                mypersonstatus:req.session.myUser.personstatus,
                myupgrade:req.session.myUser.myupgrade,
                mynickname:req.session.myUser.nickname,
                myid:req.session.myUser.myid
            });
        } else {
            res.render('index',{
                title:'首页',
                users: data
            });
        }
    })
});

//主播展示页面
app.get('/user/:id',function(req , res) {
    var id = req.params.id;
    if(req.session.myUser) {
        findOne(id,function(data) {
            res.render('detail', {
                title: data.nickname + '的直播间',
                user: data,
                myusername:req.session.myUser.myusername,
                mypersonstatus:req.session.myUser.personstatus,
                myupgrade:req.session.myUser.myupgrade,
                mynickname:req.session.myUser.nickname,
                myid:req.session.myUser.myid
            });
        });
    } else {
        findOne(id,function(data) {
            res.render('detail', {
                title: data.nickname + '的直播间',
                user: data
            });
        });
    }

});
//个人信息页面
app.get('/user/my/:id' , function(req , res) {
    if(req.session.myUser) {
        var id = req.params.id;
        findOne(id, function(data) {
            res.render('information', {
                title: '个人信息页面',
                user: data,
                myusername:req.session.myUser.myusername,
                mypersonstatus:req.session.myUser.personstatus,
                myupgrade:req.session.myUser.myupgrade,
                mynickname:req.session.myUser.nickname,
                myid:req.session.myUser.myid,
                perpage:req.session.myUser.personpage
            });
        });
    } else {
        res.redirect("/login");
    }
});

//申请成为主播   0是未申请或被拒绝，1是申请中,2是申请通过
app.post('/myupgrade', function(req, res) {
    if(req.session.myUser) {
        updateUpgrade(req.session.myUser.personstatus,"",req.body.poster,1,req.session.myUser.myid , function(data) {
            if(data > 0) {
                console.log("成功修改了" + data + "条数据");
                //更新申请状态
                req.session.myUser.myupgrade = 1;
                res.json({success:data});
            } else {
                console.log("重复申请！");
                res.json({success:data});
            }
        });
    } else {
        res.redirect("/login");
    }
});

//审核通过
app.post('/user/upgrade/yes' , function(req , res) {
    if(req.body && req.session.myUser.personstatus == "管理员") {
        updateUpgrade("主播",req.body.liveurl,req.body.poster,2,req.body.id , function (data) {
            if(data > 0) {
                console.log("成功审核了" + data + "个人");
                console.log("人物状态改变(游客==》主播)");
                req.session.myUser.myupgrade = 2;
                res.json({success:data});
            } else {
                console.log("审核失败！");
                res.json({success:data});
            }
        })
    } else {
        res.redirect("/login");
    }
});

// 审核拒绝
app.post('/user/upgrade/no' , function(req , res) {
    if(req.body && req.session.myUser.personstatus == "管理员") {
        updateUpgrade("游客","",req.body.poster,0,req.body.id , function (data) {
            if(data > 0) {
                console.log("成功拒绝" + data + "个人");
                req.session.myUser.myupgrade = 0;
                res.json({success:data});
            } else {
                console.log("操作失败！");
                res.json({success:data});
            }
        })
    } else {
        res.redirect("/login");
    }
});

//审核查询页面
app.get('/checkUser/:id' , function(req , res) {
    if(req.session.myUser) {
        if(req.session.myUser.personstatus != "管理员") {
            res.redirect("/");
        } else {
            findOne(req.params.id , function(data) {
                if(data) {
                    data.createdate = data.createdate.Format("yyyy-MM-dd hh:mm:ss");
                    res.json({success:data});
                } else {
                    res.redirect("/adminDetail/list");
                }
            })
        }
    } else {
        res.redirect("/login");
    }
});
//管理员列表页面
app.get('/adminDetail/list',function(req , res) {
    if(req.session.myUser) {
        if(req.session.myUser.personstatus != "管理员") {
            res.redirect("/");
        } else {
            findAll("videojj_live_user" , function(data){
                res.render('list', {
                    title: '列表页面',
                    users: data,
                    myusername:req.session.myUser.myusername,
                    mypersonstatus:req.session.myUser.personstatus,
                    myupgrade:req.session.myUser.myupgrade,
                    mynickname:req.session.myUser.nickname,
                    myid:req.session.myUser.myid
                });
            });
        }
    } else {
        res.redirect("/login");
    }

});

//管理员添加界面
app.get('/adminDetail/user',function(req , res) {
    if(!req.session.myUser || req.session.myUser.personstatus != "管理员") {
        res.redirect("/");
    } else {
        res.render('adminDetail', {
            title: '后台管理页面',
            user: {
                id:'',
                username: '',
                password: '',
                name: '',
                nickname: '',
                personstatus: '',
                liveurl: '',
                poster: '',
                summary: ''
            },
            myusername:req.session.myUser.myusername,
            mypersonstatus:req.session.myUser.personstatus,
            myupgrade:req.session.myUser.myupgrade,
            mynickname:req.session.myUser.nickname,
            myid:req.session.myUser.myid
         });
    }
});



//进入更新数据页面  -- adminDetail
app.get('/adminDetail/update/:id' , function (req , res) {
    var id = req.params.id;
    if(isNaN(req.session.myUser.myid) || req.session.myUser.personstatus != "管理员") {
        res.redirect("/login");
    } else {
        findOne(id,function(data) {
            res.render('adminDetail',{
                title:'后台管理页面',
                user:data,
                myusername:req.session.myUser.myusername,
                mypersonstatus:req.session.myUser.personstatus,
                myupgrade:req.session.myUser.myupgrade,
                mynickname:req.session.myUser.nickname,
                myid:req.session.myUser.myid
            });
        });
    }
});
//管理员操作信息
app.post('/admin/update/data', function (req, res) {
    if(!req.session.myUser.myid){
        res.redirect("/login");
    }else {
        updateOne(req.body, function (data) {
            if(data.affectedRows > 0){
                console.log("成功修改" + data.affectedRows + "行数据");
                res.json({success:data.affectedRows});
            } else {
                console.log("修改失败");
                res.json({success:data.affectedRows});
            }
        });
    }
});

//管理员操作状态
app.post('/admin/update/pstatus', function (req, res) {
    if(!req.session.myUser.myid){
        res.redirect("/login");
    }else {
        updateOnePStatus(req.body.id, req.body.personstatus, function (data) {
            if(data.affectedRows > 0){
                console.log("成功修改状态" + data.affectedRows + "个");
                res.json({success:data.affectedRows});
            } else {
                console.log("修改状态失败");
                res.json({success:data.affectedRows});
            }
        });
    }
});

//修改个人信息  -- msg

app.post("/person/update/msg",function(req, res){
    if(req.body.id != req.session.myUser.myid){
        res.redirect("/login");
    }else{
        if(req.body.personstatus == "主播" && req.body.poster != undefined && req.body.nickname != undefined) {
            updateMsg(req.body.nickname,req.body.poster, req.session.myUser.myusername ,req.body.id,  function(data) {
                if(data.affectedRows > 0) {
                    //更新session
                    req.session.myUser.poster = req.body.poster;
                    req.session.myUser.nickname = req.body.nickname;

                    console.log("主播修改信息成功" + data.affectedRows + "条");
                    res.json({success:data.affectedRows});
                } else {
                    console.log("主播修改信息失败");
                    res.json({success:data.affectedRows});
                }
            })
        } else if(req.body.personstatus == "游客" || req.body.personstatus == "管理员" && req.body.body.nickname != undefined) {
            updateMsg(req.body.nickname,"", req.session.myUser.myusername , req.body.id, function(data) {
                if(data.affectedRows > 0) {
                    //更新session
                    req.session.myUser.nickname = req.body.nickname;
                    console.log("游客修改信息成功" + data.affectedRows + "条");
                    res.json({success:data.affectedRows});
                } else {
                    console.log("游客修改信息失败");
                    res.json({success:data.affectedRows});
                }
            })
        }
    }
});

//修改个人信息  -- pwd

app.post("/person/update/pwd",function(req, res){
    if(req.body.id != req.session.myUser.myid){
        res.redirect("/login");
    }else{
        if(req.body.oldpassword != undefined && req.body.newpassword != undefined){
            if (req.body.oldpassword == req.session.myUser.mypassword) {
                updatePass(req.body.newpassword,req.session.myUser.myusername,req.session.myUser.myid , function(data) {
                    if(data.affectedRows > 0){
                        //更新session
                        req.session.myUser.mypassword = req.body.newpassword;
                        console.log("修改密码成功" + data.affectedRows + "条数据");
                        res.json({success:data.affectedRows});
                    } else {
                        console.log("修改密码失败");
                        res.json({success:data.affectedRows});
                    }
                })
            } else {
                res.json({success:0});
            }
        }
    }
});
//删除数据
app.delete('/delete/:id' , function (req , res) {
    var id = req.params.id;
    if(req.session.myUser.personstatus == "管理员") {
        deleteOne(id , function(data) {
            if(data.affectedRows > 0){
                console.log("成功删除" + data.affectedRows + "行数据");
                res.json({success:data.affectedRows });
            }
        })
    } else {
        res.redirect("/login");
    }
});

//验证登录
app.post('/adminDetail/login' , function(req , res) {
    console.log(req.body);
        login(req.body.username , req.body.password , function(data) {
            if(data.length > 0) {
                console.log("登录成功");
                var personPage = "http://" + req.host+ "/user/" + data[0].id;
                //销毁session 只需要把值赋值为空
                req.session.myUser = {
                    myusername : data[0].username,
                    mypassword : data[0].password,
                    personpage : personPage,
                    personstatus : data[0].personstatus,
                    nickname : data[0].nickname,
                    myid : data[0].id,
                    myupgrade : data[0].upgrade,
                    imgurl : data[0].poster
                };
                //登录完成后跳转首页
                res.json({success:1});
            } else {
                console.log("登录失败");
                res.json({success:0});
            }
        })
});

//进入登录页面
app.get("/login" ,function(req , res) {
    if(req.session.myUser) {
        res.redirect("/logout");
    } else {
        res.render('login', {
            title: "登录界面",
            user: {
                username: '',
                password: ''
            }
        })
    }
});

//注销登录
app.get("/logout" , function(req ,res) {
    req.session.myUser = "";
    res.redirect("/login");
});

//进入注册页面
app.get("/register" ,function(req , res) {
    res.render('register' ,{
        title:"注册界面",
        user:{
            username:'',
            password:'',
            name:'',
            nickname:'',
            poster:'',
            summary:''
        }
    })
});

//执行注册系统
app.post("/adminDetail/register" , function (req ,res) {
    findOneByUserName(req.body.username , function(data) {
        if(data) {
            res.json({success:-1});
        } else {
            req.body.personstatus = "游客";
            addOne(req.body , function(data) {
              if(data.affectedRows > 0) {
                  console.log("注册成功，添加了" + data.affectedRows + "条数据");
                  res.json({success:data.affectedRows,username:req.body.username,password:req.body.password});
              } else {
                  console.log("注册失败");
                  res.json({success:data.affectedRows});
              }
            })
        }
    })
});



//   ----------------------------------- -  操作函数  ---------------

//根据 表名 获取所有数据
function findAll(table,callback){
    conn.query("select * from " + table , function(err , rows , fields) {
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
}

//根据id获取单个数据
function findOne(id,callback){
    conn.query(selectOneSQL , [id], function(err , rows , fields) {
        if(err) {
            throw err;
        }
        return callback(rows[0]);
    });
}

//根据用户名查询数据
function findOneByUserName(username , callback) {
    conn.query(selectOneByUserNameSQL , [username] , function(err , rows ,fields) {
        if(err) throw err;
        return callback(rows[0]);
    })
}


//根据id删除单个数据

function deleteOne(id ,callback) {
    conn.query(delectOneSQL , [id] ,function (err ,rows ,field) {
        if(err) {
            throw err;
        }
        return callback(rows);
    });
}

//根据id修改单个数据
function updateOne(data , callback){
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.query(updateSQL,[data.username,data.password,data.name,data.nickname,data.personstatus,data.liveurl,dateTime,data.summary,data.poster,data.id] , function(err , rows ,fields) {
        if(err) {
            throw  err;
        }
        return callback(rows);
    });
}

//根据id修改人物状态
function updateOnePStatus(id, pstatus, callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.query(updatePersonStatus,[pstatus, dateTime, id] , function(err , rows ,fields) {
        if(err) {
            throw  err;
        }
        return callback(rows);
    });
}
//根据id和用户名修改密码
function updatePass( password,username , id  , callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.query(updatePassSQL,[password,dateTime,username,id] , function(err , rows , filed){
        if(err) {
            throw err;
        }
        return callback(rows);
    })
}
//根据id和用户名，修改个人信息
function updateMsg(nickname,poster,username,id,callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.query(updateMsgSQL , [poster , nickname , dateTime , username , id], function(err,rows,field) {
        if(err) throw err;
        return callback(rows);
    })
}
//根据id修改审核信息
function updateUpgrade(personstatus , liveurl , poster , upgrade , id , callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            conn.query(updateUpgradeSQL,[personstatus,liveurl,poster,upgrade,dateTime,id] , function(err , rows ,field)　{
                if (err) throw err;

                return callback(rows.affectedRows);
            })
}

//添加单个数据
function addOne(data , callback) {
    var dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    conn.query(insertSQL,[data.username,data.password,data.name,data.nickname,data.personstatus,data.liveurl,dateTime,dateTime,data.summary,data.poster] , function(err , rows ,fields) {
        if(err) {
            throw err;
        }
        return callback(rows);
    });
}

//验证登录
function login(username , password , callback) {
    conn.query(loginSQL,[username , password] , function (err , rows ,fields) {
        if(err) {
            throw err;
        }
        return callback(rows);
    })
}

//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};











//app.post('/adminDetail/movie/new',function (req , res) {
//    addOne(req.body,function(data){
//        if(data.affectedRows > 0) {
//            console.log("成功添加" + data.affectedRows + "行数据");
//            res.json({success:data.affectedRows});
//            res.redirect("/movie/" + movie.id)
//        }
//    });
//});
//app.post('/adminDetail/movie/new',function(req,res){
//    var id = req.body._id;
//    var movieObj = req.body;
//    var _movie;
//    if(id !== 'undefined') {
//        findOne(id , function(err , movie) {
//            if(err) {
//                throw err;
//            }
//            _movie = _.extend(movie,movieObj);  //把movieObj对象中的值按次序插入到movie中，如果有重复则替换
//            addOne(movie , function(data) {
//                console.log("old");
//                // res.redirect("/movie/" + movie._id)
//            })
//
//        })
//    }else {
//        var movie = {
//            doctor:movieObj.doctor,
//            country:movieObj.country,
//            title:movieObj.title,
//            year:movieObj.year,
//            poster:movieObj.poster,
//            language:movieObj.language,
//            flash:movieObj.flash,
//            summary:movieObj.summary
//        };
//        addOne(movie , function(data) {
//            console.log("new");
//            // res.redirect("/movie/" + movie._id)
//        })
//    }
//
//    //addOne(req.body,function(data) {
//    //    console.log(data);
//    //});
//});

