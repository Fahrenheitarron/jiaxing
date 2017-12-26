//当前页面移动完毕
	var endCurrPage = false;
	//后续页面移动完毕
	var endNextPage = false;
	//入场动画和出场动画
	var	outClass = '';
	var inClass = '';
	
	var animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ window.Modernizr.prefixed( 'animation' ) ]
	
	$(function() {
	    //保存各个View的默认class
		$(".pt-page").each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );
		//设置默认页面
		$(".pt-page").eq(0).addClass( 'pt-page-current' );
	});
	$(function() {
		var animationType = 1;
		var oviewsWrapper = $("#viewsWrapper");
		var originX;
		var $currPage;
		var $nextPage;
		var currIndex;

		var aPage = $("#viewsWrapper .pt-page");
		viewsWrapper.addEventListener("touchstart",function(e){
			
			getAnimationClass(parseInt(animationType));
			$currPage = $(".pt-page-current").eq(0);
			temp = $currPage;
			//清除原来添加的动画，层级等样式(正常动画结束时会自动清除，这样做防止用户在动画结束前就点击切换其他的)
			$(".pt-page").each( function() {
				$(this).attr( 'class', $(this).data( 'originalClassList' ) );
			});
			originX = e.touches[0].clientX;
		});

		viewsWrapper.addEventListener("touchmove",function(e){
			var screenW = document.documentElement.clientWidth;
			var toLeft = e.touches[0].clientX - originX;
			currIndex = $currPage.index();
			//下一页
			if (toLeft <= 0) {
				var nextIndex = (currIndex + 1) % aPage.length;
			    $nextPage = $(aPage[nextIndex]);
				
				var deltaX = toLeft + screenW;

				if (e.touches[0].clientX>0) {

					aPage.attr("style","");
					
					$currPage.css({
						visibility: "visible"
					});
					$nextPage.css({
						transform: "translateX(" + deltaX + "px)",
						zIndex : "1",
						visibility: "visible",
					});
				}	
			}
			// 上一页
			if (toLeft > 0) {
				var deltaX =  toLeft - screenW;
				var nextIndex = (currIndex - 1 + aPage.length) % aPage.length;
				$nextPage = $(aPage[nextIndex]);
				$currPage = $(aPage[currIndex]);
				$nextPage.addClass("pt-page-current");
				aPage.attr("style","");
				$currPage.css({
					visibility: "visible"
				});
				$nextPage.css({
					transform: "translateX(" + deltaX + "px)",
					zIndex : "1",
					visibility: "visible",
				});
			}
			//图片放大缩小

			var oImg = $nextPage.find('img');
			$currPage.find('img').attr("style","");

			oImg.css({
				// transform: "translateX(0)",
				animation: "moveFromRemainRightImg .4s linear both",
			});
		});
		viewsWrapper.addEventListener("touchend",function(e){
			//下一页
			if(!$nextPage){

				currIndex = $currPage.index();
				var nextIndex = (currIndex + 1) % aPage.length;
			    $nextPage = $(aPage[nextIndex]);
			    aPage.attr("style","");
					
				$currPage.css({
					visibility: "visible"
				});
				$nextPage.css({
					transform: "translateX(" + 300 + "px)",
					zIndex : "1",
					visibility: "visible",
				});
			}
			
			$nextPage.css({
				animation: "moveFromRemainRight .5s linear both",
			});
			
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
			$(".pt-page").each( function() {
				$(this).attr( 'class', $(this).data( 'originalClassList' ) );
			});
			$nextPage.addClass("pt-page-current");
			$nextPage.css( 'zIndex', "1");
		});
		$('#pageBack')[0].addEventListener("click",function(){
			var evt = evt || window.event; //获取event对象
			event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true); //阻止事件冒泡
		});
	});

	
	
	//所有动画都结束后
	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}	
	
	function getAnimationClass(animationType) {
		switch(animationType) {
			case 1:		
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 2:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
		}
	}