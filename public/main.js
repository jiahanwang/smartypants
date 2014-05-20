$(document).ready(function(){
	
	var $button = $('button#menuButton');
	var $sideMenu = $('div#sideMenu');
	
	$button.click(function(){
		console.log($(this).data('open'));
		if($(this).data('open') === 'undefined'){
			$sideMenu.css('right', -$sideMenu.width() - 30 + 'px');
			$(this).data('open', 'closed');
		}
		if($(this).data('open') === 'opened'){
			$sideMenu.animate({
				right: -$sideMenu.width() - 30 + 'px'
			}, 400, function(){
				$button.data('open', 'closed');
			});
		}else{
			$sideMenu.animate({
				right: '0px'
			}, 400, function(){
				$button.data('open', 'opened');
			});	
		}
	});
	
	$(window).resize(function(){
		var width = $(this).width();
		if(width > 768){
			$sideMenu.css('right', '0px');
		}else{
			$sideMenu.css('right', '-500px');
		}
	});
});