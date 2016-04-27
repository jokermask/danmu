$(function(){
  init() ;
});

function init(){
  initClick() ;
}

function initClick(){
  //鼠标悬停显示视频简介
  var videoInfo = $(".video-info") ;

  videoInfo.hover(function(){
    var brief = $(this).next() ;
    brief.fadeIn(500) ;
  },function(){
    var brief = $(this).next() ;
    brief.fadeOut(500) ;
  });
  //登录
  $('#on-off').click(function(){
    $.post("/user/isLog",function(data){
      if(data.userstate==0){
        $(".login").show() ;
      }else {
        $.post("/user/logout",function(){
          $('#on-off').text("登录");
          $(".nickname").text("");
          $(".user-figure").hide() ;
        }) ;
      }
    });
  });

  $("#login-button").click(function(){
    var data = {
      username: $("#username").val(),
      password: $("#password").val()
    }
    $.post("/user/login",data,function(data){
      if(data.code==0){
        swal({title:"登录成功",type:"success"}) ;
        $(".login").hide() ;
        $(".user-icon").attr("src",data.iconpath);
        $(".nickname").text(data.nickname) ;
        $('#on-off').text("注销") ;
        $(".user-figure").show() ;
      }else{
        $(".login-error").text("账号不存在或密码错误") ;
      }
    }) ;
  });

  $(".reg-btn").click(function(){
    window.location.href = "/user/register" ;
  });

  $("#close-btn").click(function(){
    $(".login").hide() ;
  });

  //进入个人主页
  $(".user-figure").click(function(){
    window.location.href = "/personal" ;
  });
  //上传视频
  $("#upload-video").click(function(){
    $.post("/user/isLog",function(data){
      if(data.userstate==0){
        swal("请先登录") ;
        $(".login").show() ;
      }else {
        window.location.href = "/upload" ;
      }
    });
  });
  //观看视频
  $('.play-btn').click(function () {
    var id = $(this).data("id") ;
    window.location.href ="videoRoom?_id="+id ;
  });
  //访问他人空间
  $('.author').click(function () {
    var author = $(this).data("author") ;
    window.location.href ="/other?author_username="+author ;
  });
  //分类
  $('#all').click(function(){
    $('.single-video').show() ;
  });
  $('#cartoon').click(function(){
    sortByType('cartoon') ;
  });
  $('#entertain').click(function(){
    sortByType('entertain') ;
  });
  $('#tech').click(function(){
    sortByType('tech') ;
  });
  $('#music').click(function(){
    sortByType('music') ;
  });

  function sortByType(type){
    var videos = $('.single-video') ;
    for(var i=0;i<videos.length;i++){
      var singleVideo = $(videos[i]) ;
      if(singleVideo.data('type')==type){
        singleVideo.show() ;
      }else{
        singleVideo.hide() ;
      }
    }
  }
}
