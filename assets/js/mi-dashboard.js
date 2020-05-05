loadScriptThen('/assets/js/Chart.bundle.js', function() {

    if($('#chartReviewRequests').length > 0) {
        $.ajax({
            url: "/service/v1/mi-dashboard-chart",
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                createChartFromJson("#chartReviewRequests", json);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                console.log(textStatus + ', ' + errorThrown);
            }
        });
    }

    $('#btn-update-graph').click(function() {

        var fromDate = new Date($("#from-date").val());
        var toDate = new Date($("#to-date").val());


        if(fromDate > 0 && !isNaN(fromDate) && toDate > 0 && !isNaN(toDate)) {
            updateChart(fromDate, toDate);
        }
        else {
            $(".graph-error-message").show();
        }
    });
});

var createChartFromJson = function(chartId,json) {
    var config = {
        type: 'line',
        data: {
            labels:[],
            datasets: [{
                label: "Total Number of review requests sent",
                data: [],
                fill: false,
                borderColor: '#00AF54',
                backgroundColor: '#00AF54',
                pointRadius: 4,
                borderWidth: 2
            }, {
                label: "Number of single client requests",
                data: [],
                fill: false,
                borderColor: '#006eaf',
                backgroundColor: '#006eaf',
                pointRadius: 4,
                borderWidth: 2
            }, {
                label: "Number of requests sent via CSV upload",
                data: [],
                fill: false,
                borderColor: '#af0000',
                backgroundColor: '#af0000',
                pointRadius: 4,
                borderWidth: 2
            }, {
                label: "Number of new reviews",
                data: [],
                fill: false,
                borderColor: '#af9a00',
                backgroundColor: '#af9a00',
                pointRadius: 4,
                borderWidth: 2
            }, {
                label: "Number of LawNet reviews",
                data: [],
                fill: false,
                borderColor: '#8300af',
                backgroundColor: '#8300af',
                pointRadius: 4,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title:{
                display:false,
                text:'Reviews'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
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
                        beginAtZero: true
                    }
                }]

            },
            legend: {
                display: true,
                labels : {
                    boxWidth: 40,
                    padding: 10
                }
            }
        }
    };

    for (var i = 0 ; i < json.length ; i++) {
        for (var key in json[i]) {
            if (i == 0) {
                config.data.labels.push(key);
            }
            config.data.datasets[i].data.push(json[i][key])
        }
    }

    var ctx = $(chartId).get(0).getContext("2d");
    window.myLine = new Chart(ctx, config);
};

function updateChart(fromDate, toDate) {
    $.ajax({
        url: "/service/v1/mi-dashboard-chart",
        type: 'GET',
        dataType: 'json',
        data: {
            fromDate:fromDate.toLocaleDateString("en-GB"),
            toDate:toDate.toLocaleDateString("en-GB")
        },
        success: function (json) {
            if (typeof window.myLine != 'undefined') {
                window.myLine.destroy();
            }
            createChartFromJson("#chartReviewRequests", json);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + ', ' + errorThrown);
        }
    });
}