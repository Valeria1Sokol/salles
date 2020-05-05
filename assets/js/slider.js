loadScriptThen('/assets/js/ext/jquery.bxslider.min.js', function() {
	
	$('.contest-slider .slider').bxSlider({
		controls: true,
		pager:false,
		preventDefaultSwipeY: true
	});
	
	
	if($('#solicitors-pager')) {
	
		$('.solicitors-slider .slider').bxSlider({
	  		pagerCustom: '#solicitors-pager',
	  		controls:false,
	  		infiniteLoop:false,
	  		adaptiveHeight: true 
		});
		
		
		$('#solicitors-pager').bxSlider({
		  minSlides: 3,
		  maxSlides: 5,
		  slideWidth: 45,
		  slideMargin: 0,
		  pager: false,
		  controls: true, 
		  moveSlides: 1,
		  infiniteLoop: false
		});
	}
	
});