var express = require('express');
var router = express.Router();
var Video = require('../model/video') ;
var Danmu = require('../model/danmu') ;
var Mark = require('../model/mark') ;
var User = require('../model/user') ;

/* GET home page. */
router.get('/', function(req, res, next) {

  Video.findVideo(req.query,function(err,video){
    var data = {} ;
    if(err){
      return res.send(err) ;
    }else{
      data.video = video ;

      if(req.session.username){
        data.buttontype = "注销" ;
        data.nickname = req.session.nickname ;
        data.isShow = "" ;
        var relationQuery = {
          video_id: req.query._id,
          username: req.session.username
        };
        Mark.findRelation(relationQuery,function(err,relation){
          if(err){
             console.log(err) ;
          }else{
            if(relation){
              data.isLike = "unlike"
            }else{
              data.isLike = "like"
            }

            User.getIconPath(req.session.username,function(err,path){
              if(err){
                console.log(err) ;
              }else{
                data.iconpath = path ;
                return res.render('videoRoom',data) ;
              }
            });

          }
        });
      }else{
        data.buttontype = "登录" ;
        data.nickname = "" ;
        data.isLike = "like" ;
        data.iconpath = "" ;
        data.isShow = "hide" ;
        return res.render('videoRoom',data) ;
      }
    }
  }) ;
});
//获取弹幕列表
router.get('/danmuList',function(req,res,next){

  Danmu.getDanmuList(req.query,function(err,list){
    if(err){
      return res.send(err) ;
    }else{
      return res.send(list) ;
    }
  }) ;

});
//添加弹幕
router.post('/addDanmu',function(req,res,next){

  var data = {
    content: req.body.content,
    video_id: req.body.video_id,
    replier_username: req.session.username,
    replier_nickname: req.session.nickname,
    font_type: req.body.font_type,
    danmu_type: req.body.danmu_type,
    color: req.body.color,
    play_time: req.body.play_time
  }

  Danmu.addOne(data,function(err,item){
    if(err){
      return res.send(err) ;
    }else{
      return res.send(item) ;
    }
  });

});
//标记喜欢
router.post('/addRelation',function(req,res){
  var videoQuery = {video_id:req.body.video_id} ;
  var mark = {
    username:req.session.username,
    video_id:req.body.video_id
  };
  var followerData = {
    username:req.body.author_username,
    way:"add"
  }
  var followingData = {
    username:req.session.username,
    way:"add"
  }
  Mark.addOne(mark,function(err,item){
    if(err){
      return res.send(err) ;
    }else{
      console.log(videoQuery) ;
      Video.updateFollower(videoQuery) ;
      User.updateFollwer(followerData,function(){});
      User.updateFollwing(followingData,function(){});
      return res.send(item) ;
    }
  });
});

router.post('/removeRelation',function(req,res){
  var videoQuery = req.body ;
  var mark = {
    username:req.session.username,
    video_id:req.body.video_id
  };
  var followerData = {
    username:req.body.author_username,
    way:"remove"
  }
  var followingData = {
    username:req.session.username,
    way:"remove"
  }
  Mark.remove(mark,function(err,item){
    if(err){
      return res.send(err) ;
    }else{
      Video.updateFollower(videoQuery) ;
      User.updateFollwer(followerData,function(){});
      User.updateFollwing(followingData,function(){});
      return res.send(item) ;
    }
  });
});

router.post('/isLikeVideo',function(req,res){
  var data = {} ;
  req.body.username = req.session.username ;
  Mark.findRelation(req.body,function(err,item){
    if(err){
      return res.send(err) ;
    }else{
      data.isLike = item?"like":"unlike" ;
      return res.send(data) ;
    }
  });
});

module.exports = router;

