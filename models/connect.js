/**
 * Created by Administrator on 2016/3/22.
 */
//orm   -------    begin
var db = orm.connect('mysql://qdm175441403:yzb960104@qdm175441403.my3w.com/qdm175441403_db');

db.on('connect' , function(err,db) {
    if(err) {
        return console.error('Connection error : ' + err);
    }
    var Movie = db.define("movie", {
        _id     :Number,
        doctor  :String,
        country :String,
        title   :String,
        year    :Number,
        poster  :String,
        language:String,
        flash   :String,
        summary :String
    });
    Movie.find({id : 2},function (err , data) {
        if(err) throw err;
        console.log(data)
    })
});
//orm   -------    end