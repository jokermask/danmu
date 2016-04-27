define('modules/personal', function(require, exports, module) {

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
    //编辑
    $("#user-edit").click(function(){
      $(".icon-area").toggle() ;
      $(".brief-area").toggle() ;
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
    //保存个人信息
    $("#upload-icon").change(function(){
      fileSelected();
    });
    $("#upload-detail-btn").click(function(){
      var fd = new FormData();
      fd.append("upload-icon", document.getElementById('upload-icon').files[0]);
      fd.append("personal_brief", $("#upload-brief").val());
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/upload/uploadDetail");
      xhr.onload = function(oEvent) {
        if (xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          $(".user-icon").attr("src",response.path) ;
          $("#personal-brief").text(response.brief) ;
          swal({title:"保存成功",type:"success"}) ;
          $(".icon-area").hide() ;
          $(".brief-area").hide() ;
        } else {
          swal({title:"保存失败",type:"error"}) ;
        }
      };
      xhr.send(fd);
    });
    //上传文件
    function fileSelected() {
      var file = document.getElementById('upload-icon').files[0];
      document.getElementById('file-name').innerHTML = '文件名称: ' + file.name;
    }
  }
  

});
