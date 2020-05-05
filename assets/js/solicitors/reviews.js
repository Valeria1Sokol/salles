$(function() {

	var reviewSelected;

	$('#btn-reset-graph').click(function() {
		
		$("#from-date").val("");
		
		var fromDate = +new Date($("#from-date").val());
		
		$(".graph-error-message").hide();
		
		refreshReviews(1, false);

	});
	
	
	$('#btn-update-graph').click(function() {
		
		var fromDate = +new Date($("#from-date").val());
		
		if(!(isNaN(fromDate) || fromDate < 0)) {
			filterChart(fromDate);
		}
		else {
			$(".graph-error-message").show();
		}
		
		refreshReviews(1, false);
		
		
	});
	
	
	$('#btnExcellent, #btnGood, #btnAverage, #btnPoor, #btnAwful, #btnResponded').click(function(e) {
		
		if ($('#' + e.target.id).hasClass("green-background"))
			$('#' + e.target.id).removeClass("green-background");
		else {
			$('#' + e.target.id).addClass("green-background");
		}
		
		refreshReviews(1, false);
		
	});

	$('#rvAreaOfLaw, #rvLocation, #rvTeams').change(function(e) {
        refreshReviews(1, false);
    });

	function initPageBinds() {
		$('.review-page').click(function() {
			
			
			page = $(this).text();
			$('.review-page').attr("diasbled", true);
			$('.review-page').removeClass("review-page-used");
			$(this).addClass("review-page-used");
			
			refreshReviews(page, false);
			//if(($this).closest("#pages-div").attr("class").split(' ').pop() == 'review-pages-bottom') {
			//	$('html, body').animate({
			//		scrollTop: $("#renderReviews").offset().top - 70
			//	}, 600, "swing");
			//}
			
			
			
			
		})
		
	}
	
	function initAddResponseBinds() {
		$(".response").click(function(e) {
			console.log($(this).attr("id"));
			var responseType = $(this).attr("id");
			
			var noOfRadioButtons = 5;
			
			if(responseType == "custom-response") {
				var text = $(this).closest("#custom-response-div").find("#custom-message").val();
			}
			else if(responseType == "preset-response") {
				var radios = $(this).closest(".in-use").find(".radio-container");
				
				for(i = 1; i <= noOfRadioButtons; i++) {
					if(radios.find("#radio" + i).is(":checked")) {
						var text = $("label[for='radio"+i+"']").html();
					}
				}
			}
			
			var reviewId = $(this).closest(".response-container-class").attr("class").split(' ').pop()
			//console.log(reviewId);
			
			console.log(text);
			$('html, body').animate({
				scrollTop: $("#" + reviewId).offset().top - 70
			}, 600, "swing");
		
			$.ajax({
				url: "/reviews/reply",
				type: "GET",
				data: {type: responseType, text: text, reviewId: reviewId},
				dataType: 'text',
				success: function(page) {
					var page = $('.review-page-used').first().text();
					console.log(page);
					refreshReviews(page, false);
				},
				error: function () {
					$('#response-error-message').toggleClass('hidden');
				}
			});

		
		});
	}
	
	function initEditResponseBinds() {
		$(".button-green").click(function() {
			
			var reviewId = $(this).closest(".response-container-class").attr("class").split(' ').pop()
			$("#" + reviewId).addClass("selected-review");
			$(".review:not(#"+reviewId+")").removeClass("selected-review");
			
			var subscription = $(this).closest(".response-container-class").attr("id");
			
			
			
			if(subscription == "BASIC") {
				var target = $("#response-div")
				
				var container = $(this).closest(".response-container-class")
				target.show();
				
				var noRemove = container.find("#add-response-button-div");
				
				$(".response-container-class").empty();
				
				//noRemove.find('#button-green-arrow').first().css('display', 'inline');
				
				$(".response-container-class").html(noRemove);
				
				initEditResponseBinds();
				
				target.clone().appendTo(container);
				target.hide();
				
				container.find(".button-submit").addClass("response");
				container.find("#response-div").addClass("in-use");
				
				
				
			}
			else if(subscription == "RLEADER") {
				var target = $("#response-div-premium")
				
				var container = $(this).closest(".response-container-class")
				target.show();
				
				var noRemove = container.find("#add-response-button-div");
				
				$(".response-container-class").empty();
				
				//noRemove.find('#button-green-arrow').first().css('display', 'inline');
				
				$(".response-container-class").html(noRemove);
				
				initEditResponseBinds();
				
				target.clone().appendTo(container);
				target.hide();
				
				container.find(".button-submit").addClass("response");
				container.find("#response-div-premium").addClass("in-use");
				
				var responseText = $("#response"+reviewId).find("#response-text").html();
				if(typeof responseText !== 'undefined') {
					responseText = responseText.replace(/<br>/g, "\n");
					container.find("#custom-message").text(responseText);
				}
				
				
			}
			
			
			$(".response").unbind("click");
			initAddResponseBinds();
			initPageBinds();
			
			//$('html, body').animate({
			//	scrollTop: $("#" + reviewId).offset().top - 70
			//}, 600, "swing");
			
			
			//$(".glyphicon glyphicon-triangle-bottom arrow-glyphicon").not(noRemove.find("#button-green-arrow:first")).css('display', 'none');
			
		});
	}

    function initReportingBinds() {
		var reportAdmin = $('.report-admin');
        reportAdmin.off();
        reportAdmin.on('click', function() {
        	resetReportChoicesToggles();
            $('#report-modal').modal('show');
            reviewSelected = $(this).closest(".review.element").attr("id");
        });

        var replyChoiceToggle = $('#reply-choice-toggle');
        var reportChoiceToggle = $('#report-choice-toggle');
        var notClientChoiceToggle = $('#not-client-choice-toggle');
        var processChoiceToggle = $('#process-choice-toggle');
        replyChoiceToggle.off();
        reportChoiceToggle.off();
        notClientChoiceToggle.off();
        processChoiceToggle.off();

        toggleVisibilityOfChoiceDescription(replyChoiceToggle, '#reply-choice-name-additional-description');
        toggleVisibilityOfChoiceDescription(reportChoiceToggle, '#report-choice-name-additional-description');
        toggleVisibilityOfChoiceDescription(notClientChoiceToggle, '#not-client-choice-name-additional-description');
        toggleVisibilityOfChoiceDescription(processChoiceToggle, '#process-choice-name-additional-description');

        var replyChoiceButton = $('#reply-choice-button');
        var reportChoiceButton = $('#report-choice-button');
        var notClientChoiceButton = $('#not-client-choice-button');
        var processChoiceButton = $('#process-choice-button');
        replyChoiceButton.off();
        reportChoiceButton.off();
        processChoiceButton.off();
        replyChoiceButton.on('click', replyToReviewReportOption);
        reportChoiceButton.on('click', reportReviewOption);
        notClientChoiceButton.on('click', defamatoryProcessReviewOption);
        processChoiceButton.on('click', defamatoryProcessReviewOption);
    }

    function initRequestReviewerDetails() {
        var requestDetails = $('.request-details');
        requestDetails.on('click', function() {
            $('#request-response-error-message').addClass("hidden");
            $('#reviewers-details-modal').modal('show');
            reviewSelected = $(this).closest(".review.element").attr("id");
        });

        var requestButton = $('#reviewers-details-button');
        requestButton.on('click', requestReviewerDetails);
	}

    function initRemovingBinds() {
        var removeReview = $('.remove-solicitor-review');
        removeReview.off();
        removeReview.on('click', function() {
            reviewSelected = $(this).closest(".review.element").attr("id");

            var _csrf = $("[name='_csrf']").val();
            $.ajax({
                url: "/solicitor/reviews/remove",
                type: "POST",
                data: { _csrf: _csrf, reviewId: reviewSelected },
                dataType: 'text',
                success: function(data) {
                    cleanSelectedReview();
                    if (data == "true") {
                        var currentPage = $('.review-page-used').first().text();
                        refreshReviews(currentPage, false);
                    }
                },
                error: function () {
                    cleanSelectedReview();
                }
            });
        });
    }

    function initRemovingPeerReviewBinds() {
        var removeReview = $('.remove-peer-solicitor-review');
        removeReview.off();
        removeReview.on('click', function() {
            reviewSelected = $(this).closest(".row.review").attr("id");

            var _csrf = $("[name='_csrf']").val();
            $.ajax({
                url: "/solicitor/reviews/remove-peer",
                type: "POST",
                data: { _csrf: _csrf, reviewId: reviewSelected },
                dataType: 'text',
                success: function(data) {
                    cleanSelectedReview();
                    if (data == "true") {
                        var currentPage = $('.review-page-used').first().text();
                        refreshReviews(currentPage, false);
                    }
                },
                error: function () {
                    cleanSelectedReview();
                }
            });
        });
    }

    function toggleVisibilityOfChoiceDescription(toggle, descriptionId) {
        toggle.on('click', function() {
            $(descriptionId).toggle('fast', function() {
                if (toggle.hasClass('fa-plus-circle')) {
                    toggle.removeClass('fa-plus-circle').addClass('fa-minus-circle');
                } else {
                    toggle.removeClass('fa-minus-circle').addClass('fa-plus-circle');
                }
            });
        });
	}

    function resetReportChoicesToggles() {
        var replyChoiceToggle = $('#reply-choice-toggle');
        var reportChoiceToggle = $('#report-choice-toggle');
        var processChoiceToggle = $('#process-choice-toggle');

        if (replyChoiceToggle.hasClass('fa-minus-circle')) {
        	replyChoiceToggle.trigger('click');
        }

        if (reportChoiceToggle.hasClass('fa-minus-circle')) {
            reportChoiceToggle.trigger('click');
        }

        if (processChoiceToggle.hasClass('fa-minus-circle')) {
            processChoiceToggle.trigger('click');
        }

        $('#report-response-error-message').attr("hidden","true");
	}

	function replyToReviewReportOption() {
        if(reviewSelected && reviewSelected.length > 0) {
            var responseButton = $("#" + reviewSelected).find("#add-response-button");
            var response = $("#" + reviewSelected).find(".response-background");
            $('#report-modal').modal('hide');
            $("html, body").animate({
                scrollTop: response.offset().top
            }, 0);
            responseButton.trigger("click");

            cleanSelectedReview();
        }
	}

	function reportReviewOption() {
        if(reviewSelected && reviewSelected.length > 0) {
            var _csrf = $("[name='_csrf']").val();
            $.ajax({
                url: "/solicitor/reviews/report",
                type: "POST",
                data: { _csrf: _csrf, reviewId: reviewSelected },
                dataType: 'text',
                success: function(a) {
                    $('#report-modal').modal('hide');
                    cleanSelectedReview();
                    $('#report-confirmation-modal').modal('show');
                },
                error: function () {
                    $('#report-response-error-message').toggleClass('hidden');
                }
            });
        }
	}

    function requestReviewerDetails() {
        if(reviewSelected && reviewSelected.length > 0) {
            var _csrf = $("[name='_csrf']").val();
            $.ajax({
                url: "/solicitor/reviews/reviewer-details",
                type: "POST",
                data: { _csrf: _csrf, reviewId: reviewSelected },
                dataType: 'text',
                success: function() {
                    $('#reviewers-details-modal').modal('hide');
                    cleanSelectedReview();
                    $('#reviewers-details-confirmation-modal').modal('show');
                },
                error: function () {
                    $('#request-response-error-message').toggleClass('hidden');
                }
            });
        }
    }

    function defamatoryProcessReviewOption() {
        if(reviewSelected && reviewSelected.length > 0) {
        	window.location = "/solicitor/reviews/defamatory-process?reviewId=" + reviewSelected;
        }
    }

	function cleanSelectedReview() {
		reviewSelected = null;
	}
	
	function addResponse() {
		var target = $("#response-div")
		
		var container = $(this).closest("#response-container")
		target.show();
		
		
		target.clone().appendTo(container);
		target.hide();
	}
	
	function refreshReviews(page, firstTime) {

		$("#renderReviews").fadeOut("fast");

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

		var fromDate = +new Date($("#from-date").val());

		if(isNaN(fromDate) || fromDate < 0) {
			fromDate = 0;
		}


        switch(reviewsType) {
            case "solicitorReviews":
                var url = "/reviews/solicitor/refresh?page="+page+"&solicitorId="+getSolicitorId();
                break;
            case "teamReviews":
                var url = "/reviews/team/refresh?page="+page+"&teamId="+getTeamId();
                break;
            case "firmReviews":
                var url = "/reviews/refresh?filter=recent&longTimestamp=" + fromDate + "&showExcellent=" + showExcellent + "&showGood=" + showGood + "&showAverage=" + showAverage + "&showPoor=" + showPoor + "&showAwful=" + showAwful + "&excludeResponded=" + excludeResponded + "&areaOfLaw=" + areaOfLaw + "&location=" + location + "&solicitorId=" + solicitor + "&team=" + team + "&page=" + page;
                break;
            case "peerReviews":
                var url = "/reviews/solicitor/peer-refresh?page="+page+"&solicitorId="+getSolicitorId();
                break;
        }
		$('#renderReviews').load(url, function () {
			$(".rating").rating({min:0, max:5, step:0.5, size:'xs', readonly:true});
			initEditResponseBinds();
			initPageBinds();
			initReportingBinds();
			initRequestReviewerDetails();
            initRemovingBinds();
            initRemovingPeerReviewBinds();
            initAreaOfLawChange();
            initSolicitorsChange();
            setAreasOfLawColors();
			$("#renderReviews").fadeIn("fast", function() {
                $.getScript('https://connect.facebook.net/en_GB/sdk.js', function(){
                    initFacebookSharing()
                });
            });
		});
	}

    function initFacebookSharing() {
        FB.init({
            appId: '660972734008077',
            autoLogAppEvents : true,
            xfbml            : true,
            version: 'v2.12'
        });
        $('.btn-facebook').removeAttr('disabled');

        $('.btn-facebook').click(function() {
        	var branchUrl = $(this).parent().parent().find('.review-branch-url').val();
        	var reviewRating = $(this).parent().parent().find('.stars').val();
        	var reviewAuthor = $(this).parent().parent().find('.review-author').text();
        	var reviewTitle = $(this).parent().parent().find('.review-title').text();
            FB.ui({
                method: 'share',
                href: branchUrl,
                quote: "We've had a " + reviewRating + "* review from " + reviewAuthor + ": " + reviewTitle + " @reviewsolicitors",
                hashtag: "#reviewsolicitors"
            });
        });
    }

    function getSolicitorId() {
		return $('#solicitor-id').text();
	}

    function getTeamId() {
        return $('#team-id').text();
    }

	function initAreaOfLawChange() {
	    $('.show-change-area-of-law-field').click(function (e) {
            e.preventDefault();
            $(this).prevAll('.area-of-law-question-select').first().show();
            $(this).next('.save-area-of-law').show();
            $(this).hide();
        });

        $('.save-area-of-law').click(function (e) {
            e.preventDefault();
            let buttonClicked = $(this);

            let areaOfLawName = $(this).prevAll('.area-of-law-question-select').first().val();
            let areaOfLawId = $(this).prevAll('.area-of-law-field').first().val();
            $(this).prevAll('.area-of-law-question-select').first().hide();
            $(this).prevAll('.show-change-area-of-law-field').first().show();
            $(this).hide();

            $(this).parent().find('.area-of-law-field').val('');
            $(this).parent().trigger("reset");

            if (areaOfLawName && areaOfLawId) {
                var _csrf = $("[name='_csrf']").val();
                var reviewId = $(this).closest(".review").attr("id");
                $.ajax({
                    url: "/solicitor/update-review-area-of-law",
                    type: "POST",
                    data: {_csrf: _csrf, reviewId: reviewId, areaOfLawId: areaOfLawId},
                    success: function() {
                        if (buttonClicked.parent().find('.area-of-law-name').length > 0) {
                            buttonClicked.parent().find('.area-of-law-name').remove();
                        }

                        areaOfLawName = areaOfLawName.split('-')[0].trim().toUpperCase();
                        buttonClicked.parent().prepend('<input type="button" class="btn-area-of-law area-of-law-name" value="' + areaOfLawName + '">');
                        buttonClicked.prevAll('.show-change-area-of-law-field').first().text('Add or amend this area of law');
                        setAreasOfLawColors();
                    }
                });
            }
        });

        $("form.amend-area-of-law-form").submit(function(e) {
            $(this).find('.save-area-of-law').click();
            return false;
        });

        if ($("input.area-of-law-question-select").length > 0) {
            $("input.area-of-law-question-select").each(function(i) {
                let field = $("input.area-of-law-question-select:eq(" + i + ")");
                let selected = false;

                field.on('input', function() {
                    if (!selected) {
                        field.parent().find('.area-of-law-field').val('');
                    }
                    selected = false;
                });

                field.autocomplete({
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
                                        label : item.name,
                                        value: item.name,
                                        id: item.id
                                    };
                                }));
                            },
                            error: function (xmlHttpRequest, textStatus, errorThrown) {
                                console.log(textStatus + ', ' + errorThrown);
                            }
                        });
                    },
                    select: function (event, ui) {
                        $(".area-of-law-field:eq(" + i + ")").val(ui.item.id);
                        selected = true;
                    },
                    messages: {
                        noResults: '',
                        results: function () {
                        }
                    },
                    appendTo: '.area-of-law-question-container:eq(' + i + ')',
                    delay: 400,
                    minLength: 2
                });
            });
        }
    }

    function initSolicitorsChange() {
        let firmId = $("input#firm-id").val();
        let photoUrl;

        $('.show-solicitor-field').click(function (e) {
            e.preventDefault();
            $(this).prevAll('.solicitor-select').first().show();
            $(this).hide();
        });

        $('.show-branch-field').click(function (e) {
            e.preventDefault();
            $(this).parent().next('form.change-branch-form').show();
            $(this).parent().hide();
        });

        $('.save-branch').click(function (e) {
            e.preventDefault();
            let buttonClicked = $(this);
            let branchId = buttonClicked.prevAll('#reviewBranchId').val();
            let branchName = buttonClicked.prevAll('#reviewBranchId').children('option:selected').text();

            if (branchId) {
                var _csrf = $("[name='_csrf']").val();
                var reviewId = $(this).closest(".review").attr("id");

                $.ajax({
                    url: "/solicitor/reviews/change-branch",
                    type: "POST",
                    data: {_csrf: _csrf, reviewId: reviewId, branchId: branchId},
                    success: function() {
                        buttonClicked.parent().prevAll('.branch-info').children('.name-of-branch').text(branchName);
                        buttonClicked.parent().prevAll('.branch-info').show();
                        buttonClicked.parent().hide();
                    }
                });
            }
        });

        $('.save-solicitor').click(function (e) {
            e.preventDefault();
            let buttonClicked = $(this);

            let solicitorName = $(this).prevAll('.solicitor-select').first().val().trim();
            let solicitorId = $(this).prevAll('.solicitor-field').first().val();
            $(this).prevAll('.solicitor-select').first().hide();
            $(this).prevAll('.show-solicitor-field').first().show();
            $(this).hide();

            $(this).parent().find('.solicitor-field').val('');
            $(this).parent().trigger("reset");

            if (solicitorId) {
                var _csrf = $("[name='_csrf']").val();
                var reviewId = $(this).closest(".review").attr("id");

                var listOfNames = $(this).parent().parent().find('p.name-of-solicitor').map(function() {
                    return $(this).text().trim().toUpperCase();
                }).get();

                if (listOfNames.indexOf(solicitorName.toUpperCase()) <= -1) {
                    $.ajax({
                        url: "/solicitor/reviews/add-solicitor",
                        type: "POST",
                        data: {_csrf: _csrf, reviewId: reviewId, solicitorName: solicitorName, solicitorId: solicitorId},
                        success: function() {
                            if (!photoUrl) {
                                photoUrl = '/assets/img/individual-solicitors/nophoto.png';
                            }
                            buttonClicked.parent().parent().find('div.solicitor-list').append('<div class="avatarInfo">\n' +
                                '<div class="avatar"><img src="' + photoUrl + '"/></div>\n' +
                                '<p class="name-of-solicitor">' + solicitorName + '</p>\n' +
                                '<p class="id-of-solicitor" style="display: none">' + solicitorId + '</p>\n' +
                                '<i class="fa fa-times-circle fa-2x remove-solicitor remove-solicitor-from-review"></i>\n' +
                                '</div>');
                            bindRemovingSolicitors();
                        }
                    });
                }
            }
        });

        $("form.add-solicitor-form, form.change-branch-form").submit(function(e) {
            return false;
        });

        if ($("input.solicitor-select").length > 0) {
            $("input.solicitor-select").each(function(i) {
                let field = $("input.solicitor-select:eq(" + i + ")");
                let selected = false;

                field.on('input', function() {
                    if (!selected) {
                        field.parent().find('.solicitor-field').val('');
                        photoUrl = '';
                        field.nextAll('.save-solicitor').hide();
                    }
                    selected = false;
                });

                field.autocomplete({
                    source: function (request, response) {
                        $.ajax({
                            url: serviceUrl + "/autocomplete-solicitor/" + firmId,
                            type: 'GET',
                            cache: false,
                            data: request,
                            dataType: 'json',
                            success: function (json) {
                                response($.map(json, function (item) {
                                    return {
                                        label : item.name,
                                        value: item.name,
                                        id: item.id,
                                        photoUrl: item.photoUrl
                                    };
                                }));
                            },
                            error: function (xmlHttpRequest, textStatus, errorThrown) {
                                console.log(textStatus + ', ' + errorThrown);
                            }
                        });
                    },
                    select: function (event, ui) {
                        $(".solicitor-field:eq(" + i + ")").val(ui.item.id);
                        selected = true;
                        photoUrl = ui.item.photoUrl;
                        $(".solicitor-field:eq(" + i + ")").nextAll('.save-solicitor').show();
                    },
                    messages: {
                        noResults: '',
                        results: function () {
                        }
                    },
                    appendTo: '.solicitor-container:eq(' + i + ')',
                    delay: 400
                });
            });
        }

        bindRemovingSolicitors();
    }
	
	$(window).ready (function() {
		refreshReviews(1, true);
	});

    function setAreasOfLawColors() {
        var labels = $('.area-of-law-name');

        for (i = 0; i < labels.length; i++) {
            labels[i].style.background=getColorForAreaOfLaw(labels.eq(i).val());
        }
    }

    function bindRemovingSolicitors() {
        $('.remove-solicitor-from-review').click(function (e) {
            e.preventDefault();

            let buttonClicked = $(this);
            let _csrf = $("[name='_csrf']").val();
            let reviewId = buttonClicked.closest(".review").attr("id");
            let solicitorName = buttonClicked.parent().find('p.name-of-solicitor').first().text();
            let solicitorId = buttonClicked.parent().find('p.id-of-solicitor').first().text();
            $.ajax({
                url: "/solicitor/reviews/remove-solicitor",
                type: "POST",
                data: {_csrf: _csrf, reviewId: reviewId, solicitorId: solicitorId, solicitorName: solicitorName},
                success: function() {
                    buttonClicked.parent().remove();
                }
            });
        });
    }

    var firmId = $("input#firm-id").val();

    if ($("input#rvSolicitors").length > 0) {
        $("input#rvSolicitors").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: serviceUrl + "/autocomplete-solicitor/" + firmId,
                    type: 'GET',
                    cache: false,
                    data: request,
                    dataType: 'json',
                    success: function (json) {
                        response($.map(json, function (item) {
                            return {
                                label : item.name,
                                value: item.name,
                                id: item.id
                            };
                        }));
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
                        console.log(textStatus + ', ' + errorThrown);
                    }
                });
            },
            select: function (event, ui) {
                $('#selected-solicitor').val(ui.item.id);
                refreshReviews(1, false);
                var fromDate = +new Date($('#from-date').val());
                filterChart(fromDate);
            },
            change: function( event, ui ) {
                if(!$('#rvSolicitors').val()) {
                    $('#selected-solicitor').val(0);
                    refreshReviews(1, false);
                    var fromDate = +new Date($('#from-date').val());
                    filterChart(fromDate);
                }
            },
            messages: {
                noResults: '',
                results: function () {
                }
            },
            appendTo: '#solicitor-container',
            delay: 400
        });
    }
});

