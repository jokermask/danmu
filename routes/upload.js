var express = require('express');
var router = express.Router();
var multer = require('multer') ;
var Video = require('../model/video') ;
var User = require('../model/user') ;

function setUploadPath(path) {
  var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
      cb(null, path)
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
      var fileFormat = (file.originalname).split(".");
      cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
  });
  return storage ;
}

var uploadImg = multer({
  storage: setUploadPath("public/media/img")
}) ;

var uploadVideo = multer({
  storage: setUploadPath("public/media/video")
}) ;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('uploadVideo');
});


router.post('/video',uploadVideo.single('av_file'),function(req,res,next){
  var data = {
    code:0,
    path:req.file.path
  } ;
  res.send(data) ;
});

router.post('/videoInfo',uploadImg.single('cover'),function(req,res,next){

  var data = {
    path: removePublic(req.body.path),
    video_tittle: req.body.av_name,
    author_username: req.session.username,
    author_nickname: req.session.nickname,
    type: req.body.video_type,
    brief: req.body.brief,
    cover: removePublic(req.file.path)
  }
  console.log(data) ;
  Video.addVideo(data,function(err,video){
    if(err){
      data.code = 1 ;
    }else{
      data.code = 0 ;
    }
  }) ;
  res.redirect('/') ;
}) ;

router.post('/uploadDetail',uploadImg.single('upload-icon'), function(req, res, next) {
  var file_path = req.body.oldIcon? req.body.oldIcon : removePublic(req.file.path);
  var data = {
    username: req.session.username,
    path:file_path,
    brief:req.body.personal_brief
  } ;
  User.updateDetail(data,function(result){
    res.send(data) ;
  });
});

//去掉public
function removePublic(path){
  var res = path.substring(path.indexOf("media")) ;
  return res ;
}

module.exports = router;
