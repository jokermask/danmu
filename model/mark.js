var mongoose = require('mongoose');
var Mark = {};
//video schema
var MarkSchema = mongoose.Schema({
  video_id: { type:String },
  username: { type:String }
});

var MarkInfo = mongoose.model('MarkInfo',MarkSchema) ;

Mark.addOne = function(data,callback){
  var relation = new MarkInfo(data) ;
  relation.save(function (err, res) {
    if (err) return callback(err);
    console.log('add releation success'+res) ;
    callback(null,res) ;
  });
}

Mark.remove = function(data,callback){
  MarkInfo.remove(data, callback);
}

Mark.findRelation = function(query,callback){
  MarkInfo.findOne(query,function (err, relation) {
    if (err) return callback(err) ;
    callback(null,relation) ;
  });
}

Mark.findAll = function(query,callback){
  MarkInfo.find(query,function (err, res) {
    if (err) return callback(err) ;
    callback(null,res) ;
  });
}

Mark.countPro = function (data, callback) {
  MarkInfo.count(data, function(err,count){
    callback(count) ;
  });
};

module.exports = Mark ;