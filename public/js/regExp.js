/**
 * Created by Administrator on 2016/4/5.
 */
//正则表达式

//用户名正则表达式
var userReg = /^[a-zA-Z]{6,10}$/;
//中文正则表达式
var nameReg = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,5}$/;  //包含日文和韩文
var nickReg = /^[\u4E00-\u9FA5\uF900-\uFA2D]{3,10}$/;
//英文、下划线正则表达式
var pwdReg = /^[a-zA-Z0-9_]{6,20}$/;  //密码只可以包含字母数字下划线

function alertMsg(data,divId,tipStatus){
    //验证
    var Tip = "alert-" + tipStatus;


    //判断页面上是否存在提示框

    if($(".tipAlert").length > 0){
        $(".tipAlert").alert('close');
    }


    var div = document.createElement("div");

    var a = document.createElement("a");

    var span = document.createElement("span");

    div.setAttribute("class","alert videoHidden tipAlert " + Tip);

    document.getElementById(divId).appendChild(div);

    a.setAttribute("class","close");

    a.setAttribute("data-dismiss","alert");

    a.setAttribute("href","#");

    var aText=document.createTextNode("×");

    a.appendChild(aText);

    div.appendChild(a);

    var spanText = document.createTextNode(data);

    span.appendChild(spanText);

    div.appendChild(span);

    $(".tipAlert").fadeIn("slow");


}
