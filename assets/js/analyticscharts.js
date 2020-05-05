loadScriptThen('/assets/js/ext/moment.min.js', function(){});
loadScriptThen('https://www.gstatic.com/charts/loader.js', function() {
	google.charts.load('current', {'packages':['corechart', 'controls']});	
	google.charts.setOnLoadCallback(drawCharts);
});

function getDateQuery(numMonths) {
	var formatString = 'YYYY-MM-DD';
	var upper = moment().format(formatString);
	var lower = moment().subtract(numMonths, 'month').startOf('month').format(formatString);
	return 'lower='+lower+'&upper='+upper;
}

function analyticsCharts(numMonths) {

	var dateQuery = getDateQuery(numMonths);
	var oneYearQuery = getDateQuery(12);
	
	var monthYearCol = {
			calc: function(dataTable, row) {
					return moment(dataTable.getValue(row, 0)).format('MM-YYYY');
			}, 
			type: 'string', label: 'Month'};

	
	var getColIndex = function(dataTable, colId) {
		for (var x=0; x < dataTable.getNumberOfColumns(); x++) {
			if (dataTable.getColumnId(x) == colId) {
				return x;
			}
		}
		throw new Error('invalid column label');
	}
	
	// transform column 0 to a month-year string. optional transform function for column 1.
	var dateToMonthYearView = function(dt, annotateFn, col1Fn) {
		var monthYearView = new google.visualization.DataView(dt);
		if (!col1Fn) {
			col1Fn = 1;
		}
		var cols = [monthYearCol, col1Fn, annotateFn];
		if (!annotateFn) {
			cols = cols.slice(0, 2);
		}
		monthYearView.setColumns(cols);
		return monthYearView;
	}

	var getColumnVal = function(colName) {
		return function(row, dataTable) {
			var colIndex = getColIndex(dataTable, colName);
			return dataTable.getValue(row, colIndex);
		}
	}

	var percentChangeCol = function(getValFn) {
		return {
			calc: function(dataTable, row) {
				if (row == 0) {
					return;
				}
				var currentVal = getValFn(row, dataTable);
				var previousVal = getValFn(row-1, dataTable);
				
				if (previousVal == 0 || currentVal == 0) {
					return;
				}
				var percent = ((currentVal-previousVal)/previousVal) * 100;
				return Math.round((percent*10))/10 + '%';
			},
			type: 'string',
			label: 'Percentage Change',
			role: 'annotation'
		};
	}

	
	$.ajax({
		url: '/reports/review-requests?format=json&'+dateQuery,
		dataType: 'json'
	}).done(function(data) {
		var chart = new google.visualization.ChartWrapper({
		chartType: 'ColumnChart',
		options: {
//			'title': 'Review Requests Sent',
			backgroundColor: 'none',
		    fontSize:'16',
		    legend: 'none',
		    colors: ['#1c7b42', '#b1b5b9', '#00a851']
		},
		containerId: 'reviewRequestChart'
		});
		var dt = new google.visualization.DataTable(data);
		chart.setDataTable(dateToMonthYearView(dt, percentChangeCol(getColumnVal('requests'))));
		chart.draw();
	});
	
	$.ajax({
		url: '/reports/number-reviews?format=json&ratings=1,2,3,4,5&'+dateQuery,
		dataType: 'json'
	}).done(function(data) {
		var chart = new google.visualization.ChartWrapper({
		chartType: 'ColumnChart',
		options: {
//			'title': 'New Reviews',
			backgroundColor: 'none',
		    fontSize:'16',
		    
		    legend: 'none',
		    colors: ['#1c7b42', '#b1b5b9', '#00a851'],
		    tooltip: { isHtml: true,textStyle:  {fontSize: 15,bold: false} }
		},
		
		containerId: 'newReviewsChart'
		});

		// requires a custom function to get the value for the
		// percent calculations.
		var getTotal = function(row, dataTable) {
			var numberBranches = dataTable.getNumberOfColumns() - 1;
			var total = 0;
			// first column is review date.
			for (var x=1; x<=numberBranches; x++) {
				total += dataTable.getValue(row, x);
			}
			return total;
		}
		
		// data is broken down by branch, needs summed.
		var totalCol = {
			calc: function(dataTable, row) {
				return getTotal(row, dataTable);
		},
		type: 'number',
		label: 'Reviews per month'};
	
		var dt = new google.visualization.DataTable(data);
		
		chart.setDataTable(dateToMonthYearView(dt, percentChangeCol(getTotal), totalCol));
		chart.draw();
	});
	
	$.ajax({
		url: '/reports/search-appearances?format=json&'+dateQuery,
		dataType: 'json'
	}).done(function(data) {
		var chart = new google.visualization.ChartWrapper({
		chartType: 'ColumnChart',
		options: {
//			'title': 'Client Exposure',
			backgroundColor: 'none',
		    fontSize:'16',
		    legend: 'none',
		    colors: ['#1c7b42', '#b1b5b9', '#00a851']
		},
		containerId: 'clientExposureChart'
		});
		var dt = new google.visualization.DataTable(data);
		chart.setDataTable(dateToMonthYearView(dt, percentChangeCol(getColumnVal('appearances'))));
		chart.draw();
	});
		
	$.ajax({
		url: '/reports/profile-clicks?format=json&'+dateQuery,
		dataType: 'json'
	}).done(function(data) {
		var chart = new google.visualization.ChartWrapper({
		chartType: 'ColumnChart',
		options: {
//			'title': 'Profile Clicks',
			backgroundColor: 'none',
		    fontSize:'16',
		    legend: 'none',
		    colors: ['#1c7b42', '#b1b5b9', '#00a851']
		},
		containerId: 'profileClicksChart'
		});
		var dt = new google.visualization.DataTable(data);
		chart.setDataTable(dateToMonthYearView(dt, percentChangeCol(getColumnVal('profile_views'))));
		chart.draw();
	});

	$.ajax({
		url: '/reports/review-responses?format=json&'+dateQuery,
		dataType: 'json'
	}).done(function(data) {
		var chart = new google.visualization.ChartWrapper({
		chartType: 'ColumnChart',
		options: {
//			'title': 'Responses',
			backgroundColor: 'none',
		    fontSize:'16',
		    legend: 'none',
		    colors: ['#1c7b42', '#b1b5b9', '#00a851']
		},
		containerId: 'reviewResponsesChart'
		});
		var dt = new google.visualization.DataTable(data);
		chart.setDataTable(dateToMonthYearView(dt, percentChangeCol(getColumnVal('review_responses'))));
		chart.draw();
	});
		
	$.ajax({
		url: '/solicitor/analytics/ratings?'+oneYearQuery,
		dataType: 'html'
	}).done(function(data) {
		$('#ratingsBreakdownChart').children().remove();
		$(data).appendTo('#ratingsBreakdownChart');
		
	});
	

}
