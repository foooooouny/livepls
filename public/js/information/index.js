/**
 * Created by Administrator on 2016/4/13.
 */

//修改密码
$(".updatePersonPwd").click(function(e){
    var TipId = "informationTip";
    var oldPwd = $.trim($("#inputOldPassword").val());
    var newPwd = $.trim($("#inputNewPassword").val());
    var reNewPwd = $.trim($("#inputReNewPassword").val());
    var canUptPas = false;
    if(oldPwd != "" && newPwd != "" ) {
        if(oldPwd.length < 6 || newPwd.length < 6) {
            alertMsg("密码长度不可以小于6位！",TipId,"danger");
            canUptPas = false
        } else if (!pwdReg.test(oldPwd)) {
            alertMsg("密码格式：6~20个字母、数字或下划线",TipId,"danger");
            canUptPas = false;
        } else if (newPwd != reNewPwd) {
            alertMsg("新密码与确认密码不一致！",TipId,"danger");
            canUptPas = false
        } else {
            canUptPas = true;
        }
    } else {
        canUptPas = false;
        alertMsg("密码不可以为空！",TipId,"danger");
    }
    if(canUptPas == true) {
        if(confirm('Update Password ?')) {
            $.ajax({
                type:'post',
                url:'/person/update/pwd',
                data:$("#updatePassForm").serialize()
            }).done(function (results) {
                switch (results.success) {
                    case 1:
                        alertMsg("密码修改成功！",TipId,"success");
                        break;
                    case 0:
                        alertMsg("密码修改失败！",TipId,"danger");
                        break;
                }
            })
        }
    }
});


//修改信息
$(".updatePersonMsg").click(function(e){
    var TipId = "informationTip";
    var poster = $.trim($("#inputPoster").val());
    var nickname = $.trim($("#inputNickName").val());
    var personstatus = $.trim($("#personstatus").val());
    var canUptMsg = false;
    if(personstatus == "主播") {
        if(poster != "" && nickname != "") {
            if(poster.length > 150 || nickname.length > 20) {
                alertMsg("昵称长度范围：1~20，封面长度范围：1~150",TipId,"danger");
                canUptMsg = false
            } else {
                canUptMsg = true;
            }
        } else {
            canUptMsg = false;
            alertMsg("修改信息不可以为空！",TipId,"danger");
        }
    } else if (personstatus == "游客" || personstatus == "管理员"){
        if(nickname != "") {
            if(nickname.length > 20) {
                alertMsg("昵称长度范围：1~20",TipId,"danger");
                canUptMsg = false
            } else {
                canUptMsg = true;
            }
        } else {
            canUptMsg = false;
            alertMsg("修改信息不可以为空！",TipId,"danger");
        }
    }

    if (canUptMsg == true) {
        if(confirm('Update Message ?')) {
            $.ajax({
                type:'post',
                url:'/person/update/msg',
                data:$("#updateMessageForm").serialize()
            }).done(function (results) {
                console.log(results);
                switch (results.success) {
                    case 1:
                        alertMsg("信息修改成功！",TipId,"success");
                        break;
                    case 0:
                        alertMsg("信息修改失败！",TipId,"danger");
                        break;
                }
            })
        }
    }
});


//判断tab选中状态
$(".select-item").click(function(e) {
    if(!$(this).children('.list-group-item').hasClass('disabled')) {
        $(this).siblings().children('.list-group-item').removeClass('disabled');
        $(this).children('.list-group-item').addClass('disabled');
    }
});