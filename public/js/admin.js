/**
 * Created by Administrator on 2016/3/17.
 */
$(function() {
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

        var liveurl = $.trim($("#modalLiveUrl").val())
        var checkBoolean = false;

        if(liveurl != "") {
            if (liveurl.length < 5) {
                console.log("直播流地址需大于5")
                checkBoolean = false;
            } else {
                checkBoolean = true;
            }
        } else {
            console.log("请输入liveurl");
            checkBoolean = false;
        }


        if(checkBoolean == true) {
            $.ajax({
                type:'post',
                url:"/user/upgrade/yes",
                data:$("#checkContent").serialize()
            }).done(function (data) {
                if(data.success === 1) {
                    alert("审核成功");
                    location.replace("/admin/list");
                } else if (data.success === 0 ) {
                    alert("审核失败");
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
                console.log("拒绝成功");
                location.replace("/admin/list");
            } else if (data.success === 0 ) {
                console.log("审核失败");
                location.replace("/admin/list");
            }
        })
    })


});