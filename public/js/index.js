$(function(){
   // var status = user.personstatus;
    //$("#inputPersonStatus option[value='管理员']").attr("selected",true);
    $(".submitApc").click(function(e) {
        var poster = $.trim($("#apcPoster").val);
        var apcBoolean = false;
        if(poster == "") {
            console.log("请输入封面图地址");
            apcBoolean = false;
        } else {
            if(poster.length < 5) {
                console.log("封面图长度需大于5");
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
                    if(confirm("申请成功")) {
                        location.reload();
                    }
                }else if (results.success === 0) {
                    console.log("重复了");
                    if(confirm("重复申请！")) {
                        location.reload();
                    }
                } else {
                    console.log("这是啥情况！");
                }
            })
        }
    })
});