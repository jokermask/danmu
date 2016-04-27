var express = require('express');
var router = express.Router();
var User = require('../model/user') ;



/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

/* Post listing*/
router.post('/login',function(req,res){
  console.log(req.body) ;
  User.findUser(req.body,function(err,user){
    var data = {} ;
    console.log(user) ;
    if(user){
      data.code = 0 ;
      data.nickname = user.nickname ;
      data.username = user.username ;
      req.session.username = user.username ;
      req.session.nickname = user.nickname ;
      data.iconpath = user.icon_path ;
      res.send(data) ;
    }else{
      data.code = 1 ;
      res.send(data) ;
    }
  });
});
//判断用户的状态
router.post('/isLog',function(req,res){
  if(req.session.username){
    return res.send({userstate:1}) ;
  }else{
    return res.send({userstate:0}) ;
  }
});

router.post('/logout',function(req,res){
  req.session.username = null ;
  req.session.nickname = null ;
  res.send({code:0}) ;
});

router.post('/register', function (req,res) {
  User.findUser({username:req.body.username},function(err,user){
    var data = {} ;
    //如果为空则返回空集合
    if(user){
      data.code = 1 ;
      data.err = "账户已存在" ;
      return res.send(data) ;
    }
    else{
      User.addUser(req.body,function(err,user){
        if (err) {
          data.code = 1 ;
          data.err = "注册失败" ;
          return res.send(data) ;
        }else{
          data.code = 0 ;
          req.session.username = user.username ;
          req.session.nickname = user.nickname ;
          return res.send(data) ;
        }
      });
    }
  });
}) ;

module.exports = router;
