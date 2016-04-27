(function($){

  $.fn.extend({
    danmu:function(options){
      return new danmuContainer(options) ;
    }
  });

  var defaults = {
    height: 450,  //弹幕区高度
    width: 800,   //弹幕区宽度
    zindex :100,   //弹幕区域z-index属性
    speed:7000,      //滚动弹幕的默认速度，是一条弹幕通过1000px长度所需要的时间（毫秒）
    sumTime:65535,   //弹幕流的总时间
    danmuLoop:false,   //是否循环播放弹幕
    defaultFontColor:"#FFFFFF",   //弹幕的默认颜色
    fontSizeSmall:16,     //小弹幕的字号大小
    fontSizeMedium: 20, //中号弹幕
    fontSizeBig:24,       //大弹幕的字号大小
    opacity:"0.9",          //默认弹幕透明度
    topBottonDanmuTime:6000,   // 顶部底部弹幕持续时间（毫秒）
    SubtitleProtection:false,     //是否字幕保护
    positionOptimize:false,         //是否位置优化，位置优化是指像AB站那样弹幕主要漂浮于区域上半部分
    maxCountInScreen: 40,   //屏幕上的最大的显示弹幕数目,弹幕数量过多时,优先加载最新的。
    maxCountPerSec: 10      //每分秒钟最多的弹幕数目,弹幕数量过多时,优先加载最新的。
  } ;

  var danmuContainer = function(options){

    var options = $.extend(defaults,options||{}) ;
    //弹幕列表
    var danmuList ;

    var fontSize = {
      0:options.fontSizeSmall,
      1:options.fontSizeMedium,
      2:options.fontSizeBig
    };

    this.container = $("#danmuContainer") ;
    this.container.css({
      "position": "relative",
      "width": options.width,
      "height": options.height,
      "color": options.defaultFontColor,
      "overflow": "hidden"
    }) ;
    var maxCountInScreen = options.maxCountInScreen ;
    var maxCountPerSec = options.maxCountPerSec ;
    var rowsCount = parseInt(options.height/options.fontSizeBig) ;
    var rows = [] ;//记录当前行是不是已经有弹幕
    var rowsForTop = [] ;//顶端弹幕数组
    var rowsForBottom = [];//底端弹幕数组

    //弹幕对象
    var danmuItem = function(data){

      var single_danmu = $("<span class='single-danmu'></span>") ;
      if(data.isNew){
        single_danmu.css("border","solid 1px red");
      }
      single_danmu.text(data.content) ;
      single_danmu.css({
        "position": "absolute",
        "color": data.color,
        "fontSize": fontSize[data.font_type]+"px"
      });
      return single_danmu ;
    }

    this.resetRows = function(){
      for(i=0;i<rowsCount;i++){
        rows[i] = 0 ;
      }
    }
    this.resetRowsForTop = function(){
      for(i=0;i<rowsCount;i++){
        rowsForTop[i] = 0 ;
      }
    }
    this.resetRowsForBottom = function(){
      for(i=0;i<rowsCount;i++){
        rowsForBottom[i] = 0 ;
      }
    }

    this.getEmptyRow = function(){
      for(i=0;i<rowsCount;i++){
        if(rows[i]==0)
          return i ;
      }
      return -1 ;//当前这一列满了，要重新开一列，调用resetRows
    }
    this.getEmptyRowForTop = function(){
      for(i=0;i<rowsCount;i++){
        if(rowsForTop[i]==0)
          return i ;
      }
      return -1 ;//当前这一列满了，要重新开一列，调用resetRows
    }
    this.getEmptyRowForBottom = function(){
      for(i=0;i<rowsCount;i++){
        if(rowsForBottom[i]==0)
          return i ;
      }
      return -1 ;//当前这一列满了，要重新开一列，调用resetRows
    }
    //读取弹幕列表
    this.loadDanmuList = function(req){


      $.get("/videoRoom/danmuList",req,function(res){
        danmuList = res ;
      }) ;

    };
    //获得当前播放进度下的弹幕
    this.getCurDanmu = function getCurDanmu(curTime){

      var len = danmuList.length ;

      if(len==0){
        return;
      }

      for(var i=0;i<len;i++){
        if(danmuList[i].play_time==curTime){
          this.addDanmu(danmuList[i]) ;
        }
      }
    }
    //添加一条弹幕
    this.addDanmu = function addDanmu(data){
      var danmu = new danmuItem(data) ;
      var rowIdx ;

      //给每条弹幕添加ID，为了测量它的宽度
      var tempid = parseInt(new Date().getTime()).toString() ;
      danmu.attr('id',tempid);
      this.container.append(danmu) ;

      var dur = options.width/(1000/options.speed);//弹幕播放时间 = 播放器宽 / 速度
      if(data.danmu_type=="top"){
        rowIdx = this.getEmptyRowForTop() ;
        if(rowIdx==-1){
          this.resetRowsForTop();
          rowIdx = 0 ;
        }
        rowsForTop[rowIdx] = 1 ;
        danmu.css({
          "top":rowIdx*options.fontSizeBig,
          "left":"50%",
          "margin-left":-$("#"+tempid).width()/2
        });
        setTimeout(function(){
          danmu.animate({opacity:0},1500,function(){
            $(this).remove() ;
            rowsForTop[rowIdx] = 0 ;
          });
        },3000);

      }

      if(data.danmu_type=="bottom"){
        rowIdx = this.getEmptyRowForBottom() ;
        if(rowIdx==-1){
          this.resetRowsForBottom();
          rowIdx = 0 ;
        }
        rowsForBottom[rowIdx] = 1 ;
        danmu.css({
          "bottom":rowIdx*options.fontSizeBig,
          "left":"50%",
          "margin-left":-$("#"+tempid).width()/2
        });
        setTimeout(function(){
          danmu.animate({opacity:0},1500,function(){
            $(this).remove() ;
            rowsForBottom[rowIdx] = 0 ;
          });
        },3000);
      }

      if(data.danmu_type=="normal"){
        rowIdx = this.getEmptyRow() ;
        if(rowIdx==-1){
          this.resetRows();
          rowIdx = 0 ;
        }
        rows[rowIdx] = 1 ;
        danmu.css({
          "top":rowIdx*options.fontSizeBig,
          "left":"100%"
        });
        danmu.animate({left:-$("#"+tempid).width()},dur,function(){
          $(this).remove() ;
          rows[rowIdx] = 0 ;
        });
      }

      //将弹幕传给服务器
      if(data.isNew){
        $.post("/videoRoom/addDanmu",data,function(res){
          console.log(res) ;
        });
      }
    }
  }
})(jQuery) ;
