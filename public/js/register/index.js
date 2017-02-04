/**
 * Created by Administrator on 2016/4/13.
 */
$(".registered").click(function (e) {
    var tipId = "registerTip";
    var username = $.trim($("#inputUserName").val());
    var password = $.trim($("#inputPassword").val());
    var repassword = $.trim($("#inputRePassword").val());
    var name = $.trim($("#inputName").val());
    var nickname = $.trim($("#inputNickname").val());
    var summary = $.trim($("#inputSummary").val());
    var registerBool = false;


    // if( username == "" || password == ""  || name == "" || nickname == "" || summary == "") {
    //     alertMsg("内容不能为空！",tipId,"danger");
    //     registerBool = false;
    // } else if(username.mylen() <6 || username.mylen() > 10) {
    //     alertMsg("用户名长度为6~10",tipId,"danger");
    //     registerBool = false;
    // } else if(!userReg.test(username)) {
    //     alertMsg("用户名只可以是英文",tipId,"danger");
    //     registerBool = false;
    // }else if(password.length <6 || password.length > 20) {
    //     alertMsg("密码长度为6~20",tipId,"danger");
    //     registerBool = false;
    // }else if(!pwdReg.test(password)){
    //     alertMsg("密码格式：6~20个字母、数字或下划线",tipId,"danger");
    //     registerBool = false;
    // } else if(password != repassword){
    //     alertMsg("两次密码不一致",tipId,"danger");
    //     registerBool = false;
    // }else if(name.mylen() <4 || name.mylen() > 10) {
    //     alertMsg("姓名中文长度为2~5",tipId,"danger");
    //     registerBool = false;
    // }else if(!nameReg.test(name)){
    //     alertMsg("姓名格式：2~5个中文",tipId,"danger");
    //     registerBool = false;
    // }else if(nickname.mylen() <6 || nickname.mylen() > 20) {
    //     alertMsg("昵称为3~10个汉字",tipId,"danger");
    //     registerBool = false;
    // }else if(!nickReg.test(nickname)){
    //     alertMsg("昵称格式：3~10个中文",tipId,"danger");
    //     registerBool = false;
    // }else {
    //     registerBool = true;
    // }

    if( username == "" || password == ""  || name == "" || nickname == "" || summary == "") {
        alertMsg("内容不能为空！",tipId,"danger");
        registerBool = false;
    } else {
        registerBool = true;
    }

    if(registerBool == true) {
        $.ajax({
            type:'post',
            url:'/adminDetail/register',
            data:$("#register").serialize()
        }).done(function (results) {
            switch (results.success) {
                case 1:
                    alertMsg("注册成功！",tipId,"success");
                    login(results.username,results.password,tipId);
                    break;
                case 0:
                    alertMsg("注册失败！",tipId,"danger");
                    break;
                case -1:
                    alertMsg("注册失败！用户名重复!",tipId,"danger");
                    break;
            }
        })
    }

});

function login(username,password,tipId) {
    $.ajax({
        type:'post',
        url:'/adminDetail/login',
        data:{username:username,
            password:password}
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