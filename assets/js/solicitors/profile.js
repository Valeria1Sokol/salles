$(document).ready (function() {
	
	//$(window).scroll(function () {
	//	$("#profile-buttons").css("bottom", Math.max(($(window).scrollTop() + $(window).height()), $(window).height() - 250))
	//});
	
	$(window).scroll(function() {
		if(($(document).height() - $(window).height() - $(window).scrollTop()) <= 250) {
			$("#profile-buttons").css('position', 'absolute');
		}
		else if(($(document).height() - $(window).height() - $(window).scrollTop()) >= 250) {
			$("#profile-buttons").css('position', 'fixed');
		}
	});
	
	$(".delete-image").click(function() {
		$(this).closest(".image-bullet").remove();
	});
	
	$(".delete-profile-image").click(function() {
		
		$("#hide-prof-button").css("display", "block");
	});


	
});
