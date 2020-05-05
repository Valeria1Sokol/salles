$(document).ready (function() {
	
	$("#hidden-review-breakdown-yearly").toggle();
	
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
	
	$.ajax({
		url: "/service/solicitor/v1/get-twitter-account",
		type: "GET",
		dataType: "JSON",
		success: function(json) {
			if(json["hasTwitter"] == false) {
				$(".twitter-div").html("<div class='col-md-12 col-sm-12 col-xs-12 content-defaultdiv'><div class='col-md-12'><h3 style='text-align: center;'>To view your total Twitter mentions, add a Twitter account.</h3></div><div class='col-md-12' style='text-align:center;'><form action='/solicitor/twitter/account'><button class='button-submit'>Add a Twitter Account</button></form></div></div>");
			}

		},
		error: function (xmlHttpRequest, textStatus, errorThrown) {
			console.log(textStatus + ', ' + errorThrown);
		}
	});
	
	function getDateQuery(numMonths) {
		var formatString = 'YYYY-MM-DD';
		var upper = moment().format(formatString);
		var lower = moment().subtract(numMonths, 'month').startOf('month').format(formatString);
		return 'lower='+lower+'&upper='+upper;
	}
	


	
});
