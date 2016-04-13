/**
 * Created by Administrator on 2016/4/13.
 */
$(".login-sub").click(function () {
    var tipId = "loginTip";
    var username = $.trim($("#inputUserName").val());
    var password = $.trim($("#inputPassword").val());
    var loginBool = false;

    if(username == "") {
        alertMsg("请输入用户名！",tipId,"danger");
        loginBool = false;
    } else if(password == "") {
        alertMsg("请输入密码！",tipId,"danger");
    } else {
        loginBool = true;
    }


    if(loginBool == true) {
        $.ajax({
            type:'post',
            url:'/adminDetail/login',
            data:$("#loginData").serialize()
        }).done(function (results) {
            switch (results.success){
                case 1 :
                    alertMsg("登录成功！",tipId,"success");
                    location.replace("/");
                    break;
                case 0 :
                    alertMsg("用户名或密码错误！",tipId,"danger");
                    break;
            }
        });
    }
});