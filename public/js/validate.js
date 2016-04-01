/**
 * Created by Administrator on 2016/3/24.
 */
$(function(){
    $(".validatePwd").click(function(e){
        var oldPwd = $.trim($("#inputOldPassword").val);
        var newPwd = $.trim($("#inputNewPassword").val);
        var reNewPwd = $.trim($("#inputReNewPassword").val);
        var canUptPas = false;
        if(oldPwd != "" && newPwd != "" && reNewPwd != "") {
            if(oldPwd.length < 6 || newPwd.length < 6 || reNewPwd.length < 6) {
                console.log("密码长度不可以小于6位！");
                canUptPas = false
            } else if (newPwd != reNewPwd) {
                console.log("新密码与确认密码不一致！");
                canUptPas = false
            } else {
                canUptPas = true;
            }
        } else {
            canUptPas = false;
            console.log("密码不可以为空！");
        }
        if(canUptPas == true) {
            if(confirm('Update Password ?')) {
                $.ajax({
                    type:'post',
                    url:'/admin/update',
                    data:$("#updatePassForm").serialize()
                }).done(function (results) {
                    console.log(results);
                    if(results.success === 1){
                        if(confirm('update Pass success!')) {
                            location.reload();
                        }
                    } else if (results.success === 0) {
                        if(confirm('update Pass Failure!')) {
                            location.reload();
                        }
                    }
                })
            }
        }
    });

    $(".validateMsg").click(function(e){
        var poster = $.trim($("#inputPoster").val);
        var nickname = $.trim($("#inputNickName").val);
        var personstatus = $.trim($("#personstatus").val);
        var canUptMsg = false;
        if(personstatus == "主播") {
            if(poster != "" && nickname != "") {
                if(poster.length > 150 || nickname.length > 20) {
                    console.log("昵称长度范围：1~20，封面长度范围：1~150");
                    canUptMsg = false
                } else {
                    canUptMsg = true;
                }
            } else {
                canUptMsg = false;
                console.log("修改信息不可以为空！");
            }
        } else if (personstatus == "游客"){
            if(nickname != "") {
                if(nickname.length > 20) {
                    console.log("昵称长度范围：1~20");
                    canUptMsg = false
                } else {
                    canUptMsg = true;
                }
            } else {
                canUptMsg = false;
                console.log("修改信息不可以为空！");
            }
        }

        if (canUptMsg == true) {
            if(confirm('Update Message ?')) {
                $.ajax({
                    type:'post',
                    url:'/admin/update',
                    data:$("#updateMessageForm").serialize()
                }).done(function (results) {
                    if(results.success === 1){
                        if(confirm('update Msg success!')) {
                            location.reload();
                        }
                    } else if (results.success === 0) {
                        if(confirm('update Pass Failure!')) {
                            location.reload();
                        }
                    }
                })
            }
        }
    });

    $(".registered").click(function () {
        var username = $.trim($("#inputUserName").val);
        var password = $.trim($("#inputPassword").val);
        var repassword = $.trim($("#inputRePassword").val);
        var name = $.trim($("#inputName").val);
        var nickname = $.trim($("#inputNickname").val);
        var summary = $.trim($("#inputSummary").val);
        var registerBool = false;

        if( username == "" || password == "" || repassword == "" || name == "" || nickname == "" || summary == "") {
            console.log("字段不能为空");
            registerBool = false;
        } else if(username.mylen() <6 || username.mylen() > 10) {
            console.log("用户名长度为6~10");
            registerBool = false;
        } else if(password.length <6 || password.length > 20 || repassword.length <6 || repassword.length > 20) {
            console.log("密码长度为6~20");
            registerBool = false;
        } else if(name.mylen() <4 || name.mylen() > 10) {
            console.log("姓名中文长度为2~5");
            registerBool = false;
        } else if(nickname.mylen() <6 || nickname.mylen() > 20) {
            console.log("昵称中文长度为3~10");
            registerBool = false;
        } else if(password != repassword){
            console.log("两次密码不一致");
            registerBool = false;
        } else {
            registerBool = true;
        }
        if(registerBool == true) {
            console.log("条件满足了？");
            $.ajax({
                type:'post',
                url:'/admin/register',
                data:$("#register").serialize()
            }).done(function (results) {
                if(results.success === 1) {
                    if(confirm('注册成功！')) {
                        login(results.username,results.password);
                    }
                } else if (results.success === 0) {
                    if(confirm('注册失败！')) {
                        location.reload();
                    }
                }
            })
        }

    });

    function login(username,password) {
        $.ajax({
            type:'post',
            url:'/admin/login',
            data:{username:username,
                  password:password}
        }).done(function (results) {
            if(results) {
                location.replace("/");
            }
        });
    }

    //计算字符串长度，中文占用2个字符，英文占用一个字符
    String.prototype.mylen = function() {
        var len=0,i = 0;
        for (i;i<this.length;i++) {
            if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
                len += 2;
            } else {
                len ++;
            }
        }
        return len;
    };





});