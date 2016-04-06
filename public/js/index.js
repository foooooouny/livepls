$(function(){

    //验证
    var filedTip = "alert-danger";
    var successTip = "alert-success";
//正则表达式

//用户名正则表达式
    var userReg = /^[a-zA-Z]{6,10}$/;
//中文正则表达式
    var nameReg = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,5}$/;  //包含日文和韩文
    var nickReg = /^[\u4E00-\u9FA5\uF900-\uFA2D]{3,10}$/;
//英文、下划线正则表达式
    var pwdReg = /^[a-zA-Z0-9_]{6,20}$/;  //密码只可以包含字母数字下划线

    function alertMsg(data,tipStatus){

        //判断页面上是否存在提示框

        if($(".tipAlert").length > 0){
            $(".tipAlert").alert('close');
        }

        var div = document.createElement("div");

        var a = document.createElement("a");

        var span = document.createElement("span");

        div.setAttribute("class","alert videoHidden tipAlert " + tipStatus);

        document.getElementById("wrongMsg").appendChild(div);

        a.setAttribute("class","close");

        a.setAttribute("data-dismiss","alert");

        a.setAttribute("href","#");

        var aText=document.createTextNode("×");

        a.appendChild(aText);

        div.appendChild(a);

        var spanText = document.createTextNode(data);

        span.appendChild(spanText);

        div.appendChild(span);

        //$(".alert").fadeOut(function(){
        //    $(".alert").fadeIn("slow");
        //});

        $(".tipAlert").fadeIn("slow");


    }

   // var status = user.personstatus;
    //$("#inputPersonStatus option[value='管理员']").attr("selected",true);
    $(".submitApc").click(function(e) {
        var poster = $.trim($("#apcPoster").val());
        var apcBoolean = false;
        if(poster == "") {
            alertMsg("请输入封面图地址",filedTip);
            apcBoolean = false;
        } else {
            if(poster.length < 5) {
                alertMsg("封面图长度需大于5",filedTip);
                apcBoolean = false;
            } else {
                apcBoolean = true;
            }
        }
        if(apcBoolean == true ) {
            $.ajax({
                type:'post',
                url:'/myupgrade',
                data:$("#apcContent").serialize()
            }).done(function(results) {
                console.log(results.success);
                if(results.success === 1 ) {
                    alertMsg("申请成功",successTip);
                    location.reload();
                }else if (results.success === 0) {
                    alertMsg("重复申请！",filedTip);
                        location.reload();
                } else {
                    alertMsg("这是啥情况！",filedTip);
                }
            })
        }
    })
});