var express = require('express');
var router = express.Router();
var Video = require('../model/video') ;
var Mark = require('../model/mark') ;
var User = require('../model/user') ;

router.get('/', function(req,res,next){
  var data = {} ;
  var queryVideo, queryUser ;
  if(req.query.author_username==req.session.username){
    return res.redirect('/personal') ;
  }
  queryVideo = {author_username: req.query.author_username};
  queryUser = {username: req.query.author_username};
  User.findUser(queryUser,function(err,user) {
    if(err){
      return res.send(err) ;
    }else {
      data.user = user ;
      console.log(user) ;

      Video.findVideoS(queryVideo, function (err, videoList) {
        if (err) {
          console.log(err);
        } else {
          data.videos = videoList;
          if(req.session.username) {
            data.isShow = "";
            data.nickname = req.session.nickname;
            User.getIconPath(req.session.username, function (err, path) {
              if (err) {
                console.log(err);
              } else {
                data.iconpath = path;
                res.render('other', data);
              }
            });
          }else{
            data.isShow = "hide";
            data.nickname = "";
            data.iconpath = "";
            res.render('other', data);
          }
        }
      });
    }
  });

});

module.exports = router;