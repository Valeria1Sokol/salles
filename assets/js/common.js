var authenticateCallback = function(auth) {
    if(auth) {
	window.auth = auth;
	if(auth && auth.authenticated) {
		$('a.signup').hide();
		$('.signin').text('My dashboard');
		$('.replace-src').each(function(ix, obj) {
			if(obj.src != auth.avatar)
				obj.src = auth.avatar;
			obj.alt = auth.displayname;
			obj.title = 'Avatar of ' + auth.displayname;
		});
		if(auth.role=='solicitor') {
			$('.add-rating').hide();

            if($('#become-verified-btn').length) {
                $('#become-verified-btn').text('Start Collecting');
            }
		}
	}
    }
};

var authenticate = function() {
	$.ajax({
        type: 'GET',
        url: serviceUrl + '/authentication',
        success: authenticateCallback
    });
};

var mobilecheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

// any link which has the class "click-ajax" should submit a post using ajax instead of the GET
// it's assumed there's a csrf token in the page that can be used
var bindClickAjax = function() {
	$('a.click-ajax').off();
	$('a.click-ajax').click(function (e) {
		e.preventDefault();
		var $a = $(this);
		if ($a.hasClass('dead-link'))
			return;
		var csrf = $('input[name=_csrf]').val();
		if (typeof csrf != 'undefined') {
			$.ajax({
				type: 'POST',
				url: $a.attr('data-url'),
				data: {'_csrf': csrf},
				success: function (data) {
					// check payload and update element if required
					if (data.text) {
						$a.text(data.text);
						$a.addClass('dead-link');
					}
				}
			});
		}
	});
};

// click on Report as abuse next to a review TODO convert to ajax-click
var bindReportClick = function() {
	$('.report-click').off();
	$('.report-click').on('click', function (e) {
		var reviewId = $(this).parent().closest('article').attr('id').match(/[\d]+$/);
		var clicked = $(this);

		$.ajax({
			type: 'POST',
			url: serviceUrl + '/review/' + reviewId + '/report',
			data: {'_csrf': $('input[name=_csrf]').val()},
			success: function (data) {
				clicked.addClass('dead-link');
				if (clicked.text().trim() == 'Report to admin')
					clicked.html("<i class=\"fa fa-flag\"></i>Reported");
				else
					clicked.parent().text('This review has been reported as abusive. ReviewSolicitors will investigate and take appropriate action. Thank you.');
			}
		});
		e.preventDefault();
	});

	$('.solicitor-report-click').off();
	$('.solicitor-report-click').on('click', function (e) {
		var reviewId = $(this).parent().closest('article').attr('id').match(/[\d]+$/);
		var clicked = $(this);

		$.ajax({
			type: 'POST',
			url: serviceUrl + '/review/' + reviewId + '/report',
			data: { '_csrf': $('input[name=_csrf]').val() },
			success: function(data) {
				clicked.addClass('dead-link');
				if(clicked.text().trim() == 'Report to admin')
					clicked.html("<i class=\"fa fa-flag\"></i>Reported");
				else
					clicked.parent().text('This review has been reported as abusive. ReviewSolicitors will investigate and take appropriate action. Thank you.');
			}
		});
		e.preventDefault();
	});
};

// Convenience for left padding strings.
String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};


loadScriptThen('/assets/js/ext/jquery-ui-1.12.1.min.js', function() {
	
	authenticate();
	
	// if there's a form with the class "auto-ajax" it will be submitted on page load by this function
	$('form.auto-ajax').each(function(ix, obj) {
		var $frm = $(obj); //<-- creates a jquery object of the form
		var obj = {};
		$frm.find('input').each(function(ix, inp) {
			var $inp = $(inp);
			obj[$inp.attr('name')] = $inp.val();
		});
		$.ajax({
			type: $frm.attr('method'),
	        url: $frm.attr('action'),
	        data: obj, //{ '_csrf': $frm.find('input[name=_csrf]').val() },
	        success: function(data) {
	        	// console.log(data);
	        }
	    });
	});

	bindClickAjax();

	$('.toggle-nav').click(function() {
		$('.top-nav').slideToggle();
	});

	// homepage only
	$('ul#review-tab-list.tabs-nav li > a').click(function(e) {
	    $('ul.tabs-nav li').removeClass();
	    $(this).parent().addClass('active');
	
	    $(".reviews-list").toggle();
	    e.preventDefault();
	});

	// reset long and lat for search
	$('input#longitude').val('');
	$('input#latitude').val('');
	
	// page header (everywhere except solicitor dash pages and admin) autocomplete on the location/town field
	if($("input#location").length > 0) {
		$("input#location").autocomplete({
		    source: function (request, response) {
		        $.ajax({
		            url: serviceUrl + "/autocomplete-town",
		            type: 'GET',
		            cache: false,
		            data: request,
		            dataType: 'json',
		            success: function (json) {
		            	response($.map(json, function (item) {
		                    return {
		                    	url: item.url,
		                    	action: item.action,
		                    	value : item.label,
		                        label: item.label + (item.info ? ', ' + item.info : ''),
		                        latitude: item.latitude,
		                        longitude: item.longitude
		                    };
		                }));
		            },
		            error: function (xmlHttpRequest, textStatus, errorThrown) {
		            	$("#town").text(textStatus + ', ' + errorThrown);
		            }
		        });
		    },
		    select: function (event, ui) {
		    	$('input#longitude').val(ui.item.longitude);
		    	$('input#latitude').val(ui.item.latitude);
	    		$('input#location').val(ui.item.label);
	    		$('input#location')[0].form.submit();
		    	//return false;
		    },
		    messages: {
		        noResults: '',
		        results: function () {
		        }
		    },
		    appendTo: '#town-menu-container'
		});
//		.on('keyup', function(e) {
//			$('input#town').val( $('input#location').val() );
//		}).on('blur', function() {
//			if( $('input#town').val().indexOf('/') !== 0 ) {
//				$('input#town').val( $('input#location').val() );
//			}
//		});
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
                                value: item.name,
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
            select: function (event, ui) {
                $('input#location-name-for-url').val(ui.item.nameForUrl);
                $('input#ranking-location').val(ui.item.value);
                $('input#ranking-location')[0].form.submit();
                //return false;
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
                                value: item.name,
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
            select: function (event, ui) {
                $('input#area-of-law-name-for-url').val(ui.item.nameForUrl);
                $('input#ranking-location').val(ui.item.name);
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
	
	// location auto-complete where area of law is preselected (guide pages)
	if($("form#preselectedAreaForm").length > 0) {
		$("#preselectedAreaForm input.location").autocomplete({
		    source: function (request, response) {
		        $.ajax({
		            url: serviceUrl + "/autocomplete-town",
		            type: 'GET',
		            cache: false,
		            data: request,
		            dataType: 'json',
		            success: function (json) {
		            	response($.map(json, function (item) {
		                    return {
		                    	url: item.url,
		                    	action: item.action,
		                    	value : item.label,
		                        label: item.label + (item.info ? ', ' + item.info : ''),
		                        latitude: item.latitude,
		                        longitude: item.longitude
		                    };
		                }));
		            },
		            error: function (xmlHttpRequest, textStatus, errorThrown) {	                        
		            	$("#town").text(textStatus + ', ' + errorThrown);
		            }
		        });
		    },
		    select: function (event, ui) {         	
		    	$('#preselectedAreaForm input#longitude').val(ui.item.longitude);
		    	$('#preselectedAreaForm input#latitude').val(ui.item.latitude);
	    		$('#preselectedAreaForm input.location').val(ui.item.label);
	    		$('#preselectedAreaForm input.location')[0].form.submit();
		    	//return false;
		    },
		    messages: {
		        noResults: '',
		        results: function () {
		        }
		    },
		    appendTo: '#town-menu-container'
		});
	}
	
	// index, review, solicitor signup etc. pages: autocomplete on the firm field
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
		                        desc: item.address,
								head: item.headOffice
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
		    		$('input#branchname').val(ui.item.label);
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
		    appendTo: '#firm-menu-container',
		    delay: 400,
		    minLength: 2
		}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			if (item.head) {
                return $("<li class='firm-search-list-item'></li>")
                    .data("ui-autocomplete-item", item)
                    .append("<div class='firm-search-item'><div class='firm-search-container'><span class='firm-search-left'>" + item.label + "</span><span class='firm-search-right'>Head Office</span></div><span><small>" + item.desc + "</small></span></div>")
                    .appendTo(ul);
            } else {
                return $("<li></li>")
                    .data("ui-autocomplete-item", item)
                    .append("<div><div><span>" + item.label + "</span></div><span><small>" + item.desc + "</small></span></div>")
                    .appendTo(ul);
			}
	    };
	}
	
	// write review page
	$('.select-rating input').change(function(e) {
		var $inp = $(this);
		console.log( $inp );
		var text = '';
		switch( $inp.val() ) {
			case '1' : text = 'Awful'; break;
			case '2' : text = 'Bad'; break;
			case '3' : text = 'Okay'; break;
			case '4' : text = 'Good'; break;
			case '5' : text = 'Great'; break;
			default: '';
		}
		$inp.parent().siblings('.right').text( text );
	});
	
	// user details image upload, solicitor profile page image upload, solictors img upload
	$('#fileupload').change(function(e) {
		$('#imageForm').submit();
	});

	// anywhere we're using modals - profile pages only?
	$('.close-modal, .modalCloseImg').click(function (e) {
		$.modal.close();

        if (grecaptcha) {
            grecaptcha.reset();
        }

		return false;
	});
	
	// signup new solicitor
	if($('input#branchSelect').length > 0 && parseInt($('input#branchSelect').val(), 10) > 0) {
		// load in the name of the solicitor branch
		$.getJSON(serviceUrl + '/branch/' + $('input#branchSelect').val(), function(data) {
			if(data && data.name)
				$('input#firm').val(data.name);
		});
	}
	
	$(".content-integrity").hide();
	$("#ci-learn-more").click(function() {
		$(".content-integrity").slideToggle(500);
	});
	$('#fillLatLong').on('click', function(e) {
		var address = $('#address1').val() + $('#address2').val() + $('#address3').val() + $('#address4').val() + $('#postcode').val(); 
		$.ajax({
			  url:"http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false",
			  type: "POST",
			  success:function(res){
				  $('#lat').val(res.results[0].geometry.location.lat);
				  $('#lng').val(res.results[0].geometry.location.lng);
			  }
		});
	});

	// click on poll link on branch profile pages TODO convert to ajax-click
	$('.poll-click').on('click', function (e) {
		// need this to stop stuff from being called twice
		e.stopImmediatePropagation();
		e.preventDefault();
		var answer = $('#poll-form input[name=quiz]:checked').val()
		var pollId = $('#poll-id').val();
		
		$.ajax({
			type: 'POST',
	        url: serviceUrl + '/poll/' + pollId +'/' + answer + '/save',
	        data: { '_csrf': $('input[name=_csrf]').val() },
	        success: function(data) {
	        	//console.log(data);
	        	$('#poll-question').addClass("hide");
	        	$('#poll-results').removeClass("hide");
	        	var url = serviceUrl + '/poll-results?id=' + pollId;
	        	generatePollData(url);	        
	        }
	    });
	});
	
	bindReportClick();

	if($('#postcode-tip').length > 0) {
		$('#postcode-tip').tooltipsy({
		    offset: [2, 2],
		    css: {
		        'padding': '10px',
		        'max-width': '200px',
		        'color': '#303030',
		        'background-color': '#f5f5b5',
		        'border': '1px solid #deca7e',
		        '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
		        '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
		        'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
		        'text-shadow': 'none'
		    }
		});
	}	
});

loadScriptThen('/assets/js/ext/geoPosition.js', function() {
	// tests whether it's supported by the browser
	if (geoPosition.init()) {
		// example hook for "Find near me"
		$('input#location').parent().append(
		$('<div class="compass" title="Use my current location"><i class="fa fa-compass"></i></div>').click(function(e) {
			e.preventDefault();
			geoPosition.getCurrentPosition(geoSuccess, geoError);
			$('div.compass').addClass('animate-flicker');
		}) );
		$('div.compass').delay(100).animate({ opacity: 1 }, 700);
	}	
});

var geoSuccess = function(position) {
	console.log("Latitude " + position.coords.latitude + ", Longitude " + position.coords.longitude);
	if($('input#latitude').length > 0) {
		$('input#latitude').val(position.coords.latitude);
		$('input#longitude').val(position.coords.longitude);
		$('input#location').val('my location');
		$('input#latitude')[0].form.submit();
	}
};

var geoError = function() {
	// this only gets called on an actual error, not when the user clicks 'Deny'
	console.log("Could not obtain geo position");
};



