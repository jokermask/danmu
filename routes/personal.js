var express = require('express');
var router = express.Router();
var Video = require('../model/video') ;
var Mark = require('../model/mark') ;
var User = require('../model/user') ;

router.get('/', function(req, res, next) {

  var query ;
  query = {username:req.session.username} ;
  User.findUser(query,function(err,user){
    var data = {} ;

    if(err){
      return res.send(err) ;
    }else{
      data.user = user ;
      console.log(user);
      findOwnVideo(query,function(err,videoList){
        if(err){
          console.log(err) ;
        }else{
          data.videos = videoList ;
          res.render('personal',data) ;
        }
      });
    }
  }) ;
});


//找出视频列表
function findOwnVideo(query,callback){
  Mark.findAll(query,function(err,videoSet){
    if(err){
      callback(err) ;
    }else{
      var arr = [] ;
      for(var i=0;i<videoSet.length;i++){
        arr[i] = videoSet[i].video_id ;
      }
      Video.findByArr(arr,function(err,videoList){
        if(err){
          callback(err) ;
        }else{
          callback(null,videoList)
        }
      });
    }
  }) ;
}

module.exports = router;