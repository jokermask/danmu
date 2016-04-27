var mongoose = require('mongoose');
var Mark = require('./mark') ;
var Video = {};
//video schema
var VideoSchema = mongoose.Schema({
  path: { type: String, index:true },
  video_tittle: { type:String },
  author_nickname: { type:String },
  author_username: { type:String },
  type: { type:String },
  brief: { type:String },
  cover: { type:String },
  date: { type: Date, default: Date.now },
  watch_count: { type: Number, default: 0 },
  pro_count: { type: Number, default: 0 }
});

var VideoInfo = mongoose.model('VideoInfo', VideoSchema) ;

Video.addVideo = function(data,callback){
  var newVideo = new VideoInfo(data) ;
  newVideo.save(function (err, video) {
    if (err) return callback(err);
    console.log("video save success") ;
    callback(null,video) ;
  });
}

Video.findVideo = function(data,callback){
  VideoInfo.findOne(data,function (err, video) {
    if (err) return callback(err) ;
    callback(null,video) ;
  });
}

Video.findVideoS = function(data,callback){
  VideoInfo.find(data,function (err, video) {
    if (err) return callback(err) ;
    callback(null,video) ;
  });
}

Video.getAll = function(callback){
  VideoInfo.find({},function(err,videoList){
    if(err) return callback(err) ;
    callback(null,videoList) ;
  });
}

Video.removeVideo = function(data,callback){

}

Video.updateFollower = function(data){
  Mark.countPro(data,function(res){
    VideoInfo.update({_id:data.video_id},{$set:{pro_count:res}},function(err,result){
      console.log(result) ;
    });
  }) ;
}

Video.findByArr = function(arr,callback){
  VideoInfo.find().where('_id').in(arr).exec(function(err,videoList){
    if(err){
      callback(err) ;
    }else {
      console.log("personalList：  "+videoList) ;
      callback(null,videoList) ;
    }
  });
}


module.exports = Video ;