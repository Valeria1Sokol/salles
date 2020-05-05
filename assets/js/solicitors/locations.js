$(document).ready (function() {
	
	$(".panel-body-locations").hover(function (e) {
		$(this).closest(".panel-success").find(".panel-heading").css("background", "#00c65f");
	});
	
	$(".panel-body-locations").mouseleave(function () {
		$(this).closest(".panel-success").find(".panel-heading").css("background", "#00af54");
	});
	
	$(".panel-heading").hover(function(e) {
		$(this).css("background", "#00c65f");
	});
	
	$(".panel-heading").mouseleave(function() {
		$(this).css("background", "#00af54");
	});
	
	$(".panel-body-locations, .panel-heading").click(function(e) {
		 
		if(!$(e.target).hasClass("fa-times")) {
			var latitude = $(this).closest(".panel-success").find(".map-container-lat").text();
			var longitude = $(this).closest(".panel-success").find(".map-container-lng").text();
			
			console.log("latitude: " + latitude);
			console.log("longitude: " + longitude);
				
			$("#location-map-div").empty();
			$("#location-map-div").html('<div class="col-md-12 content-defaultdiv"><iframe id="location-map" style="width:100%;" height="500" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+latitude+','+longitude+'&hl=es;z=14&amp;output=embed"></iframe><br /></div>');
			
			$('html, body').animate({
				scrollTop: $("#location-map").offset().top - 130
			}, 600, "swing");
		}
		else {
			$("#dim").fadeToggle();
			$(".dim-wrapper").fadeToggle();
			var branchId = $(this).closest(".panel-success").attr("id");
			console.log(branchId);
			$("#locationId").val(branchId);
		}

	});
	
	$("#confirm-delete-location").click(function() {
		
		$("#dim-replace").toggle();
		
		$("#dim-content").clone(true, true).appendTo("#buffer");
		
		$(".dim-wrapper").toggle();
		$(".dim-wrapper").empty();
		$("#dim-replace").clone(true, true).appendTo(".dim-wrapper");
		$(".dim-wrapper").toggle();
		
		$("#dim-replace").toggle();
		
		var locationId = $(".dim-wrapper").attr("id");
		
		//$('#remove-location-form').submit()
		
		//$(document.body).append($("#remove-location-form"));
		
		//$.ajax("/solicitor/remove-location", {
			
		//	type: "POST",
		//	data: locationId,
		//	success: function() {
		//	},
		//	error: function() {
		//	}
		//	
		//});
		
		
		//$(".dim-content").html("");
		
	});
	
	$("#dont-delete-location").click(function() {
		$("#dim").fadeToggle();
		$(".dim-wrapper").fadeToggle();
		
	});
	
	//$(document).click(function(e) {
	//	if($("#dim").css("display") == "block") {
	//		if(!$(event.target).closest("#dim-wrapper")) {
	//			$("#dim").fadeToggle();
	//			$(".dim-wrapper").fadeToggle();
	//		}
	//	}
	//});
	
	$("#confirm-seen").click(function() {
		$("#dim").fadeToggle();
		$(".dim-wrapper").toggle();
		
		$(".dim-wrapper").empty();
		
		$("#buffer").children().clone(true, true).appendTo(".dim-wrapper");
		$("#buffer").empty();
		
	});	
	
	function getCSRFTokenValue() {
		var csrf = $('input[name=_csrf]').val();
		return csrf;
	}
	
	$("#remove-location-form").on("submit", function() {
		
		var locationId = $("#locationId").val();
		
		$.ajax({
			url: "/solicitor/remove-location",
			type: "POST",
			data: {locationId: locationId, _csrf: getCSRFTokenValue()},
			success: function(json){
			}
		})
		return false;
		
	});
	
	$.ajax({
		url: "/service/solicitor/v1/location-default-map",
		type: "GET",
		datatype: "JSON",
		success: function(json) {
			console.log(json);
			var centreLongitude = json["centreLongitude"];
			var centreLatitude = json["centreLatitude"];
			var longitudes = json["longitudes"];
			var latitudes = json["latitudes"];
			var locationNames = json["locationNames"];
			var towns = json["towns"];
			var firstAddresses = json["firstAddresses"];
			
			var map = new google.maps.Map(document.getElementById("location-map"), {
				zoom: 8,
				center: new google.maps.LatLng(centreLatitude, centreLongitude)
			});
			
			var infoWindow = new google.maps.InfoWindow();
			
			var marker;
			var i;
			
			for(i = 0; i < latitudes.length; i++) {
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(latitudes[i], longitudes[i]),
					map: map
				});
				google.maps.event.addListener(marker, 'click', (function(marker, i) {
					return function() {
						infoWindow.setContent(locationNames[i] + " </br> " + towns[i] + " </br> " + firstAddresses[i]);
						infoWindow.open(map, marker);
					}
				})(marker, i));
			}
			
			
		},
		error: function (xmlHttpRequest, textStatus, errorThrown) {	        
        	console.log(textStatus + ', ' + errorThrown);
        }
	});
	
});