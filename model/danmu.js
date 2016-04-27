var mongoose = require('mongoose');
var Danmu = {};
//danmu schema
var DanmuSchema = mongoose.Schema({
  content: { type: String },
  video_id: { type: String },
  replier_username: { type:String },
  replier_nickname: { type:String },
  font_type: { type: Number, default: 1 },
  danmu_type: { type:String },
  color: { type:String, default:"white" },
  date: { type: Date, default: Date.now },
  play_time: { type: Number }
});

var DanmuItem = mongoose.model("DanmuItem",DanmuSchema) ;

Danmu.addOne = function(data,callback){
  var newDanmu = new DanmuItem(data) ;
  newDanmu.save(function (err, item) {
    if (err) return callback(err);
    console.log("danmu save success") ;
    callback(null,item) ;
  });
}

Danmu.getDanmuList = function(data,callback){
  DanmuItem.find(data,function (err, list) {
    if (err) return callback(err) ;
    callback(null,list) ;
  });
}

module.exports = Danmu ;