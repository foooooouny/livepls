///**
// * Created by Administrator on 2016/3/15.
// */

///   node      模块化
var jwt = require('jsonwebtoken')
var app = require('./models/connection/server');

var fun = require('./models/features/sqlFunction');

var config = require('./config')
var fs = require('fs')

//首页
app.get('/',function(req , res) {
    fun.findAll("videojj_live_user",function(data){
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

// app.get('/user/h5/:id', function (req, res) {
//     var id = req.params.id;
//     var host = req.query.host;
//     var package = req.query.package || 'liveOSPackage'
//     var env = (host === 'https://liveapi.videojj.com' ? 'prod' : 'actilive')

//     var platformId = config[env].platformId
//     var secret = config[env].secret
//     var page = fs.readFileSync('./views/pages/detail_h5.html', 'utf8')
    

//     fun.findOne(id, function (data) {
//         if (!data) return res.send('主播未找到')
//         var renderData = {
//             platformUserId: id,
//             platformId: platformId,
//             env: env,
//             url: req.path,
//             package: package
//         }
//         page = page.replace(/#{platformId}/g, renderData.platformId)
//         page = page.replace(/#{platformUserId}/g, renderData.platformUserId)
//         page = page.replace(/#{title}/g, '用户 ' + renderData.platformUserId + ' 的房间')
//         page = page.replace(/#{jsPackage}/g, renderData.package)
//         if (renderData.package === 'mangoPackage') {
//             page = page.replace(/#{mango}/g, 'active')
//         } else {
//             page = page.replace(/#{liveos}/g, 'active')
//         }
//         if (req.session.myUser) { // 登录帐号
//             Object.assign(renderData, {
//                 myusername: req.session.myUser.myusername,
//                 mypersonstatus: req.session.myUser.personstatus,
//                 myupgrade: req.session.myUser.myupgrade,
//                 mynickname: req.session.myUser.nickname,
//                 myid: req.session.myUser.myid,
//             })

//             if (req.session.myUser.myid == id || req.session.myUser.personstatus == '管理员') { // 主播的帐号 或 管理员帐号
//                 var token = jwt.sign({
//                     platformId: platformId,
//                     platformUserId: id,
//                 }, secret, {
//                     expiresIn: 60 * 60 * 24 * 7, // s
//                 })

//                 renderData.token = token
//             }

//             res.send(page)
//       } else { //游客
//         res.send(page)
//       }
//     })
// });

//主播展示页面
app.get('/user/:id',function(req , res) {
    var id = req.params.id;
    var host = req.query.host
    var env = (host === 'https://liveapi.videojj.com' ? 'prod' : 'actilive')
    var platformId = config[env].platformId
    var secret = config[env].secret
    var flashUI = config[env].flashUI
    var flashApi = config[env].flashApi
    fun.findOne(id, function(data) {
      
      if (!data) return res.send('主播未找到')
      var renderData = {
        title: data.nickname + '的直播间',
        user: data,
        platformUserId: id,
        platformId: platformId,
        flashUI: flashUI,
        flashApi: flashApi,
        env: env,
        url: req.path
      }

      if (req.session.myUser) { // 登录帐号
        Object.assign(renderData, {
          myusername:req.session.myUser.myusername,
          mypersonstatus:req.session.myUser.personstatus,
          myupgrade:req.session.myUser.myupgrade,
          mynickname:req.session.myUser.nickname,
          myid:req.session.myUser.myid,
        })

        if (req.session.myUser.myid == id || req.session.myUser.personstatus == '管理员') { // 主播的帐号 或 管理员帐号
            var token = jwt.sign({
                platformId: platformId,
                platformUserId: id,
            }, secret, {
                expiresIn: 60 * 60 * 24 * 7, // s
            })

            renderData.token = token
        }

        res.render('detail', renderData);
      } else { //游客
        res.render('detail', renderData);
      }
    })
});


//个人信息页面
app.get('/user/my/:id' , function(req , res) {
    var userId = req.params.id;
    var host = req.query.host
    var env = (host === 'https://liveapi.videojj.com' ? 'prod' : 'actilive')
    var platformId = config[env].platformId
    var secret = config[env].secret
    var cdnJS = config[env].cdnJS
    var cdnCSS = config[env].cdnCSS
    if (req.session.myUser && req.session.myUser.myid == userId) {
        var token = jwt.sign({
            platformId: platformId,
            platformUserId: userId,
        }, secret, {
            expiresIn: 60 * 60 * 24 * 7, // s
        })

        fun.findOne(userId, function(data) {
            res.render('information', {
                title: '个人信息页面',
                user: data,
                myusername:req.session.myUser.myusername,
                mypersonstatus:req.session.myUser.personstatus,
                myupgrade:req.session.myUser.myupgrade,
                mynickname:req.session.myUser.nickname,
                myid:req.session.myUser.myid,
                perpage:req.session.myUser.personpage,
                // apiHost: config.actilive.apiHost,
                platformId: platformId,
                token: token,
                cdnCSS: cdnCSS,
                cdnJS: cdnJS,
                env: env,
                url: req.path
            });
        });
    } else {
        res.redirect("/login");
    }
});

//申请成为主播   0是未申请或被拒绝，1是申请中,2是申请通过
app.post('/myupgrade', function(req, res) {
    if(req.session.myUser) {
        fun.updateUpgrade(req.session.myUser.personstatus,"",req.body.poster,1,req.session.myUser.myid , function(data) {
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
        fun.updateUpgrade("主播",req.body.liveurl,req.body.poster,2,req.body.id , function (data) {
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
        fun.updateUpgrade("游客","",req.body.poster,0,req.body.id , function (data) {
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
            fun.findOne(req.params.id , function(data) {
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
            fun.findAll("videojj_live_user" , function(data){
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
        fun.findOne(id,function(data) {
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
        fun.updateOne(req.body, function (data) {
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
        fun.updateOnePStatus(req.body.id, req.body.personstatus, function (data) {
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
            fun.updateMsg(req.body.nickname,req.body.poster, req.session.myUser.myusername ,req.body.id,  function(data) {
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
        } else if(req.body.personstatus == "游客" || req.body.personstatus == "管理员" && req.body.nickname != undefined) {
            fun.updateMsg(req.body.nickname,"", req.session.myUser.myusername , req.body.id, function(data) {
                if(data.affectedRows > 0) {
                    //更新session
                    req.session.myUser.nickname = req.body.nickname;
                    console.log("游客或管理员修改信息成功" + data.affectedRows + "条");
                    res.json({success:data.affectedRows});
                } else {
                    console.log("游客或管理员修改信息失败");
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
                fun.updatePass(req.body.newpassword,req.session.myUser.myusername,req.session.myUser.myid , function(data) {
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
        fun.deleteOne(id , function(data) {
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
    fun.login(req.body.username , req.body.password , function(data) {
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
    fun.findOneByUserName(req.body.username , function(data) {
        if(data) {
            res.json({success:-1});
        } else {
            req.body.personstatus = "游客";
            fun.addOne(req.body , function(data) {
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

// 执行切换平台
app.get('/platform_switch', function (req, res) {
    var platformId = req.query.platformId || ''
    var platformUserId = req.query.platformUserId || ''
    var secret = req.query.secret || ''
    var isPassed = (platformId && platformUserId && secret)
    var env = req.query.q || 'actilive'
    var renderData = {
        title: '切换平台',
        platformId: platformId,
        platformUserId: platformUserId,
        secret: secret,
        q: env,
        cdnJS: config[env].cdnJS,
        cdnCSS: config[env].cdnCSS,
        flashUI: config[env].flashUI,
        flashApi: config[env].flashApi
    }

    if (req.session.myUser) { // 登录帐号
        Object.assign(renderData, {
            myusername: req.session.myUser.myusername,
            mypersonstatus: req.session.myUser.personstatus,
            myupgrade: req.session.myUser.myupgrade,
            mynickname: req.session.myUser.nickname,
            myid: req.session.myUser.myid
        })
    }
    if (!req.query.force && isPassed) {
        if (env === 'prod' && !req.query.first) {
            var str = '/platform_switch?host=https://liveapi.videojj.com&first=1&platformId=' + platformId
                + '&platformUserId=' + platformUserId + '&secret=' + secret + '&q=' + env
            return res.redirect(str)
        }
        var token = jwt.sign({
            platformId: platformId,
            platformUserId: platformUserId,
        }, secret, {
            expiresIn: 60 * 60 * 24 * 7, // s
        })
        renderData.token = token
        res.render('switchPlatformDetail', renderData)
    } else {
        res.render('switchPlatform', renderData)
    }
})