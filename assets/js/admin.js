// DON'T LOAD THIS WITH COMMON TOO

loadScriptThen('/assets/js/ext/jquery-ui-1.12.1.min.js', function() {

    var bindRemovindTradingNameButton = function() {
      var removeButton = $('.removeTradingName');
      removeButton.click(function() {
          $(this).parent().remove();
      })
    };

    var addTradingNameField = function() {
        var tradingNamesContainer = $('.tradingNamesContainer');
        tradingNamesContainer.append('<div class="tradingNameEntry">' +
            '<label for="tradingName">Trading Name</label>' +
            '<input class="bordered" type="text" name="tradingNames"/>' +
            '<i class="fa fa-remove fa-2x removeTradingName" style="color:red;"> </i>' +
            '</div>');

        bindRemovindTradingNameButton();
    };
	
	$(function() {
		
		$('#admin-search-review').on('click', function (e) {
			e.preventDefault();
			$('#search-review-form').submit();
		});

        $('#admin-reported-review').on('click', function (e) {
            e.preventDefault();
            $('#admin-reported-review-form').submit();
        });

        $('#admin-hidden-review').on('click', function (e) {
            e.preventDefault();
            $('#admin-hidden-review-form').submit();
        });

        $('#admin-reported-review-history').on('click', function (e) {
            e.preventDefault();
            $('#admin-reported-review-history-form').submit();
        });

        $('#admin-hidden-review-history').on('click', function (e) {
            e.preventDefault();
            $('#admin-hidden-review-history-form').submit();
        });

		$('#admin-search-logins').on('click', function (e) {
			e.preventDefault();
			$('#search-logins-form').submit();
		});

        $('#generate-monthly-packs-button').on('click', function (e) {
            $.ajax({
                url: "/admin/monthly-packs/generate",
                type: "GET"
            });

            $('#monthly-packs-modal').modal('show');
        });

        $('#generate-lawnet-monthly-packs-button').on('click', function (e) {
            $.ajax({
                url: "/admin/monthly-packs/generate-lawnet",
                type: "GET"
            });

            $('#monthly-packs-modal').modal('show');
        });
		
		$("input#firm-admin").autocomplete({
		    source: serviceUrl + "/autocomplete-firm",
		    minLength: 3,
		    select: function (event, ui) {	  
		    	window.location.href = '/admin/firm/' + ui.item.id;
	    		return false;
	    	},
		    messages: {
		        noResults: '',
		        results: function () {
		        }
		    }
		});
		
		$("input#user-admin").autocomplete({
		    source: "/admin/autocomplete-user",
		    minLength: 3,
		    select: function (event, ui) {	  
		    	window.location.href = '/admin/' + ui.item.label2 + '/' + ui.item.id;
	    		return false;
	    	},
		    messages: {
		        noResults: '',
		        results: function () {
		        }
		    }
		});
		
		// user profile and branch profile pages only
		$('a.delete-image').click(function(e) {
			e.preventDefault();
			var $a = $(this);
			$.ajax({
				type: 'GET',
		        url: $a.attr('href'),
		        success: function(data) {
		        	if(data)
		        		$a.closest('div').remove();
		        }
		    });
		});
		
		// branch profile page img upload
		$('#fileupload').change(function(e) {
			$('#imageForm').submit();
		});
		
		var days = [];
		if($('.ymd a').length > 0) {
			var arr = $('.ymd a');
			for(var ix = 0; ix < arr.length; ix++ ) {
				var $a = $(arr[ix]);
				var yyyymmdd = $a.text();
				var y = parseInt(yyyymmdd.substring(0, 4), 10);
				var m = parseInt(yyyymmdd.substring(4, 6), 10);
				var d = parseInt(yyyymmdd.substring(6, 8), 10);
				// javascript dates run from 0 to 11
				var dt = new Date(y, m-1, d);
				days.push( { id: $a.attr('id'), date: dt, count: parseInt($a.attr('title'), 10) } );
				$a.text(d);
			}
		}
		var now = new Date();
		now.setFullYear(now.getFullYear() + 1);
		for(var ix = 0; ix < days.length; ix++ ) {
			var ths = days[ix].date;
			if(ths.getFullYear() < now.getFullYear()) {
				var $s = $('<span class="y">').text(ths.getFullYear());
				$s.insertBefore('#' + days[ix].id  );
			}
			if(((ths.getFullYear() * 100) + ths.getMonth()) < ((now.getFullYear()*100) + now.getMonth())) {
				var $s = $('<span class="m">').text(monthNames[ths.getMonth()]);
				$s.insertBefore('#' + days[ix].id  );
			}
			now = ths;
		}
		
		if($("input#firm").length > 0) {
			$("input#firm").autocomplete({
			    source: function (request, response) {
			        $.ajax({
			            url: serviceUrl + "/autocomplete-branch",
			            type: 'GET',
			            cache: false,
			            data: request,
			            dataType: 'json',
			            success: function (json) {
			            	response($.map(json, function (item) {
			                    return {
			                    	id: item.id,
			                    	url : item.url,
			                        label: item.name,
			                        desc: item.address
			                    };
			                }));
			            },
			            error: function (xmlHttpRequest, textStatus, errorThrown) {	        
			            	console.log(textStatus + ', ' + errorThrown);
			            }
			        });
			    },
			    select: function (event, ui) {	  
			    	if($('input#branchSelect').length > 0) {
			    		$('input#branchSelect').val(ui.item.id);
			    		return true;
			    	} else if($('input#branch').length > 0) {
			    		$('input#branch').val(ui.item.id);
			    		$('input#branch').closest('form')[0].submit();
			    	} else {
			    		window.location.href = ui.item.url;
			    	}
		    		return false;
		    	},
			    messages: {
			        noResults: '',
			        results: function () {
			        }
			    },
			    appendTo: '#firm-menu-container'
			}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
		            return $( "<li></li>" )
		                .data( "ui-autocomplete-item", item )
		                .append( item.label + "<br><span><small>" + item.desc + "</small></span>" )
		                .appendTo( ul );
		    };
		}

        $('.change-legal-case-firm-btn').click(function(e) {
            e.preventDefault();

            $('.legal-case-admin-firm-name').hide();
            if($('.legal-case-admin-individual-solicitor').length) {
                $('legal-case-admin-individual-solicitor').hide();
            }

            $('.legal-case-admin-firm-id-edit').show();
            if($('.legal-case-admin-individual-solicitor-edit').length) {
                $('.legal-case-admin-individual-solicitor-edit').show();
            }

            return false;
        });

        $('.change-individual-solicitor-branch-btn').click(function(e) {
            e.preventDefault();

            $('.individual-solicitor-admin-branch-name').hide();
            $('.individual-solicitor-admin-branch-id-edit').show();

            return false;
        });

        if ($("input#individual-solicitor-select").length > 0) {
            $("input#individual-solicitor-select").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: serviceUrl + "/autocomplete-individual-solicitor",
                        type: 'GET',
                        cache: false,
                        data: request,
                        dataType: 'json',
                        success: function (json) {
                            response($.map(json, function (item) {
                                return {
                                    label : item.name,
                                    id: item.id,
									branchName: item.branchName,
                                    sraId: item.sraId,
                                    sraSolicior: item.sraSolicitor
                                };
                            }));
                        },
                        error: function (xmlHttpRequest, textStatus, errorThrown) {
                            console.log(textStatus + ', ' + errorThrown);
                        }
                    });
                },
                select: function (event, ui) {
                    $("#individual-solicitor-field").val(ui.item.id);
                    if (ui.item.sraSolicior) {
                        $('#sraSolicitor1').prop('checked', true);
                    } else {
                        $('#sraSolicitor1').prop('checked', false);
                    }
                },
                messages: {
                    noResults: '',
                    results: function () {
                    }
                },
                appendTo: '#individual-solicitor-container',
                delay: 200,
                minLength: 4
            }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                return $( "<li></li>" )
                    .data( "ui-autocomplete-item", item )
                    .append( item.label + "<br/><span><small>ID: " + (item.id ? item.id : "") + ", SRA ID: " + (item.sraId ? item.sraId : "") + "</small></span><br/><span><small>" + item.branchName + "</small></span>" )
                    .appendTo( ul );
            };
        }

        if($("input#ranking-location").length > 0) {
            $("input#ranking-location").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: serviceUrl + "/autocomplete-location",
                        type: 'GET',
                        cache: false,
                        data: request,
                        dataType: 'json',
                        success: function (json) {
                            response($.map(json, function (item) {
                                return {
                                    value: item.searchName,
                                    label: item.name,
                                    nameForUrl: item.nameForUrl
                                };
                            }));
                        },
                        error: function (xmlHttpRequest, textStatus, errorThrown) {
                            $("#town").text(textStatus + ', ' + errorThrown);
                        }
                    });
                },
                change: function(event, ui) {
                    $('input#location-name-for-url').val(ui.item ? ui.item.nameForUrl : '');
                },
                select: function (event, ui) {
                    $('input#location-name-for-url').val(ui.item.nameForUrl);
                },
                messages: {
                    noResults: '',
                    results: function () {
                    }
                },
                appendTo: '#town-menu-container'
            });
        }

        if($("input#ranking-area-of-law").length > 0) {
            $("input#ranking-area-of-law").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: serviceUrl + "/autocomplete-area-of-law",
                        type: 'GET',
                        cache: false,
                        data: request,
                        dataType: 'json',
                        success: function (json) {
                            response($.map(json, function (item) {
                                return {
                                    value: item.searchName,
                                    label: item.name,
                                    nameForUrl: item.searchUrl
                                };
                            }));
                        },
                        error: function (xmlHttpRequest, textStatus, errorThrown) {
                            $("#town").text(textStatus + ', ' + errorThrown);
                        }
                    });
                },
                change: function(event, ui) {
                    $('input#area-of-law-name-for-url').val(ui.item ? ui.item.nameForUrl : '');
                },
                select: function (event, ui) {
                    $('input#area-of-law-name-for-url').val(ui.item.nameForUrl);
                },
                messages: {
                    noResults: '',
                    results: function () {
                    }
                },
                appendTo: '#area-of-law-menu-container',
                minLength: 1
            });
        }

        $('#select-all').click(function(event) {
            if (this.checked) {
                $(':checkbox').each(function() {
                    this.checked = true;
                });
            } else {
                $(':checkbox').each(function() {
                    this.checked = false;
                });
            }
        });

        if ($("input#premium-firm-appointment-assign").length > 0) {
            $("input#premium-firm-appointment-assign").autocomplete({
                source: serviceUrl + "/autocomplete-premium-firm",
                minLength: 3,
                select: function (event, ui) {
                    $("#assigned-firm-id").val(ui.item.id);
                    $("form#appointment-assign-form").submit();
                    return false;
                },
                messages: {
                    noResults: '',
                    results: function () {
                    }
                }
            });
        }

        $('.addTradingName').click(function(e) {
            addTradingNameField();
        });
        bindRemovindTradingNameButton();
	 });
});

var monthNames = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ];