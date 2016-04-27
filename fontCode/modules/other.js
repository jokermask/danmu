$(function(){
  init() ;
});

function init(){
  initClick() ;
}

function initClick(){
  //返回
  $('#return').click(function(){
    window.location.href = "/" ;
  });

  //鼠标悬停显示视频简介
  var videoInfo = $(".video-info") ;

  videoInfo.hover(function(){
    var brief = $(this).next() ;
    brief.fadeIn(500) ;
  },function(){
    var brief = $(this).next() ;
    brief.fadeOut(500) ;
  });

  //访问他人空间
  $('.author').click(function () {
    var author = $(this).data("author") ;
    window.location.href ="/other?author_username="+author ;
  });
  //观看视频
  $('.play-btn').click(function () {
    var id = $(this).data("id") ;
    window.location.href ="videoRoom?_id="+id ;
  });

  $(".user-figure").click(function(){
    window.location.href = "/personal" ;
  });

}

