
$.fn.extend({
		//---元素拖动插件
    dragging:function(data){
		var $this = $(this);
		var xPage;
		var yPage;
		var X;//
		var Y;//
		var xRand = 0;//
		var yRand = 0;//
		var father = $this.parent();
		var defaults = {
			hander:1
		}
		var opt = $.extend({},defaults,data);
		
		var hander = opt.hander;
			var initVol = opt.vol ;
		
		if(hander == 1){
			hander = $this; 
		}else{
			hander = $this.find(opt.hander);
		}
		var video = document.getElementById("video");
			
		//---初始化
		father.css({"position":"relative"});
		$this.css({"position":"absolute"});
		hander.css({"cursor":"pointer"});

		var faWidth = father.width();
		var faHeight = father.height();
		var thisWidth = $this.width()+parseInt($this.css('padding-left'))+parseInt($this.css('padding-right'));
		var thisHeight = $this.height()+parseInt($this.css('padding-top'))+parseInt($this.css('padding-bottom'));
			console.log(initVol) ;
			console.log(initVol*100+"%") ;
			$this.css({"left":initVol*100+"%"});
		
		var mDown = false;//
		var positionX;
		var positionY;
		var moveX ;
		var moveY ;
		
		hander.mousedown(function(e){
			father.children().css({"zIndex":"0"});
			$this.css({"zIndex":"1"});
			mDown = true;
			X = e.pageX;
			Y = e.pageY;
			positionX = $this.position().left;
			positionY = $this.position().top;
			return false;
		});
			
		$(document).mouseup(function(e){
			mDown = false;
		});
			
		$(document).mousemove(function(e){
			xPage = e.pageX;//--
			moveX = positionX+xPage-X;
			
			yPage = e.pageY;//--
			moveY = positionY+yPage-Y;
			
			function thisXMove(){ //x轴移动
				if(mDown == true){
					if(moveX < 0){
						moveX = 0;
					}
					if(moveX > (faWidth-thisWidth)){
						moveX = faWidth-thisWidth ;
					}
					$('.volume-icon').removeClass('volume-off') ;
					$('.volume-icon').addClass('volume-on') ;
					video.volume = moveX/(faWidth-thisWidth)  ;
					$this.css({"left":moveX});
				}else{
					return;
				}
				return moveX;
			}

			thisXMove();
		});
    }
}); 