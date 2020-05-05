loadScriptThen('https://www.gstatic.com/charts/loader.js', function() {
	google.charts.load('current', {'packages':['corechart', 'controls']});	
	google.charts.setOnLoadCallback(myReviewsChart);
});

var myReviewsChart = function() {
	
	var branchCategory = new google.visualization.ControlWrapper({
	      'controlType': 'CategoryFilter',
	      'containerId': 'filter',
	      'options': {
	        'filterColumnIndex': 0,
	        'ui': {
	          'allowTyping': false,
	          'allowMultiple': true,
	          'selectedValuesLayout': 'belowStacked'
	        }
	      }
	});
	
	var lineChartReviews = new google.visualization.ChartWrapper({
		chartType: 'LineChart',
		options: {
		    backgroundColor: 'none',
	        fontSize:'16',
	        colors: ['#1c7b42', '#b1b5b9', '#00a851'],
	        lineWidth:5,
//	        pointSize: 2,
	        legend: { position: 'top' },
	        hAxis: {
	            textPosition: 'none',
	            gridlines: {
	                color: "#FFFFFF"
	            },
	            baselineColor: '#FFFFFF',
	           
	        },
	        tooltip: { isHtml: true,textStyle:  {fontSize: 15,bold: false} }
		},
		containerId: 'chart'
	});

	var pieChartReviews = new google.visualization.ChartWrapper({
		chartType: 'PieChart',
		options: {
			'title': 'Branch Reviews',
			'is3D': true
		},
		containerId: 'chart'
	});

	// Chart listener must be added after chart is ready.
	showReviews = function() {
		dateRange = slider.getState();
		
		filterReviews("30/08/2015", "");
		
	}
	google.visualization.events.addListener(lineChartReviews, 'ready', showReviews);

	
	var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));
	
	var createDashboard = function(jsonData) {
			
		// Data preperation //
	
		// Create a DataTable with filtered branch columns. hiddenBranches
		// is an array of branch ids.
		var filteredDataTable = function(jsonData, hiddenBranches) {
			var dt = new google.visualization.DataTable(jsonData);
			var totalNumberBranches = dt.getNumberOfColumns() - 1;
			if (hiddenBranches) {
				// first get the corresponding (sorted) data table indexes.
				indexes = [];
				for (var x=1; x<totalNumberBranches; x++) {
					if (hiddenBranches.indexOf(dt.getColumnId(x)) > -1) {
						indexes.push(x);
					} 
				}
				indexes.sort(function(a, b) {
					if (a==b) return 0;
					return a>b ? -1 : 1;
				});
	
				// remove the hidden columns, working down
				indexes.forEach(function(colIdx) {
					dt.removeColumn(colIdx);
				});
			}
			return dt;
		}
		
		var createReviewCountView = function(hiddenBranches) {
			var dt = filteredDataTable(jsonData, hiddenBranches);
			// a view just showing the total number of reviews.
			var dayTotalView = new google.visualization.DataView(dt);
			var numberBranches = dt.getNumberOfColumns() - 1;
			dayTotalView.setColumns([0, {calc: function(dataTable, row) {
					var total = 0;
					// first column is review date.
					for (var x=1; x<=numberBranches; x++) {
						total += dataTable.getValue(row, x);
					}
					return total;
				},
				type: 'number'
				
				}]
			);
			return dayTotalView;
		}
	
		var createTotalReviewCountView = function(hiddenBranches) {
			var dt = filteredDataTable(jsonData, hiddenBranches);
			var numberBranches = dt.getNumberOfColumns() - 1;
			var columnAggregators  = [];
			for (var x=1; x<=numberBranches; x++) {
				columnAggregators.push({
					'column' : x,
					'aggregation' : google.visualization.data.sum,
					'type' : 'number'
				});
			}
			// Collapse the date column.
			var now = new Date();
			var totalsDt = google.visualization.data.group(
					dt,
					[{column:0, type: 'date', modifier: function(val) {return now;}}],
					columnAggregators
			);
			// Pivot the data table so that two columns instead of
			// two rows. (for slices)
			var sliceDt = new google.visualization.DataTable({
			    cols: [{id: 'branchId', label: 'Branch', type: 'string'},
			           {id: 'reviewsCount', label: 'Number of Reviews', type: 'number'}],
			    rows: []
			});
			sliceDt.addRows(numberBranches);
			
			// Populate with the aggregated review counts.
			for (var x=0; x<numberBranches; x++) {
				sliceDt.setCell(x, 0, dt.getColumnLabel(x+1));
				sliceDt.setCell(x, 1, totalsDt.getValue(0, 1+x));
			}
			return sliceDt;
		}
		setBranches = function() {
			var hidden = [];
			//var boxes = document.getElementById('branchFilter').children;
			//for (var i=boxes.length-1; i>-1; i--) {
			//	if (!boxes[i].checked) {
			//		hidden.push(boxes[i].value); 
			//	}
			//}
			dashboard.draw(createReviewCountView(hidden));
		}
		
		// Init //
		
		dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));
		dashboard.draw(createReviewCountView());
	}

	setRatings = function(select) {
		fetchCreateDashboard();
	}

	var getRatingsArray = function() {
		var ratings = [];
		var options = document.getElementById('ratingsFilter').children;
		for (var i=0; i < options.length; i++) {
			if (options[i].checked) {
				ratings.push(i+1);
			}
		}
		
		console.log(ratings);
		return ratings;
	}
	
	var fetchCreateDashboard = function() {
		var ratings = getRatingsArray();
		$.ajax({
			url: '/reports/number-reviews?format=json&ratings='+ratings.join(','),
			dataType: "json"
		}).done(function(data) {
			createDashboard(data);
		});

	}

	fetchCreateDashboard();
	
}


