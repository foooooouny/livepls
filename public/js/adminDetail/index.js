/**
 * Created by Administrator on 2016/4/13.
 */
var personStatus = $("#oldPersonStatus").val();
$("#selectPersonStatus").val(personStatus);


//操作信息
$(".adminDetailData").click(function() {
    var tipId = "adminDetailTip";
    var username = $.trim($("#inputUserName").val());
    var password = $.trim($("#inputPassWord").val());
    var oldPassword = $.trim($("#oldPassword").val());
    var name = $.trim($("#inputName").val());
    var nickname = $.trim($("#inputNickName").val());
    var poster = $.trim($("#inputPoster").val());
    var liveurl = $.trim($("#inputLiveUrl").val());
    var summary = $.trim($("#inputSummary").val());
    var detailBoolean = false;

    if(username == "" || name == "" || nickname == "" || poster == "" || liveurl == "" || summary == "") {
        alertMsg("内容不可以为空",tipId,"danger");
        detailBoolean = false;
    } else {
        if(password == "") {
            //把旧的password值赋给inputPassWord
            $("#inputPassWord").val(oldPassword);
        }
        detailBoolean = true;
    }

    if(detailBoolean == true) {
        $.ajax({
            type:"post",
            url:"/admin/update/data",
            data:$("#adminDetailMsgForm").serialize()
        }).done(function(results) {
            switch (results.success){
                case 1 :
                    alertMsg("信息修改成功！",tipId,"success");
                    break;
                case 0 :
                    alertMsg("信息修改失败！",tipId,"danger");
                    break;
            }
        })
    }
});

//操作人物状态
$(".adminDetailPersonStatus").click(function() {
    var tipId = "adminDetailTip";
    var oldpersonStatus = $.trim($("#oldPersonStatus").val());
    var personStatus = $.trim($("#selectPersonStatus").val());

    $.ajax({
        type:"post",
        url:"/admin/update/pstatus",
        data:$("#adminDetailPersonStatusForm").serialize()
    }).done(function(results) {
        switch (results.success){
            case 1 :
                if(oldpersonStatus == personStatus) {
                    console.log("人物状态未改变");
                    alertMsg("人物状态未改变",tipId,"success");
                }else {
                    console.log("人物状态由" + oldpersonStatus + "改变为" +personStatus);
                    alertMsg("人物状态（"+oldpersonStatus+"==>"+personStatus+"）",tipId,"success");
                }
                break;
            case 0 :
                alertMsg("人物状态修改失败！",tipId,"danger");
                break;
        }
    })

});