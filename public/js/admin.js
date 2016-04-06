/**
 * Created by Administrator on 2016/3/17.
 */
$(function() {

    //验证
    var filedTip = "alert-danger";
    var successTip = "alert-success";
//正则表达式

//用户名正则表达式
    var userReg = /^[a-zA-Z]{6,10}$/;
//中文正则表达式
    var nameReg = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,5}$/;  
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


    $(".del").click(function(e){
        if(confirm('delete it ?')) {
            var target = $(e.target);
            var id = target.data("id");
            var tr = $('.item-id-' + id);

            $.ajax({
                type:'delete',
                url:'/delete/' + id
            }).done(function (results) {
                if(results.success === 1){
                    if(tr.length > 0) {
                        tr.remove();
                    }
                }
            })
        }
    });

    //审核模块
    $(".list-check").click(function(e){
        var target = $(e.target);
        var id = target.data("id");
        $.ajax({
            type:"get",
            url:"/checkUser/" + id
        }).done(function (data) {
            if(data.success) {
                user = data.success;
                $("#modalId").val(user.id);
                $("#modalPoster").val(user.poster);
                $("#modalPersonStatus").val(user.personstatus);
                $("#modalUserName").html(user.username);
                $("#modalNickName").html(user.nickname);
                $("#modalCreateAt").html(user.createdate);
                $("#modalPersonstatus").html(user.personstatus);
                $("#checkModal").modal();
            }
        });

    });

    //同意申请
    $(".checkAgree").click(function () {

        var liveurl = $.trim($("#modalLiveUrl").val());
        var checkBoolean = false;

        if(liveurl != "") {
            if (liveurl.length < 5) {
                alertMsg("直播流地址需大于5",filedTip);
                checkBoolean = false;
            } else {
                checkBoolean = true;
            }
        } else {
            alertMsg("请输入liveurl",filedTip);
            checkBoolean = false;
        }


        if(checkBoolean == true) {
            $.ajax({
                type:'post',
                url:"/user/upgrade/yes",
                data:$("#checkContent").serialize()
            }).done(function (data) {
                if(data.success === 1) {
                    alertMsg("审核成功",successTip);
                    location.replace("/admin/list");
                } else if (data.success === 0 ) {
                    alertMsg("审核失败",filedTip);
                    location.replace("/admin/list");
                }
            })
        }

    });

    //拒绝申请
    $(".checkRefuse").click(function () {
        $.ajax({
            type:'post',
            url:'/user/upgrade/no',
            data:$("#checkContent").serialize()
        }).done(function (data) {
            if(data.success === 1) {
                alertMsg("拒绝成功",successTip);
                location.replace("/admin/list");
            } else if (data.success === 0 ) {
                alertMsg("操作失败",filedTip);
                location.replace("/admin/list");
            }
        })
    })


});