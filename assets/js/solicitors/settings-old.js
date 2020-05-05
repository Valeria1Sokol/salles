$(document).ready(function() {
	
	$.ajax({
		url: "/service/solicitor/v1/get-membership",
		type: "GET",
		dataType: "JSON",
		success: function (json) {
        	console.log(json["membership"]);
        	if(json["membership"] == "RLEADER") {
        		$("#membership-line-1").text("You're a Review Leader");
        	}
        	else if(json["membership"] == "RMANAGER") {
        		$("#membership-line-1").text("You're a Review Manager");
        	}
        	else if(json["membership"] == "RPLUS") {
        		$("#membership-line-1").text("You have Review+ Membership");
        	}
        	else if(json["membership"] == "BASIC") {
        		$("#membership-line-1").text("You have Basic Membership");
        		$("#inner-membership-div").toggle();
        		$("#membership-image-div").toggle();
        	}
        	else {
        		console.log("Unidentified membership, please update");
        	}
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
        	console.log(textStatus + ', ' + errorThrown);
        }
	
	});
	
	$(window).scroll(function() {
		if(($(document).height() - $(window).height() - $(window).scrollTop()) <= 250) {
			$("#settings-buttons").css('position', 'absolute');
		}
		else if(($(document).height() - $(window).height() - $(window).scrollTop()) >= 250) {
			$("#settings-buttons").css('position', 'fixed');
			
		}
	});
	
	$("#update-settings").click(function () {
		var primaryId = $(".primary-id").attr("id");
		var primaryName = $("#primaryName").val();
		var primaryPhone = $("#primaryPhone").val();
		var primaryEmail = $("#primaryEmail").val();
		
		var secondaryIds = [];
		var secondaryNames = [];
		var secondaryEmails = [];
		
		$(".secondaryName").each(function() {
			secondaryNames.push($(this).val());
		});
		
		$(".secondaryEmail").each(function() {
			secondaryEmails.push($(this).val());
		});
		
		$('.secondary-ids').each(function() {
			secondaryIds.push($(this).attr("id"));
		});
		
		$.ajax({
			url: "/solicitor/settings/save",
			traditional: true,
			type: "GET",
			data: {primaryId:primaryId, primaryName:primaryName, primaryPhone:primaryPhone, primaryEmail:primaryEmail, secondaryIds:secondaryIds, secondaryNames:secondaryNames, secondaryEmails:secondaryEmails},
			success:function() {
				console.log("yay");
				window.location.reload(false);
			}
		});
		
	});
	
});