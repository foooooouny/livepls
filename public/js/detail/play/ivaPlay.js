/**
 * Created by Administrator on 2016/3/16.
 */
var url = $("#flashUrl").attr('data-url');
var title = $("#flashUrl").attr('data-title');
$("#flashcontent").height(($("#flashcontent").width()) * 9 / 16);

var params = {
    quality: "high",
    scale: "noscale",
    wmode: "window",
    allowscriptaccess: "always",
    allowFullScreen:"true",
    bgcolor: "#FFFFFF"
};
var attributes = {
    id: "flashcontent",
    name: "flashcontent"
};
//播放器代码
flashvars = {
    src:url,
    playFormat:2,
    mode:"RTMP",
    showControls:0,
    path:"http://7xroga.com1.z0.glb.clouddn.com/testFlv/player_ui.swf",  //这里是更改路径的player_ui.swf
    volume:0
};
swfobject.embedSWF("http://7xroga.com1.z0.glb.clouddn.com/testFlv/vjj-swf.swf?a="+Math.random(), "flashcontent", "820", "504", "10.0.0", "expressInstall.swf", flashvars, params, attributes);

