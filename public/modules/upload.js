define('modules/upload', function(require, exports, module) {

  /**
   * Created by 天俊sama on 2016/3/20.
   */
  $(function(){
    init() ;
  }) ;
  
  function init(){
    initClick();
  }
  
  function initClick(){
  
    $(".upload-btn").click(function() {
      var fd = new FormData();
      fd.append("av_file", document.getElementById('av_file').files[0]);
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);
      xhr.open("POST", "/upload/video");
      xhr.send(fd);
    });
  
    $("#av_file").change(function(){
      fileSelected();
    });
  }
  
  //上传文件
  function fileSelected() {
    var file = document.getElementById('av_file').files[0];
    if (file) {
      var fileSize = 0;
      if (file.size > 1024 * 1024)
        fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
      else
        fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
      document.getElementById('fileName').innerHTML = '文件名称: ' + file.name;
      document.getElementById('fileSize').innerHTML = '文件大小: ' + fileSize;
      document.getElementById('fileType').innerHTML = '文件类型: ' + file.type;
    }
  }
  
  
  function uploadProgress(evt) {
    if (evt.lengthComputable) {
      var percentComplete = Math.round(evt.loaded * 100 / evt.total);
      var wrapWidth = $('#progressWrap').width() ;
      $('#progressNumber').text(percentComplete.toString() + '%');
      $('#uploadProgress').css('width',percentComplete*wrapWidth) ;
    }
    else {
      $('#progressNumber').text('无法计算');
    }
  }
  
  function uploadComplete(evt) {
    /* 服务器端返回响应时候触发event事件*/
    console.log(evt.target.responseText);
    var obj = JSON.parse(evt.target.responseText) ;
    $("#path").val(obj.path)
  }
  
  function uploadFailed(evt) {
    console.log("There was an error attempting to media the file.");
  }
  
  function uploadCanceled(evt) {
  }
  //上传表单
  $("#fin-btn").click(function(){
    if(checkForm()){
      $("form").submit() ;
    }else{
      return ;
    }
  });
  
  $('#return-home').click(function(){
    window.location.href = "/" ;
  });
  
  function checkForm(){
    var err = $(".upload-err") ;
    console.log($("#path").val()) ;
    if(!$("#path").val()){
      err.text("视频没有正确上传") ;
      return false ;
    }
    if(!$("#video-tittle").val()){
      err.text("请给视频起给名字") ;
      return false ;
    }
    if(!$("#video-brief").val()){
      err.text("简单介绍一下你的视频哈") ;
      return false ;
    }
    return true ;
  }
  

});
