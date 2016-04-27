
$(function () {
  init() ;
});

function init(){
  initSocket() ;
  initVideo() ;
  initClick() ;
  initDanmu() ;
}
//全局变量
var danmuContainer ;
var secondTimer;//计时器，播放记录秒数
var socket ;//通信socket
var roomId = $("#video").data('id') ;//房间ID，即视频ID
var author_username = $("#video").data('author') ;
//init socket
function initSocket(){
  socket = io.connect("http://localhost:3000",['websocket']) ;
  //加入自己所在视频的聊天房间
  socket.emit('joinRoom',roomId) ;

  socket.on('connect', function () {

    socket.on('message',function(danmuData){
      //如果播放时间之差小于2秒才添加弹幕
      if(Math.abs(danmuData.play_time-secondTimer)<2){
        danmuContainer.addDanmu(danmuData);
        addNewMessage(danmuData) ;
      }
    });

    socket.on('disconnect',function(){
        console.log("disconnect") ;
    })
  });
}

//向组件添加即时信息
function addNewMessage(data){
  var myDate = new Date() ;
  var hours = myDate.getHours() ;
  var minutes = myDate.getMinutes() ;
  if(minutes<10){
    minutes = "0"+minutes ;
  }
  var time_now = "("+hours + ":" + minutes +")";
  var li = $("<li></li>") ;
  var p = $("<p><b class='messages-author'>"+time_now+data.nickname+"： </b>"+data.content+"</p>") ;
  li.append(p) ;
  $(".messages-list").append(li) ;
  $(".messages-box-content").scrollTop($(".messages-list")[0].scrollHeight) ;
}

//初始化视频
function initVideo(){
  var video = document.getElementById("video");
  var videoControls = $("#videoControls");
  var videoContainer = $("#video-container");
  var controls = $("#video_controls");
  var playBtn = $("#playBtn");
  var progressWrap = $("#progressWrap");
  var playProgress = $("#playProgress");
  var playarrow = $('#playBtn span') ;
  //var fullScreenFlag = false;
  var progressFlag;//记录播放进度
  var danmuFlag; //抽取弹幕
  var isDanmuOn = 1 ;//标记弹幕的开和关
  //初始化音量控制
  initVolControl() ;

  var videoPlayer = {
    init: function(){
      video.removeAttribute("controls");
      video.onended = function() {
        playarrow.removeClass('playing') ;
        playarrow.addClass('stop');
      };
      video.addEventListener('canplaythrough',function(){
        $('#loading-icon').hide() ;
        videoPlayer.initControls();
      });
      secondTimer = 0 ;
      //弹幕颜色置为白色
      document.getElementById('danmuColor').value = "#ffffff" ;
    },
    initControls: function(){
      playBtn.unbind().click(play);
      progressWrap.unbind().mousedown(videoSeek);
    }
  }

  videoPlayer.init();

  // 控制video的播放
  function play(){
    if ( video.paused || video.ended ){
      if ( video.ended ){
        video.currentTime = 0;
        secondTimer = 0 ;
      }
      video.play();
      playarrow.removeClass('stop') ;
      playarrow.addClass('playing');
      progressFlag = setInterval(getProgress, 60);
      if(isDanmuOn) {
        danmuFlag = setInterval(loadDanmu, 1000);
      }
    }
    else{
      video.pause();
      playarrow.removeClass('playing') ;
      playarrow.addClass('stop');
      clearInterval(progressFlag);
      clearInterval(danmuFlag) ;
    }
  }
  // video的播放条
  function getProgress(){
    var percent = video.currentTime / video.duration;
    playProgress.width(percent * (progressWrap[0].offsetWidth) - 2 + "px");
  }
  //load弹幕
  function loadDanmu(){
    danmuContainer.getCurDanmu(secondTimer) ;
    secondTimer++ ;
  }
  // 鼠标在播放条上点击时进行捕获并进行处理
  function videoSeek(e){
    if(video.paused || video.ended){
      play();
      enhanceVideoSeek(e);
    }
    else{
      enhanceVideoSeek(e);
    }
  }
  function enhanceVideoSeek(e){
    clearInterval(progressFlag);
    clearInterval(danmuFlag);
    var length = e.offsetX ;
    var percent = length / progressWrap[0].offsetWidth;
    playProgress.width(percent * (progressWrap[0].offsetWidth) - 2 + "px");
    video.currentTime = percent * video.duration;
    $('#loading-icon').show() ;
    secondTimer = Math.round(video.currentTime) ;
    progressFlag = setInterval(getProgress, 60);
    if(isDanmuOn){
      danmuFlag = setInterval(loadDanmu, 1000);
    }
  }

  function initVolControl(){
    var volBefore ;
    var $volume_icon = $('.volume-icon') ;
    var $volBar = $('.volBar') ;
    var $danmuSwitch = $('#danmuSwitch') ;

    $volBar.dragging({vol:0.9});

    $volume_icon.click(function(){
      if(video.volume!=0){
        $volume_icon.removeClass('volume-on') ;
        $volume_icon.addClass('volume-off') ;
        volBefore = video.volume ;
        video.volume = 0 ;
        $volBar.css({"left":0});
      }else{
        $volume_icon.removeClass('volume-off') ;
        $volume_icon.addClass('volume-on') ;
        video.volume = volBefore ;
        $volBar.css({"left":volBefore*100+"%"});
      }
    });

    $danmuSwitch.click(function(){
      if(isDanmuOn){
        $danmuSwitch.removeClass('danmu-on') ;
        $danmuSwitch.addClass('danmu-off') ;
        $('.single-danmu').remove() ;
        clearInterval(danmuFlag);
      }else{
        $danmuSwitch.removeClass('danmu-off') ;
        $danmuSwitch.addClass('danmu-on') ;
        danmuFlag = setInterval(loadDanmu, 1000);
      }
      isDanmuOn = isDanmuOn^1 ;
    });
  }
}
//初始化弹幕
function initDanmu() {
  var options = {
    height: 450,  //弹幕区高度
    width: 800,   //弹幕区宽度
    speed: 7000      //滚动弹幕的速度
  }
  initDanmuSeting() ;
  danmuContainer = $('.danmuContainer').danmu();
  //获取弹幕列表
  var data = { video_id:$("#video").data('id') } ;
  danmuContainer.loadDanmuList(data);
}

function initDanmuSeting(){
  $('.danmu-setting-icon').click(function(){
    $('#danmu-setting').toggle() ;
  });

  $('.setting-close').click(function(){
    $('#danmu-setting').hide() ;
  });
}
//初始化点击
function initClick() {
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

  //进入主页
  $(".user-figure").click(function(){
    window.location.href = "/personal" ;
  });

  $("#login-button").click(function(){
    var markVideo = $('#markVideo') ;
    var data = {
      username: $("#username").val(),
      password: $("#password").val()
    }
    $.post("/user/login",data,function(data){
      if(data.code==0){
        swal({title:"登录成功",type:"success"}) ;
        $(".login").hide() ;
        $(".nickname").text(data.nickname) ;
        $(".user-icon").attr("src",data.iconpath);
        $('#on-off').text("注销") ;
        $(".user-figure").show() ;
        $.post('/videoRoom/isLikeVideo',{video_id:roomId},function(res){
          if(res.isLike=="like"){
            markVideo.removeClass('like') ;
            markVideo.addClass('unlike') ;
          }else{
            markVideo.removeClass('unlike') ;
            markVideo.addClass('like') ;
          }
        });
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
  //发送弹幕
  $(".sendDanmu").click(function () {
    sendDanmu() ;
  });

  $(".danmuInput").keypress(function(e){
    if(e.which==13){
      sendDanmu() ;
    }
  })

  function sendDanmu(){
    $.post("/user/isLog",function(res){
      if(res.userstate==0){
        swal("登录之后才能发言") ;
      }else{
        var content = $(".danmuInput").val();
        if(!content){
          swal("内容不能为空") ;
          return ;
        }
        var video_id = $("#video").data('id') ;
        var danmuColor = document.getElementById('danmuColor');
        var fontSize=$('#fontSelect').val();
        var danmuType = $('#typeSelect').val();
        var danmuData = {
          video_id: video_id,
          content: content,
          color: danmuColor.value||"white",
          font_type: fontSize,
          danmu_type: danmuType,
          play_time: secondTimer,
          nickname: $(".nickname").text()
        }
        socket.emit('message',danmuData);
        addNewMessage(danmuData) ;
        danmuData.isNew = true ;
        danmuContainer.addDanmu(danmuData);
        $(".danmuInput").val("") ;
      }
    });
  }
  //返回主页
  $('#return-home').click(function(){
    window.location.href = "/" ;
  });
  //标记喜欢或解除标记
  $('#markVideo').click(function(){
    var $this =$("#markVideo") ;
    $.post("/user/isLog",function(res){
      if(res.userstate==0) {
        swal("登录之后才能标记为喜欢");
      }
      else{
        var data = {
          video_id: roomId,
          author_username: author_username
        } ;
        if($this.hasClass('like')){
          $.post('/videoRoom/addRelation',data,function(){
            $this.removeClass('like') ;
            $this.addClass('unlike') ;
          });
        }else{
          $.post('/videoRoom/removeRelation',data,function(){
            $this.removeClass('unlike') ;
            $this.addClass('like') ;
          });
        }
      }
    });
  });

}




