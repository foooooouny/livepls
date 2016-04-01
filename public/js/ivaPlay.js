/**
 * Created by Administrator on 2016/3/16.
 */
var url = $("#ivaPlayer").attr('data-url');
var title = $("#ivaPlayer").attr('data-title');
$("#ivaPlayer").height(($("#ivaPlayer").width()) * 9 / 16);
var ivaIntance = new Iva(
    "ivaPlayer",
    {
        appkey:'Eyf9cXB3',
        video:url,
        title:title,
        autoplay:false,
        memory:false,
        live:true
    }
)
