var express = require('express');
var router = express.Router();
var Video = require('../model/video') ;
var User = require('../model/user') ;

/* GET home page. */
router.get('/', function(req, res, next) {

  Video.getAll(function(err,videoList){

    console.log(videoList) ;
    if(err){
      res.send(err) ;
    }else{
      var data = {} ;
      data.videos = videoList ;
      if(req.session.username){
        data.buttontype = "注销" ;
        data.nickname = req.session.nickname ;
        data.isShow = "" ;
        User.getIconPath(req.session.username,function(err,path){
          if(err){
            console.log(err) ;
          }else{
            data.iconpath = path ;
            return res.render('index',data);
          }
        });
      }else{
        data.buttontype = "登录" ;
        data.nickname = "" ;
        data.iconpath = "" ;
        data.isShow = "hide" ;
        return res.render('index',data);
      }
    }
  }) ;

});

module.exports = router;
