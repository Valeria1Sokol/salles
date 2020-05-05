
var firstYearlyChart;
var secondYearlyChart;
var thirdYearlyChart;

loadScriptThen('/assets/js/Chart.bundle.js', function() {
	
//	if($('#chartMonthlyReview').length > 0) {
//		$.ajax({
//	        url: "/service/solicitor/v1/monthly-review-count",
//	        type: 'GET',
//	        dataType: 'json',
//	        success: function (json) {
//	        	console.log(json);
//	        	createChartFromJson("#chartMonthlyReview", json);
//	        },
//	        error: function (xmlHttpRequest, textStatus, errorThrown) {
//	        	console.log(textStatus + ', ' + errorThrown);
//	        }
//	    });
//	}
	
	if($('#chartDailyReview').length > 0) {
		$.ajax({
	        url: "/service/v1/daily-review-count",
	        type: 'GET',
	        dataType: 'json',
	        success: function (json) {
	        	createChartFromJson("#chartDailyReview", json);
	        },
	        error: function (xmlHttpRequest, textStatus, errorThrown) {
	        	console.log(textStatus + ', ' + errorThrown);
	        }
	    });
	}
	
	if($('#profileViewChart').length > 0) {
		$.ajax({
	        url: "/service/solicitor/v1/monthly-profile-view",
	        type: 'GET',
	        dataType: 'json',
	        success: function (json) {
	        	createChartFromJson("#profileViewChart", json);
	        },
	        error: function (xmlHttpRequest, textStatus, errorThrown) {	        
	        	console.log(textStatus + ', ' + errorThrown);
	        }
	    });
	}

	if($('#searchAppearanceChart').length > 0) {
		$.ajax({
	        url: "/service/solicitor/v1/monthly-search-appearance",
	        type: 'GET',
	        dataType: 'json',
	        success: function (json) {
	        	createChartFromJson("#searchAppearanceChart", json);
	        },
	        error: function (xmlHttpRequest, textStatus, errorThrown) {	        
	        	console.log(textStatus + ', ' + errorThrown);
	        }
	    });
	}	
	
	
});

loadScriptThen('/assets/js/Chart.bundle.js', function() {
	
	if($('#myChart').length > 0) {
		$.ajax({
	        url: "/service/solicitor/v1/monthly-review-count",
	        type: 'GET',
	        dataType: 'json',
	        success: function (json) {
	        	createBarChartFromJson("#myChart", json);
	        },
	        error: function (xmlHttpRequest, textStatus, errorThrown) {	        
	        	console.log(textStatus + ', ' + errorThrown);
	        }
	    });
	}
	if($('#myChart1').length > 0) {
		$.ajax({
	        url: "/service/v1/areas-of-law",
	        type: 'GET',
	        dataType: 'json',
	        success: function (json) {
	        	createBarChartFromJson("#myChart1", json);
	        },
	        error: function (xmlHttpRequest, textStatus, errorThrown) {	        
	        	console.log(textStatus + ', ' + errorThrown);
	        }
	    });
	}
	
});

$(function() {
	
	function displayYearlyChart(url, prefix, isNew, type) {

		if($("#"+prefix+"-hidden-canvas").is(":hidden")) {
			$("#"+prefix+"-hidden-canvas").toggle();
			$("#"+prefix+"-hidden-chart").find("#review-breakdown-yearly-div").remove();
		}
		
		if(prefix == "first") {
    		if (typeof firstYearlyChart != 'undefined') {
        		firstYearlyChart.destroy();
        	}
    		if(isNew) {
    			$('html, body').animate({
    				scrollTop: $("#first-hidden-chart").offset().top - 150
    			}, 600, "swing");
    		}
    	}
    	else if (prefix == "second") {
    		if (typeof secondYearlyChart != 'undefined') {
        		secondYearlyChart.destroy();
        	}
    		if(isNew) {
        		$('html, body').animate({
    				scrollTop: $("#second-hidden-chart").offset().top - 150
    			}, 600, "swing");
    		}
    	}
    	else if (prefix == "third") {
    		if (typeof thirdYearlyChart != 'undefined') {
        		thirdYearlyChart.destroy();
        	}
    		if(isNew) {
        		$('html, body').animate({
    				scrollTop: $("#third-hidden-chart").offset().top - 150
    			}, 600, "swing");
    		}
    	}
		
		$.ajax({
	        url: url,
	        type: 'GET',
	        dataType: 'json',
	        success: function (json) {
	        	createYearlyViewBarChartFromJson("#"+prefix+"-hidden-canvas", json, prefix, type);
	        },
	        error: function (xmlHttpRequest, textStatus, errorThrown) {
	        	console.log(textStatus + ', ' + errorThrown);
	        }
	    });
	}
	
	$('#new-reviews-yearly').click(function() {

		if($("#first-hidden-chart").css('display') == 'none') {
			$("#first-hidden-chart").toggle();
			var lastClass = $("#first-hidden-chart").attr("class").split(" ").pop();
			if(lastClass != "col-md-12") {
				$("#first-hidden-chart").removeClass(lastClass);
			}
			
			$("#first-hidden-chart").addClass("new-reviews-yearly");
			
			displayYearlyChart("/service/solicitor/v1/monthly-review-count", "first", true, "new-reviews");
			
		}
		else {
			var lastClass = $("#first-hidden-chart").attr("class").split(" ").pop();
			if(lastClass == "new-reviews-yearly") {
				$("#first-hidden-chart").toggle();
				$("#first-hidden-chart").removeClass(lastClass);
				
				if (typeof firstYearlyChart != 'undefined') {
	        		firstYearlyChart.destroy();
	        	}
			}
			else if(lastClass = "col-md-12"){
				$("#first-hidden-chart").addClass("new-reviews-yearly");
				displayYearlyChart("/service/solicitor/v1/monthly-review-count", "first", false, "new-reviews");
			}
			else {
				$("first-hidden-chart").removeClass(lastClass);
				$("#first-hidden-chart").addClass("requests-sent-yearly");
				displayYearlyChart("/service/solicitor/v1/monthly-review-count", "first", false, "new-reviews");
			}
		}
		
	});
	
	$('#helpful-reviews-yearly').click(function() {
		
		if($("#second-hidden-chart").css('display') == 'none') {
			$("#second-hidden-chart").toggle();
			var lastClass = $("#second-hidden-chart").attr("class").split(" ").pop();
			if(lastClass != "col-md-12") {
				$("#second-hidden-chart").removeClass(lastClass);
			}
			
			$("#second-hidden-chart").addClass("helpful-reviews-yearly");
			
			displayYearlyChart("/service/solicitor/v1/helpful-reviews-yearly", "second", true, "helpful-reviews");
		}
		else {
			var lastClass = $("#second-hidden-chart").attr("class").split(" ").pop();
			if(lastClass == "helpful-reviews-yearly") {
				$("#second-hidden-chart").toggle();
				$("#second-hidden-chart").removeClass(lastClass);
				
				if (typeof secondYearlyChart != 'undefined') {
					secondYearlyChart.destroy();
	        	}
			}
			else if(lastClass == "col-md-12"){
				$("#second-hidden-chart").addClass("helpful-reviews-yearly");
				displayYearlyChart("/service/solicitor/v1/helpful-reviews-yearly", "second", false, "helpful-reviews");
			}
			else {
				$("#second-hidden-chart").removeClass(lastClass);
				$("#second-hidden-chart").addClass("helpful-reviews-yearly");
				displayYearlyChart("/service/solicitor/v1/helpful-reviews-yearly", "second", false, "helpful-reviews");
			}
		}
	});
	
	$('#review-breakdown-yearly').click(function() {
		
		if($("#first-hidden-chart").css('display') == 'none') {
			$("#first-hidden-chart").toggle();
			var lastClass = $("#first-hidden-chart").attr("class").split(" ").pop();
			if(lastClass != "col-md-12") {
				$("#first-hidden-chart").removeClass(lastClass);
			}
			
			$("#first-hidden-chart").addClass("review-breakdown-yearly");
			
			var target = $("#hidden-review-breakdown-yearly").find("#review-breakdown-yearly-div");
			
			$("#first-hidden-chart").append(target.clone());
			$("#first-hidden-canvas").toggle();
			
			$('html, body').animate({
				scrollTop: $("#first-hidden-chart").offset().top - 150
			}, 600, "swing");
			
		}
		else {
			var lastClass = $("#first-hidden-chart").attr("class").split(" ").pop();
			if(lastClass == "review-breakdown-yearly") {
				$("#first-hidden-chart").toggle();
				$("#first-hidden-chart").removeClass(lastClass);
				$("#first-hidden-chart").find("#review-breakdown-yearly-div").remove();
				$("#first-hidden-canvas").toggle();
			}
			else if(lastClass == "col-md-12"){
				$("#first-hidden-chart").addClass("review-breakdown-yearly");
				var target = $("#hidden-review-breakdown-yearly").find("#review-breakdown-yearly-div");
				
				$("#first-hidden-chart").append(target.clone());
				$("#first-hidden-canvas").toggle();

			}
			else {
				$("#first-hidden-chart").removeClass(lastClass);
				$("#first-hidden-chart").addClass("review-breakdown-yearly");
				var target = $("#hidden-review-breakdown-yearly").find("#review-breakdown-yearly-div");
				
				if (typeof firstYearlyChart != 'undefined') {
					firstYearlyChart.destroy();
	        	}
				
				$("#first-hidden-chart").append(target.clone());
				$("#first-hidden-canvas").toggle();

			}
		}
	});
	
	$('#reviews-responded-yearly').click(function() {
		if($("#first-hidden-chart").css('display') == 'none') {
			$("#first-hidden-chart").toggle();
			var lastClass = $("#first-hidden-chart").attr("class").split(" ").pop();
			if(lastClass != "col-md-12") {
				$("#first-hidden-chart").removeClass(lastClass);
			}
			
			$("#first-hidden-chart").addClass("reviews-responded-yearly");
			
			displayYearlyChart("/service/solicitor/v1/reviews-responded-to-yearly", "first", true, "reviews-responded");
			
		}
		else {
			var lastClass = $("#first-hidden-chart").attr("class").split(" ").pop();
			if(lastClass == "reviews-responded-yearly") {
				$("#first-hidden-chart").toggle();
				$("#first-hidden-chart").removeClass(lastClass);
				
				if (typeof firstYearlyChart != 'undefined') {
					firstYearlyChart.destroy();
	        	}
				
			}
			else if(lastClass == "col-md-12") {
				$("#second-hidden-chart").addClass("reviews-responded-yearly");
				displayYearlyChart("/service/solicitor/v1/reviews-responded-to-yearly", "first", false, "reviews-responded");
			}
			else {
				$("#first-hidden-chart").removeClass(lastClass);
				$("#first-hidden-chart").addClass("reviews-responded-yearly");
				displayYearlyChart("/service/solicitor/v1/reviews-responded-to-yearly", "first", false, "reviews-responded");
			}
		}
	});
	
	$('#client-exposure-yearly').click(function() {
		if($("#second-hidden-chart").css('display') == 'none') {
			$("#second-hidden-chart").toggle();
			var lastClass = $("#second-hidden-chart").attr("class").split(" ").pop();
			if(lastClass != "col-md-12") {
				$("#second-hidden-chart").removeClass(lastClass);
			}
			
			$("#second-hidden-chart").addClass("client-exposure-yearly");
			
			displayYearlyChart("/service/solicitor/v1/get-client-exposure", "second", true, "client-exposure");
			
		}
		else {
			var lastClass = $("#second-hidden-chart").attr("class").split(" ").pop();
			if(lastClass == "client-exposure-yearly") {
				$("#second-hidden-chart").toggle();
				$("#second-hidden-chart").removeClass(lastClass);
				
				if (typeof secondYearlyChart != 'undefined') {
	        		secondYearlyChart.destroy();
	        	}
				
			}
			else if(lastClass == "col-md-12") {
				$("#second-hidden-chart").addClass("client-exposure-yearly");
				displayYearlyChart("/service/solicitor/v1/get-client-exposure", "second", false, "client-exposure");
			}
			else {
				$("#second-hidden-chart").removeClass(lastClass);
				$("#second-hidden-chart").addClass("client-exposure-yearly");
				displayYearlyChart("/service/solicitor/v1/get-client-exposure", "second", false, "client-exposure");
			}
		}
	});
	
	$('#profile-clicks-yearly').click(function () {
		if($("#second-hidden-chart").css('display') == 'none') {
			$("#second-hidden-chart").toggle();
			var lastClass = $("#second-hidden-chart").attr("class").split(" ").pop();
			if(lastClass != "col-md-12") {
				$("#second-hidden-chart").removeClass(lastClass);
			}
			
			$("#second-hidden-chart").addClass("profile-clicks-yearly");
			
			displayYearlyChart("/service/solicitor/v1/get-profile-clicks", "second", true, "profile-clicks");
			
		}
		else {
			var lastClass = $("#second-hidden-chart").attr("class").split(" ").pop();
			if(lastClass == "profile-clicks-yearly") {
				$("#second-hidden-chart").toggle();
				$("#second-hidden-chart").removeClass(lastClass);
				
				if (typeof secondYearlyChart != 'undefined') {
	        		secondYearlyChart.destroy();
	        	}
				
			}
			else if(lastClass == "col-md-12") {
				$("#second-hidden-chart").addClass("profile-clicks-yearly");
				displayYearlyChart("/service/solicitor/v1/get-profile-clicks", "second", false, "profile-clicks");
			}
			else {
				$("#second-hidden-chart").removeClass(lastClass);
				$("#second-hidden-chart").addClass("profile-clicks-yearly");
				displayYearlyChart("/service/solicitor/v1/get-profile-clicks", "second", false, "profile-clicks");
			}
		}
	});
	
	$('#twitter-mentions-yearly').click(function() {
		if($("#third-hidden-chart").css('display') == 'none') {
			$("#third-hidden-chart").toggle();
			var lastClass = $("#third-hidden-chart").attr("class").split(" ").pop();
			if(lastClass != "col-md-12") {
				$("#third-hidden-chart").removeClass(lastClass);
			}
			
			$("#third-hidden-chart").addClass("profile-clicks-yearly");
			
			displayYearlyChart("/service/solicitor/v1/get-tweets", "third", true, "twitter");
			
		}
		else {
			var lastClass = $("#third-hidden-chart").attr("class").split(" ").pop();
			if(lastClass == "profile-clicks-yearly") {
				$("#third-hidden-chart").toggle();
				$("#third-hidden-chart").removeClass(lastClass);
				
				if (typeof thirdYearlyChart != 'undefined') {
	        		thirdYearlyChart.destroy();
	        	}
				
			}
			else if(lastClass == "col-md-12") {
				$("#third-hidden-chart").addClass("profile-clicks-yearly");
				displayYearlyChart("/service/solicitor/v1/get-tweets", "third", false, "twitter");
			}
			else {
				$("#third-hidden-chart").removeClass(lastClass);
				$("#third-hidden-chart").addClass("profile-clicks-yearly");
				displayYearlyChart("/service/solicitor/v1/get-tweets", "third", false, "twitter");
			}
		}
	});
	
	$('#btn-reset-graph').click(function () {
		filterChart(null);
	});
	
	$('#from-date').keyup(function() {
		$(".graph-error-message").hide();
	});
	
	$('#btn-update-graph').click(function() {
		
		var fromDate = +new Date($("#from-date").val());
		var dFromDate = new Date($("#from-date").val());
		
		
		if(fromDate > 0 && !isNaN(fromDate)) {
			filterChart(fromDate);
		}
		else {
			$(".graph-error-message").show();
		}
		
	});
	
	$('#btnExcellent, #btnGood, #btnAverage, #btnPoor, #btnAwful, #btnResponded').click(function(e) {
		
		var fromDate = +new Date($('#from-date').val());
		
		filterChart(fromDate);
		
	});

    $('#rvAreaOfLaw, #rvLocation, #rvTeams').change(function(e) {
        var fromDate = +new Date($('#from-date').val());

        filterChart(fromDate);
    });
	
	$(document).ready(function() {
		var path = window.location.pathname;
		var page = path.split('/').filter(function(el){return!!el;}).pop();
		
		if(page == "solicitor") {
			createNewReviews();
			createReviewsRespondedTo();
			createReviewBreakdown();
			createTwitterMentions();
			createHelpfulReviews();
			createProfileClicks();
			createClientExposure();
			
		}
		else if(page == "reviews") {
			filterChart(null);
		}
	});
	
});

function createClientExposure () {
	$.ajax({
		url: "/service/solicitor/v1/get-client-exposure",
		type: "GET",
		dataType: "json",
		success: function (json) {
			var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			
			var d = new Date();
			var n = d.getMonth();
			var lastMonth = n - 1;
			var twoMonthsAgo = n - 2;
			
			if(lastMonth < 0) {
				lastMonth += 12;
			}
			if(twoMonthsAgo < 0) {
				twoMonthsAgo += 12;
			}
			
			var jsonLastTwoMonths = {};
			//var jsonLastTwoMonths = {(months[twoMonthsAgo]):json[months[twoMonthsAgo]], (months[lastMonth]):json[months[lastMonth]]};
			jsonLastTwoMonths[months[twoMonthsAgo]] = json[months[twoMonthsAgo]];
			jsonLastTwoMonths[months[lastMonth]] = json[months[lastMonth]];
			
			createBarChartFromJsonDashboard("#clientExposureChart", jsonLastTwoMonths);
		}
	});
}

function createProfileClicks() {
	$.ajax({
		url: "/service/solicitor/v1/get-profile-clicks",
		type: "GET",
		dataType: "json",
		success: function (json) {
			var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			
			var d = new Date();
			var n = d.getMonth();
			var lastMonth = n - 1;
			var twoMonthsAgo = n - 2;
			
			if(lastMonth < 0) {
				lastMonth += 12;
			}
			if(twoMonthsAgo < 0) {
				twoMonthsAgo += 12;
			}
			
			var jsonLastTwoMonths = {};
			//var jsonLastTwoMonths = {(months[twoMonthsAgo]):json[months[twoMonthsAgo]], (months[lastMonth]):json[months[lastMonth]]};
			jsonLastTwoMonths[months[twoMonthsAgo]] = json[months[twoMonthsAgo]];
			jsonLastTwoMonths[months[lastMonth]] = json[months[lastMonth]];
			
			createBarChartFromJsonDashboard("#profileClicksChart", jsonLastTwoMonths);
		}
	});
}

//this entire function is hugely overcomplicated in hindsight but works
function interpretReviewBreakdown(json) {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	var filledIn = []
	
	var orderedMonths = [];
	
	var d = new Date();
	var currentMonth = d.getMonth();
	var count = 0;
	for(var i = currentMonth; i < 12; i++) {
		orderedMonths.push(i);
		count += 1;
	}
	for(var i = 0; i < 12 - count; i++) {
		orderedMonths.push(i);
	}
	
	orderedMonths.reverse();
	
	for (var key in json) {
		
		var rounded = false;
    	
    	var amount = json[key];
    	if(amount > 999) {
    		var amount = Math.round((number / 1000) * 10) / 10;
    		rounded = true;
    	}
    	
    	var month = key.split(":")[0];
    	var rating = key.split(":")[1];
    	if(rounded) {
    		$("."+rating+"-star-month-"+month).text(amount + "K");
    	}
    	else {
    		$("."+rating+"-star-month-"+month).text(amount);
    	}
    	
    	//$(".month-"+month).text(months[month]);
    	filledIn.push([month, rating]);
	}

	var stringifiedFilledIn = JSON.stringify(filledIn);

	for(var j = 1; j < 13; j++) {
		for(var k = 1; k < 6; k++ ) {
			var toCheckExistence = JSON.stringify([j.toString(), k.toString()]);
			
			if(stringifiedFilledIn.indexOf(toCheckExistence) == -1) {
				$("."+k+"-star-month-"+j).text(0);
			}
		}
	}
	for(var i = 0; i < orderedMonths.length; i++) {
		$(".month-"+(i + 1)).text(months[orderedMonths[i]]);
	}
	
};

function processTwitterMentions(json) {
	
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var count = 0;
	var prevMonthCount = 1;
	var increase;
	
	var orderedMonths = [];
	
	var d = new Date();
	var currentMonth = d.getMonth();
	var count = 0;
	for(var i = currentMonth; i < 12; i++) {
		orderedMonths.push(months[i]);
		count += 1;
	}
	for(var i = 0; i < 12 - count; i++) {
		orderedMonths.push(months[i]);
	}
	
	orderedMonths.reverse();
	
	for(var i = 0; i < 12; i++) {
		$(".twitter-"+(i+1)).text(orderedMonths[i] + ": " + json[orderedMonths[i]]);
	}
	
	if(count == 0) {
		for(var i = 1; i < 13; i++) {
			$(".twitter"+i).text("None");
		}
	}

	var oneMonthAgo = currentMonth - 1;
	if(oneMonthAgo < 0) {
		oneMonthAgo += 12;
	}
	var twoMonthsAgo = currentMonth - 2;
	if(twoMonthsAgo < 0) {
		twoMonthsAgo += 12;
	}
	var threeMonthsAgo = currentMonth - 3;
	if(threeMonthsAgo < 0) {
		threeMonthsAgo += 12;
	}
	
	
	
	
	var firstPercentage = Math.round(((json[months[oneMonthAgo]] / json[months[twoMonthsAgo]]) * 100 - 100) * 10) / 10;
	var secondPercentage = Math.round(((json[months[twoMonthsAgo]] / json[months[threeMonthsAgo]]) * 100 - 100) * 10) / 10;
	var prefix = "";
	if(json[months[oneMonthAgo]] > json[months[twoMonthsAgo]]) {
		prefix = "+"
	}
	
	
	if(isNaN(firstPercentage)) {
		$(".twitter-1-increase").text("N/A");
	} else if (firstPercentage == 'Infinity') {
		$(".twitter-1-increase").text("+100%");
	} else {
		$(".twitter-1-increase").text(prefix + firstPercentage + "%");
	}
	
	prefix = "";
	if(json[months[twoMonthsAgo]] > json[months[threeMonthsAgo]]) {
		prefix = "+"
	}
	if(isNaN(secondPercentage)) {
		$(".twitter-2-increase").text("N/A");
	} else if (secondPercentage == 'Infinity') {
		$(".twitter-2-increase").text("+100%");
	} else {
		$(".twitter-2-increase").text(prefix + secondPercentage + "%");
	}
	
	
}

function createHelpfulReviews() {
	$.ajax({
		url: "/service/solicitor/v1/helpful-reviews-yearly",
		type: "GET",
		dataType: "json",
		success: function (json) {
			var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			
			var d = new Date();
			var n = d.getMonth();
			var lastMonth = n - 1;
			var twoMonthsAgo = n - 2;
			
			if(lastMonth < 0) {
				lastMonth += 12;
			}
			if(twoMonthsAgo < 0) {
				twoMonthsAgo += 12;
			}
			
			var jsonLastTwoMonths = {};
			//var jsonLastTwoMonths = {(months[twoMonthsAgo]):json[months[twoMonthsAgo]], (months[lastMonth]):json[months[lastMonth]]};
			jsonLastTwoMonths[months[twoMonthsAgo]] = json[months[twoMonthsAgo]];
			jsonLastTwoMonths[months[lastMonth]] = json[months[lastMonth]];
			
			createBarChartFromJsonDashboard("#helpfulReviewsChart", jsonLastTwoMonths);
		}
	});
}

function createTwitterMentions() {
	$.ajax({
		url: "/service/solicitor/v1/get-tweets",
		type: "GET",
		dataType: "json",
		success: function (json) {
			processTwitterMentions(json);
		}
	});
}

function createReviewsRespondedTo() {
	$.ajax({
		url: "/service/solicitor/v1/dashboard-reviews-responded-to",
		type: "GET",
		dataType: "json",
		success: function (json) {
			createBarChartFromJsonDashboard("#reviewsRespondedToChart", json);
		}
	});
}

function createReviewBreakdown () {
	$.ajax({
        url: "/service/solicitor/v1/review-breakdown-yearly",
        type: 'GET',
        dataType: 'json',
        success: function (json) {
        	interpretReviewBreakdown(json);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
        	
        }
    });
}

function createNewReviews() {
	$.ajax({
		url: "/service/solicitor/v1/dashboard-new-reviews",
		type: "GET",
		dataType: "json",
		success: function (json) {
			createBarChartFromJsonDashboard("#newReviewsChart", json);
		}
	});
}

function filterChart(fromDate) {
	
	var showExcellent = true;
	var showGood = true;
	var showAverage = true;
	var showPoor = true;
	var showAwful = true;
	var excludeResponded = false;
	var areaOfLaw = '';
	var location = '';
    var solicitor = '';
    var team = '';

	if (!$('#btnExcellent').hasClass("green-background")) {
		showExcellent = false;
	}
	
	if (!$('#btnGood').hasClass("green-background")) {
		showGood = false;
	}
	
	if (!$('#btnAverage').hasClass("green-background")) {
		showAverage = false;
	}
	
	if (!$('#btnPoor').hasClass("green-background")) {
		showPoor = false;
	}
	
	if (!$('#btnAwful').hasClass("green-background")) {
		showAwful = false;
	}
	if ($('#btnResponded').hasClass("green-background")) {
		excludeResponded = true;
	}

    areaOfLaw = $('#rvAreaOfLaw').val();
    location = $('#rvLocation').val();
    solicitor = $('#selected-solicitor').val();
    team = $('#rvTeams').val();
	
	if(fromDate < 0 || isNaN(fromDate) || fromDate == null) {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear() - 1;
		if(dd < 10) {
			dd = '0'+dd;
		}
		if(mm < 10) {
			mm = '0'+mm;
		}
		today = mm + '/' + dd + '/' + yyyy;
		var timestamp = new Date(today).getTime() / 1000;
		$.ajax({
	        url: "/service/solicitor/v1/filtered-monthly-review-count",
	        type: 'GET',
	        dataType: 'json',
	        data: { longTimestamp:timestamp, showExcellent:showExcellent, showGood:showGood, showAverage:showAverage, showPoor:showPoor, showAwful:showAwful, excludeResponded:excludeResponded, specifiedDate:false, areaOfLaw:areaOfLaw, location:location, solicitorId:solicitor, team:team },
	        success: function (json) {
	        	if (typeof window.myLine != 'undefined') {
	        		window.myLine.destroy();
	        	}
	        	
	        	//$('#chartMonthlyReview').remove();
	    		//$('#chartMonthlyReviewDiv').append('<canvas id="chartMonthlyReview"></canvas>');
	        	createChartFromJson("#chartMonthlyReview", json);
	        },
	        error: function (xmlHttpRequest, textStatus, errorThrown) {
	        	console.log(textStatus + ', ' + errorThrown);
	        }
	    });
	}
	
	else if(fromDate > 0) {
		fromDate = fromDate / 1000;
		$.ajax({
	        url: "/service/solicitor/v1/filtered-monthly-review-count",
	        type: 'GET',
	        dataType: 'json',
	        data: { longTimestamp:fromDate, showExcellent:showExcellent, showGood:showGood, showAverage:showAverage, showPoor:showPoor, showAwful:showAwful, excludeResponded:excludeResponded, specifiedDate:true, areaOfLaw:areaOfLaw, location:location, solicitorId:solicitor, team:team },
	        success: function (json) {
	        	if (typeof window.myLine != 'undefined') {
	        		window.myLine.destroy();
	        	}
	        	createChartFromJson("#chartMonthlyReview", json);
	        },
	        error: function (xmlHttpRequest, textStatus, errorThrown) {
	        	console.log(textStatus + ', ' + errorThrown);
	        }
	    });
	}
	
	else {
		$(".graph-error-message").show();
	}
	
	
}

var generatePollData = function(pollUrl) {
	$.ajax({
        url: pollUrl,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
        	
        	createBarChartFromJson("#poll-results", json);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
        	console.log(textStatus + ', ' + errorThrown);
        }
    });
}


var createChartFromJson = function(chartId,json) {
var config = {
            type: 'line',
            data: {
            	labels:[], //'5','10','15','20'
                datasets: [{
                    label: "",
                    data: [], //'8','20','25','12'
                    fill: false,
                    borderColor: '#000000',
                    backgroundColor: '#00AF54'
                }]
            },
            options: {
                responsive: true,
                aspectRatio: 1.6,
                maintainAspectRatio: true,
                title:{
                    display:false,
                    text:'New Reviews'
                },
                scales: {
                	labels: [{
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Month'
                        }
                    }],
                
                	yAxes: [{
                		ticks: {
                			beginAtZero: true,
                			userCallback: function(label, index, labels) {
                				if(Math.floor(label) === label) {
                					return label;
                				}
                			}
                		}
                	}]
                
                }
            }
        }
    
	    for (var key in json) {
	    	config.data.labels.push(key);
	    	config.data.datasets[0].data.push(json[key]);
		};

		
			var ctx = $(chartId).get(0).getContext("2d");            
            window.myLine = new Chart(ctx, config);
};


var createBarChartFromJson = function(chartId,json) {
	var chart = {
	    type: 'bar',
	    data: {
	        labels: [],
	        datasets: [{
	            label: [""],
	            backgroundColor: '#1c7b42',
	            borderColor: '#1c7b42',
	            data: [],
	            //0,88
	        }]
	    },
	    options: {
	        tooltips: {
	            enabled: true,            
	        },
	        animation: {
	            duration: 0,
	            onComplete: function() {
	                   var ctx = this.chart.ctx;
	                   ctx.font = Chart.helpers.fontString(18, 'normal', Chart.defaults.global.defaultFontFamily);
	                   ctx.fillStyle = this.chart.config.options.defaultFontColor;
	                   ctx.textAlign = 'center';
	                   ctx.textBaseline = 'bottom';
	                   ctx.fillStyle = '#fff';
	            }
	        },
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true
	                    
	                },
	                stacked: true,
	                
	            }],
	            xAxes: [{
	                ticks: {
	                    beginAtZero: true
	                    
	                },
	                stacked: true,
	            }]
	        }
	    }
	 }
	
	 	for (var key in json) {
	 		chart.data.labels.push(key);
	 		chart.data.datasets[0].data.push(json[key]);
		};
		
		
		var ctx = $(chartId).get(0).getContext("2d");
        window.myLine = new Chart(ctx, chart);
};

var createYearlyViewBarChartFromJson = function(chartId,json,prefix,type) {

	var title = "";
	
	if(type == "twitter") {
		title = "Total Twitter Mentions";
	}
	else if (type == "helpful-reviews") {
		title = "Helpful Reviews";
	}
	else if(type == "new-reviews") {
		title = "New Reviews";
	}
	else if(type == "reviews-responded") {
		title = "Reviews Responded To";
	}
	else if(type == "client-exposure") {
		title = "Exposure to New Clients";
	}
	else if(type == "profile-clicks") {
		title = "Clicks on Your Profile";
	}
	
	var chart = {
	    type: 'bar',
	    data: {
	        labels: [],
	        datasets: [{
	            label: [""],
	            backgroundColor: '#1c7b42',
	            data: [],
	            //0,88
	        }]
	    },
	    options: {
	    	maintainAspectRatio: false,
	    
	        tooltips: {
	            enabled: true,            
	        },
	        animation: {
	            duration: 1000,
	            onComplete: function() {
	                    var ctx = this.chart.ctx;
	                    ctx.font = Chart.helpers.fontString(18, 'normal', Chart.defaults.global.defaultFontFamily);
	                    ctx.fillStyle = this.chart.config.options.defaultFontColor;
	                    ctx.textAlign = 'center';
	                    ctx.textBaseline = 'bottom';
	                    ctx.fillStyle = '#fff';
	                    
	                   
	                    
	            }
	        },
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true
	                    
	                },
	                stacked: true,
	                
	            }],
	            xAxes: [{
	                ticks: {
	                    beginAtZero: true
	                    
	                },
	                stacked: true,
	            }]
	        },
	        title: {
	        	display: true,
	        	text: title,
	        	fontFamily: "Lato"
	        }
	    }
	 }
	
	 	for (var key in json) {
	 		chart.data.labels.push(key);
	 		chart.data.datasets[0].data.push(json[key]);
		};
		
		var dataset = chart.data.datasets[0];
		if(type == "twitter") {
			dataset.backgroundColor = '#01a6e9';
		}
		
		
		
		var ctxYearly = $(chartId).get(0).getContext("2d");
		ctxYearly.height = 200;
		if(prefix == "first") {
			firstYearlyChart = new Chart(ctxYearly, chart);
		}
		else if (prefix == "second") {
			secondYearlyChart = new Chart(ctxYearly, chart);
		}
		else if(prefix == "third") {
			thirdYearlyChart = new Chart(ctxYearly, chart);
		}
};

var createBarChartFromJsonDashboard = function(chartId,json) {
	
	var keys = Object.keys(json);
	
	var chart = {
	    type: 'bar',
	    data: {
	        labels: [],
	        datasets: [{
	            label: [""],
	            backgroundColor: [
					'#29b561',
					'#19703c',
					'#d3d3d3'
				],
	            
	            data: [],
	        }]
	    },
	    options: {
	        tooltips: {
	            enabled: true,            
	        },
	        animation: {
	            duration: 0,
	            easing: "easeOutQuart",
	            onComplete: function() {
	                if (this.data.datasets.length === 3) {
	                    var ctx = this.chart.ctx;
	                    ctx.font = Chart.helpers.fontString(18, 'normal', Chart.defaults.global.defaultFontFamily);
	                    ctx.fillStyle = this.chart.config.options.defaultFontColor;
	                    ctx.textAlign = 'center';
	                    ctx.textBaseline = 'bottom';
	                    ctx.fillStyle = '#fff';
	                    
	                    var dataset = this.data.datasets[0];
	                    var twoMonthsAgo = dataset.data[0];
	                    var oneMonthAgo = dataset.data[1];
	                    
	                }
	            }
	        },
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true
	                    
	                },
	                stacked: true,
	                
	            }],
	            xAxes: [{
	                ticks: {
	                    beginAtZero: true
	                    
	                },
	                stacked: true,
	            }]
	        }
	    },
        plugins: [{
            afterDraw: function(chart, options) {
				if (chartId == "#newReviewsChart") {
					console.log("test");
					setHeight($("#db-breakdown-div"), chart.chart.height + 148);
				}
            }
        }]
	 }
		var keys = Object.keys(json);
	 	for (i = 0; i < keys.length; i++) {
	 		chart.data.labels.push(keys[i]);
	 		chart.data.datasets[0].data.push(json[keys[i]]);
	 		
		};
		
		var dataset = chart.data.datasets[0];
		dataset.backgroundColor[0] = '#d3d3d3';
		if(dataset.data[1] > dataset.data[0]) {
			dataset.backgroundColor[1] = '#29b561';
		}
		else if(dataset.data[1] < dataset.data[0]){
			dataset.backgroundColor[1] = '#19703c';
		}
		else {
			dataset.backgroundColor[1] = '#d3d3d3';
		}
		
		var ctx = $(chartId).get(0).getContext("2d");
		
        window.myLine = new Chart(ctx, chart);
        
};

function setHeight(elem, value) {
    elem.css('height', value);
};