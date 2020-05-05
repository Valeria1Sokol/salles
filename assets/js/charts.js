loadScriptThen('/assets/js/ext/chart.min.js', function() {
	
	if($('#chartMonthlyReview').length > 0) {
		$.ajax({
	        url: "/service/solicitor/v1/monthly-review-count",
	        type: 'GET',
	        dataType: 'json',
	        success: function (json) {
	        	createChartFromJson("#chartMonthlyReview", json);
	        },
	        error: function (xmlHttpRequest, textStatus, errorThrown) {
	        	console.log(textStatus + ', ' + errorThrown);
	        }
	    });
	}
	
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
	
	loadScriptThen('/assets/js/ext/Chart.HorizontalBar.min.js', function() {
	})
	
	
});


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
	var data = {
		labels:[],
	    datasets : [
	        {
	            fillColor : "rgba(99,123,133,0.4)",
	            strokeColor : "rgba(220,220,220,1)",
	            pointColor : "rgba(220,220,220,1)",
	            pointStrokeColor : "#fff",
	            data : []
	        }
	    ]
	}
	
	for (var key in json) {
	    data.labels.push(key);
	    data.datasets[0].data.push(json[key]);
	}
	var options = {}
	var ctx = $(chartId).get(0).getContext("2d");
	var chart = new Chart(ctx).Line(data, options);
}

var createBarChartFromJson = function(chartId,json) {
	var data = {
		labels:[],
	    datasets : [
	        {
	            fillColor : "rgba(0,175,84,1.0)",
	            strokeColor : "rgba(220,220,220,1)",
	            pointColor : "rgba(220,220,220,1)",
	            pointStrokeColor : "#fff",
	            data : []
	        }
	    ]
	}
	
	for (var key in json) {
	    data.labels.push(key);
	    data.datasets[0].data.push(json[key]);
	}
	var options = {
			scaleFontFamily: "'Open Sans', sans-serif",
			scaleFontColor: "#272b29",
			showScale: true,
			scaleShowGridLines : false,
			scaleShowHorizontalLines: false,
			scaleShowVerticalLines: false
	}
	var ctx = $(chartId).get(0).getContext("2d");
	var chart = new Chart(ctx).HorizontalBar(data, options);
};