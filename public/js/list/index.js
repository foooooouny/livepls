/**
 * Created by Administrator on 2016/4/13.
 */
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

//同意申请
$(".checkAgree").click(function () {
    var TipId = "listTip";
    var liveurl = $.trim($("#modalLiveUrl").val());
    var checkBoolean = false;

    if(liveurl != "") {
        if (liveurl.length < 5) {
            alertMsg("直播流地址需大于5",TipId,"danger");
            checkBoolean = false;
        } else {
            checkBoolean = true;
        }
    } else {
        alertMsg("请输入liveurl",TipId,"danger");
        checkBoolean = false;
    }


    if(checkBoolean == true) {
        $.ajax({
            type:'post',
            url:"/user/upgrade/yes",
            data:$("#checkContent").serialize()
        }).done(function (data) {
            if(data.success === 1) {
                alertMsg("审核成功",TipId,"success");
                location.replace("/adminDetail/list");
            } else if (data.success === 0 ) {
                alertMsg("审核失败",TipId,"danger");
                location.replace("/adminDetail/list");
            }
        })
    }

});

//拒绝申请
$(".checkRefuse").click(function () {
    var TipId = "listTip";
    $.ajax({
        type:'post',
        url:'/user/upgrade/no',
        data:$("#checkContent").serialize()
    }).done(function (data) {
        switch (data.success) {
            case 1:
                alertMsg("拒绝成功",TipId,"success");
                location.replace("/adminDetail/list");
                break;
            case 0:
                alertMsg("操作失败",TipId,"danger");
                location.replace("/adminDetail/list");
                break;
        }
    })
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