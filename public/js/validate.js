/**
 * Created by Administrator on 2016/3/24.
 */
$(function(){

    $.getScript("/js/regExp.js",function(){

        $(".validatePwd").click(function(e){
            var oldPwd = $.trim($("#inputOldPassword").val());
            var newPwd = $.trim($("#inputNewPassword").val());
            var reNewPwd = $.trim($("#inputReNewPassword").val());
            var canUptPas = false;
            if(oldPwd != "" && newPwd != "" ) {
                if(oldPwd.length < 6 || newPwd.length < 6 || reNewPwd.length < 6) {
                    alertMsg("密码长度不可以小于6位！",filedTip);
                    canUptPas = false
                } else if (pwdReg.test(oldPwd)) {
                    alertMsg("密码格式：6~20个字母、数字或下划线",filedTip);
                    canUptPas = false;
                } else if (newPwd != reNewPwd) {
                    alertMsg("新密码与确认密码不一致！",filedTip);
                    canUptPas = false
                } else {
                    canUptPas = true;
                }
            } else {
                canUptPas = false;
                alertMsg("密码不可以为空！",filedTip);
            }
            if(canUptPas == true) {
                if(confirm('Update Password ?')) {
                    $.ajax({
                        type:'post',
                        url:'/admin/update',
                        data:$("#updatePassForm").serialize()
                    }).done(function (results) {
                        if(results.success === 1){
                            alertMsg("密码修改成功！",successTip);
                        } else if (results.success === 0) {
                            alertMsg("密码修改失败！",filedTip);
                        }
                    })
                }
            }
        });

        $(".validateMsg").click(function(e){
            var poster = $.trim($("#inputPoster").val());
            var nickname = $.trim($("#inputNickName").val());
            var personstatus = $.trim($("#personstatus").val());
            var canUptMsg = false;
            if(personstatus == "主播") {
                if(poster != "" && nickname != "") {
                    if(poster.length > 150 || nickname.length > 20) {
                        alertMsg("昵称长度范围：1~20，封面长度范围：1~150",filedTip);
                        canUptMsg = false
                    } else {
                        canUptMsg = true;
                    }
                } else {
                    canUptMsg = false;
                    alertMsg("修改信息不可以为空！",filedTip);
                }
            } else if (personstatus == "游客"){
                if(nickname != "") {
                    if(nickname.length > 20) {
                        alertMsg("昵称长度范围：1~20",filedTip);
                        canUptMsg = false
                    } else {
                        canUptMsg = true;
                    }
                } else {
                    canUptMsg = false;
                    alertMsg("修改信息不可以为空！",filedTip);
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
                            alertMsg("修改密码成功！",successTip);
                        } else if (results.success === 0) {
                            alertMsg("修改密码失败！",filedTip);
                        }
                    })
                }
            }
        });
        $(".registered").click(function () {
            var username = $.trim($("#inputUserName").val());
            var password = $.trim($("#inputPassword").val());
            var repassword = $.trim($("#inputRePassword").val());
            var name = $.trim($("#inputName").val());
            var nickname = $.trim($("#inputNickname").val());
            var summary = $.trim($("#inputSummary").val());
            var registerBool = false;


            if( username == "" || password == ""  || name == "" || nickname == "" || summary == "") {
                alertMsg("内容不能为空！",filedTip);
                registerBool = false;
            } else if(username.mylen() <6 || username.mylen() > 10) {
                alertMsg("用户名长度为6~10",filedTip);
                registerBool = false;
            } else if(!userReg.test(username)) {
                alertMsg("用户名只可以是英文",filedTip);
                registerBool = false;
            }else if(password.length <6 || password.length > 20) {
                alertMsg("密码长度为6~20",filedTip);
                registerBool = false;
            }else if(!pwdReg.test(password)){
                alertMsg("密码格式：6~20个字母、数字或下划线",filedTip);
                registerBool = false;
            } else if(password != repassword){
                alertMsg("两次密码不一致",filedTip);
                registerBool = false;
            }else if(name.mylen() <4 || name.mylen() > 10) {
                alertMsg("姓名中文长度为2~5",filedTip);
                registerBool = false;
            }else if(!nameReg.test(name)){
                alertMsg("姓名格式：2~5个中文",filedTip);
                registerBool = false;
            }else if(nickname.mylen() <6 || nickname.mylen() > 20) {
                alertMsg("昵称为3~10个汉字",filedTip);
                registerBool = false;
            }else if(!nickReg.test(nickname)){
                alertMsg("昵称格式：3~10个中文",filedTip);
                registerBool = false;
            }else {
                registerBool = true;
            }
            if(registerBool == true) {
                $.ajax({
                    type:'post',
                    url:'/admin/register',
                    data:$("#register").serialize()
                }).done(function (results) {
                    if(results.success === 1) {
                        alertMsg("注册成功！",successTip);
                        login(results.username,results.password);
                    } else if (results.success === 0) {
                        alertMsg("注册失败！",filedTip);
                    }
                })
            }

        });

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