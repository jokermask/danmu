var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/danmu');
var User = {};
//user schema
var UserSchema = mongoose.Schema({
  username: { type: String, index:true },
  nickname: { type:String },
  password: { type:String },
  email: { type:String},
  personal_brief: { type:String, default:"这个人很懒，没留下什么。。。" },
  icon_path: { type:String, default:"media/img/user-icon-default.jpg"  },
  danmu_count: { type: Number, default: 0 },
  follower_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 }
});

var UserInfo = mongoose.model('UserInfo', UserSchema)
//add a new user
User.addUser = function(data,callback){
  var fresher = new UserInfo(data) ;
  fresher.save(function (err, user) {
    if (err) return callback(err);
    console.log("save success") ;
    callback(null,user) ;
  });
}
//find a user
User.findUser = function(data,callback){
  UserInfo.findOne(data,function (err, user) {
    if (err) return callback(err) ;
    callback(null,user) ;
  });
}
//remove a user
User.removeUser = function(data){

}

User.getIconPath = function(username,callback){
  UserInfo.findOne({username:username},function (err, user) {
    if (err) return callback(err) ;
    callback(null,user.icon_path) ;
  });
}

User.updateDetail = function(data,callback){
  UserInfo.update({username:data.username},{$set:{icon_path:data.path,personal_brief:data.brief}},function(err,result){
    console.log("updateDetail"+result) ;
    callback(result) ;
  });
}

User.updateFollwer = function(data,callback){
  if(data.way=="add") {
    UserInfo.update({username: data.username}, {$inc: {follower_count:+1}}, function (err, result) {
      console.log("updateFollower" + result);
      callback(result);
    });
  }else{
    UserInfo.update({username: data.username}, {$inc: {follower_count:-1}}, function (err, result) {
      console.log("updateFollower" + result);
      callback(result);
    });
  }
}

User.updateFollwing = function(data,callback){
  if(data.way=="add") {
    UserInfo.update({username: data.username}, {$inc: {following_count:+1}}, function (err, result) {
      console.log("updateFollower" + result);
      callback(result);
    });
  }else{
    UserInfo.update({username: data.username}, {$inc: {following_count:-1}}, function (err, result) {
      console.log("updateFollower" + result);
      callback(result);
    });
  }
}

module.exports = User;

