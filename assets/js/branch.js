//loadScriptThen('/assets/js/ext/jquery.validate.additional-methods.min.js', function() { });

//Request Callback form validator
var setRequestCallbackValidation = function() {
    $("#requestCallback").clone(false).appendTo('div#callback-modal');
    $('.requestCallback').first().remove();

    return $("#requestCallback").validate({

        rules: {
            name: {
                required: true,
                maxlength: 100,
                minlength: 2
            },
            number: {
                required: true,
                minlength: 10,
                maxlength: 12
            },
            preferredTime: {
                required: true,
                maxlength: 50,
                minlength: 2
            },
            email: {
                email: true
            },
            message: {
                minlength: 10
            }
        },
        ignore: '',
        //Hidden elements won't be validated otherwise (our radiobuttons are actually hidden).
        wrapper: 'p',
        messages: {
            name: {
                required: "Name is required.",
                maxlength: "Name is too long.",
                minlength: "Name field requires at least 2 characters."
            },
            number: {
                required: "Contact number is required",
                minlength: "Please enter at least 10 numbers.",
                maxlength: "Please enter no more than 12 number.",
            },
            preferredTime: {
                required: "Preferred time is required"
            },
            email: {
                required: "Email is required.",
                email: "Email format is invalid"
            }
        }
    });
};

var setAppointmentSubmitButton = function() {
    $('#appointment-submit-button').click(function (e) {
        var firmTypeValue = $('#firmType').val();
        if (firmTypeValue === 'RLEADER') {
            $('#bookAppointment').submit();
        } else {
            $('#appointment-submit-button').css('visibility', 'hidden');
            $('#wrong-firm-type-error').show();
        }
    });

    $('#appointment-form-send-to-other-firm').click(function (e) {
        e.preventDefault();
        $('#sendToOtherFirm').val('true');
        $('#bookAppointment').submit();
    });
};

var prepareHourSelector = function(date) {
    filterAvailableHoursInAppointmentDatepickerByCurrentDate(date);
    filterAvailableHoursInAppointmentDatepickerByWorkingHours(date);

    $('input[name="hour"]').prop("checked", false);
    $('input[name="hour"]:not([disabled]):first').prop("checked", true);
};

var filterAvailableHoursInAppointmentDatepickerByWorkingHours = function(date) {
    if (workingTime && workingTime.length == 7) {
        var dayOfWeek = (date.getDay() || 7) - 1;

        $('#hour1').prop("disabled", $('#hour1').prop("disabled") || 900 < workingTime[dayOfWeek][0] || 900 >= workingTime[dayOfWeek][1]);
        $('#hour2').prop("disabled", $('#hour2').prop("disabled") || 930 < workingTime[dayOfWeek][0] || 930 >= workingTime[dayOfWeek][1]);
        $('#hour3').prop("disabled", $('#hour3').prop("disabled") || 1000 < workingTime[dayOfWeek][0] || 1000 >= workingTime[dayOfWeek][1]);
        $('#hour4').prop("disabled", $('#hour4').prop("disabled") || 1030 < workingTime[dayOfWeek][0] || 1030 >= workingTime[dayOfWeek][1]);
        $('#hour5').prop("disabled", $('#hour5').prop("disabled") || 1100 < workingTime[dayOfWeek][0] || 1100 >= workingTime[dayOfWeek][1]);
        $('#hour6').prop("disabled", $('#hour6').prop("disabled") || 1130 < workingTime[dayOfWeek][0] || 1130 >= workingTime[dayOfWeek][1]);
        $('#hour7').prop("disabled", $('#hour7').prop("disabled") || 1200 < workingTime[dayOfWeek][0] || 1200 >= workingTime[dayOfWeek][1]);
        $('#hour8').prop("disabled", $('#hour8').prop("disabled") || 1230 < workingTime[dayOfWeek][0] || 1230 >= workingTime[dayOfWeek][1]);
        $('#hour9').prop("disabled", $('#hour9').prop("disabled") || 1300 < workingTime[dayOfWeek][0] || 1300 >= workingTime[dayOfWeek][1]);
        $('#hour10').prop("disabled", $('#hour10').prop("disabled") || 1330 < workingTime[dayOfWeek][0] || 1330 >= workingTime[dayOfWeek][1]);
        $('#hour11').prop("disabled", $('#hour11').prop("disabled") || 1400 < workingTime[dayOfWeek][0] || 1400 >= workingTime[dayOfWeek][1]);
        $('#hour12').prop("disabled", $('#hour12').prop("disabled") || 1430 < workingTime[dayOfWeek][0] || 1430 >= workingTime[dayOfWeek][1]);
        $('#hour13').prop("disabled", $('#hour13').prop("disabled") || 1500 < workingTime[dayOfWeek][0] || 1500 >= workingTime[dayOfWeek][1]);
        $('#hour14').prop("disabled", $('#hour14').prop("disabled") || 1530 < workingTime[dayOfWeek][0] || 1530 >= workingTime[dayOfWeek][1]);
        $('#hour15').prop("disabled", $('#hour15').prop("disabled") || 1600 < workingTime[dayOfWeek][0] || 1600 >= workingTime[dayOfWeek][1]);
        $('#hour16').prop("disabled", $('#hour16').prop("disabled") || 1630 < workingTime[dayOfWeek][0] || 1630 >= workingTime[dayOfWeek][1]);

        $('#hour1').next().css('color', ($('#hour1').prop("disabled") || 900 < workingTime[dayOfWeek][0] || 900 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour2').next().css('color', ($('#hour2').prop("disabled") || 930 < workingTime[dayOfWeek][0] || 930 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour3').next().css('color', ($('#hour3').prop("disabled") || 1000 < workingTime[dayOfWeek][0] || 1000 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour4').next().css('color', ($('#hour4').prop("disabled") || 1030 < workingTime[dayOfWeek][0] || 1030 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour5').next().css('color', ($('#hour5').prop("disabled") || 1100 < workingTime[dayOfWeek][0] || 1100 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour6').next().css('color', ($('#hour6').prop("disabled") || 1130 < workingTime[dayOfWeek][0] || 1130 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour7').next().css('color', ($('#hour7').prop("disabled") || 1200 < workingTime[dayOfWeek][0] || 1200 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour8').next().css('color', ($('#hour8').prop("disabled") || 1230 < workingTime[dayOfWeek][0] || 1230 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour9').next().css('color', ($('#hour9').prop("disabled") || 1300 < workingTime[dayOfWeek][0] || 1300 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour10').next().css('color', ($('#hour10').prop("disabled") || 1330 < workingTime[dayOfWeek][0] || 1330 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour11').next().css('color', ($('#hour11').prop("disabled") || 1400 < workingTime[dayOfWeek][0] || 1400 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour12').next().css('color', ($('#hour12').prop("disabled") || 1430 < workingTime[dayOfWeek][0] || 1430 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour13').next().css('color', ($('#hour13').prop("disabled") || 1500 < workingTime[dayOfWeek][0] || 1500 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour14').next().css('color', ($('#hour14').prop("disabled") || 1530 < workingTime[dayOfWeek][0] || 1530 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour15').next().css('color', ($('#hour15').prop("disabled") || 1600 < workingTime[dayOfWeek][0] || 1600 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
        $('#hour16').next().css('color', ($('#hour16').prop("disabled") || 1630 < workingTime[dayOfWeek][0] || 1630 >= workingTime[dayOfWeek][1]) ? '#adadad' : '#666');
    }
};

var filterAvailableHoursInAppointmentDatepickerByCurrentDate = function(date) {
    var today = new Date();

    if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
        $('#hour1').prop("disabled", date.getHours() >= 9 && date.getMinutes() > 0);
        $('#hour2').prop("disabled", date.getHours() > 9 || (date.getHours() == 9 && date.getMinutes() > 30));
        $('#hour3').prop("disabled", date.getHours() >= 10 && date.getMinutes() > 0);
        $('#hour4').prop("disabled", date.getHours() > 10 || (date.getHours() == 10 && date.getMinutes() > 30));
        $('#hour5').prop("disabled", date.getHours() >= 11 && date.getMinutes() > 0);
        $('#hour6').prop("disabled", date.getHours() > 11 || (date.getHours() == 11 && date.getMinutes() > 30));
        $('#hour7').prop("disabled", date.getHours() >= 12 && date.getMinutes() > 0);
        $('#hour8').prop("disabled", date.getHours() > 12 || (date.getHours() == 12 && date.getMinutes() > 30));
        $('#hour9').prop("disabled", date.getHours() >= 13 && date.getMinutes() > 0);
        $('#hour10').prop("disabled", date.getHours() > 13 || (date.getHours() == 13 && date.getMinutes() > 30));
        $('#hour11').prop("disabled", date.getHours() >= 14 && date.getMinutes() > 0);
        $('#hour12').prop("disabled", date.getHours() > 14 || (date.getHours() == 14 && date.getMinutes() > 30));
        $('#hour13').prop("disabled", date.getHours() >= 15 && date.getMinutes() > 0);
        $('#hour14').prop("disabled", date.getHours() > 15 || (date.getHours() == 15 && date.getMinutes() > 30));
        $('#hour15').prop("disabled", date.getHours() >= 16 && date.getMinutes() > 0);
        $('#hour16').prop("disabled", date.getHours() > 16 || (date.getHours() == 16 && date.getMinutes() > 30));

        $('#hour1').next().css('color', (date.getHours() >= 9 && date.getMinutes() > 0) ? '#adadad' : '#666');
        $('#hour2').next().css('color', (date.getHours() > 9 || (date.getHours() == 9 && date.getMinutes() > 30)) ? '#adadad' : '#666');
        $('#hour3').next().css('color', (date.getHours() >= 10 && date.getMinutes() > 0) ? '#adadad' : '#666');
        $('#hour4').next().css('color', (date.getHours() > 10 || (date.getHours() == 10 && date.getMinutes() > 30))  ? '#adadad' : '#666');
        $('#hour5').next().css('color', (date.getHours() >= 11 && date.getMinutes() > 0) ? '#adadad' : '#666');
        $('#hour6').next().css('color', (date.getHours() > 11 || (date.getHours() == 11 && date.getMinutes() > 30)) ? '#adadad' : '#666');
        $('#hour7').next().css('color', (date.getHours() >= 12 && date.getMinutes() > 0) ? '#adadad' : '#666');
        $('#hour8').next().css('color', (date.getHours() > 12 || (date.getHours() == 12 && date.getMinutes() > 30)) ? '#adadad' : '#666');
        $('#hour9').next().css('color', (date.getHours() >= 13 && date.getMinutes() > 0) ? '#adadad' : '#666');
        $('#hour10').next().css('color', (date.getHours() > 13 || (date.getHours() == 13 && date.getMinutes() > 30)) ? '#adadad' : '#666');
        $('#hour11').next().css('color', (date.getHours() >= 14 && date.getMinutes() > 0) ? '#adadad' : '#666');
        $('#hour12').next().css('color', (date.getHours() > 14 || (date.getHours() == 14 && date.getMinutes() > 30)) ? '#adadad' : '#666');
        $('#hour13').next().css('color', (date.getHours() >= 15 && date.getMinutes() > 0) ? '#adadad' : '#666');
        $('#hour14').next().css('color', (date.getHours() > 15 || (date.getHours() == 15 && date.getMinutes() > 30)) ? '#adadad' : '#666');
        $('#hour15').next().css('color', (date.getHours() >= 16 && date.getMinutes() > 0) ? '#adadad' : '#666');
        $('#hour16').next().css('color', (date.getHours() > 16 || (date.getHours() == 16 && date.getMinutes() > 30)) ? '#adadad' : '#666');
    } else {
        $('input[name="hour"]').prop("disabled", false);
        $('input[name="hour"]').next().css('color', '#666');
    }
};

//Request Callback form validator
var setBookAppointmentValidation = function() {
    $('#appointment-date').removeClass();
    $('button.ui-datepicker-trigger').remove();
    $("#bookAppointment").clone(false).appendTo('div#book-modal');
    $('.bookAppointment').first().remove();
    setAppointmentSubmitButton();
    setDatePicker();
    return $("#bookAppointment").validate({

        rules: {
            name: {
                required: true,
                maxlength: 100,
                minlength: 2
            },
            email: {
                email: true
            },
            number: {
                required: true,
                minlength: 8
            },
            message: {
                required: true,
                minlength: 10
            },
            hiddenRecaptchaAppointment: {
                required: function () {
                    if (grecaptcha.getResponse().length == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        ignore: '',
        //Hidden elements won't be validated otherwise (our radiobuttons are actually hidden).
        wrapper: 'p',
        messages: {
            name: {
                required: "Name is required.",
                maxlength: "Name has too many characters.",
                minlength: "Name field requires at least 2 characters."
            },
            number: {
                required: "Phone number is required.",
                minlength: "Please enter at least 8 characters.",
            },
            appointmentEmail: {
                required: "Email is required.",
                email: "Email format is invalid"
            },
            message: {
                required: "Please send a message with this request briefly explaining what you'd like to discuss.",
                minlength: "Please write a more descriptive message."
            },
            hiddenRecaptchaAppointment: {
                required: "Please confirm you're not a robot."
            }
        }
    });
};

var verifyAppointmentCallback = function() {
    $('#hiddenRecaptchaAppointment').valid();
};

var openAppointmentModal = function(e) {
    setBookAppointmentValidation();
    $('#book-modal').modal({
        minWidth :700,
        onShow:function(dialog){
            $(window).scrollTop(0);
            setTimeout(function(){
                dialog.data.find("input#focusme").focus();
                $('#simplemodal-overlay').click(function (e) {
                    $.modal.close();
                });
            },1000);
        }
    });
    grecaptcha.render('recaptchaAppointment', {
        'sitekey' : '6Ldfe3oUAAAAAGl8MgJBEG1cq3rcDuNy_1NCH1bl',
        'callback' : verifyAppointmentCallback,
    });
    return false;
};

var openCallbackModal = function(e) {
    setRequestCallbackValidation();
    $('#callback-modal').modal({
        minWidth :700,
        onShow:function(dialog){
            $(window).scrollTop(0);
            setTimeout(function(){
                $('#simplemodal-overlay').click(function (e) {
                    $.modal.close();
                });
            },1000);
        }
    });
    grecaptcha.render('recaptchaCallback', {
        'sitekey' : '6Ldfe3oUAAAAAGl8MgJBEG1cq3rcDuNy_1NCH1bl'
    });
    return false;
};

loadScriptThen('/assets/js/ext/jquery.simplemodal.js', function() {
    if($('.book-modal').length > 0) {
        $('.book-modal').click(function (e) {
            $('#simplemodal-appointment-container #widgetType').val('');
            $('#simplemodal-appointment-container #widgetIdentifier').val('');
            openAppointmentModal(e);
        });
        $('.open-callback').click(function (e) {
            openCallbackModal(e);
        });
    }
    if($('.bookClickableWidget').length > 0) {
    	$('.bookClickableWidget').click(function(e) {
    	    var widgetTypeValue = $('#simplemodal-appointment-container #appointmentWidgetType').text().trim();
    	    var widgetIdentifierValue = $('#simplemodal-appointment-container #appointmentWidgetIdentifier').text().trim();
    	    var firmType = $('#bookAppointment #firmType').val();
            var branch = $('#bookAppointment input[name="branchId"]').length > 0;
            var solicitor = $('#bookAppointment input[name="solicitorId"]').length > 0;
            $('#simplemodal-appointment-container #widgetType').val(widgetTypeValue);
            $('#simplemodal-appointment-container #widgetIdentifier').val(widgetIdentifierValue);

            $.ajax({
                type: 'POST',
                url: '/contact/appointment-widget/click',
                data: {
                    '_csrf': $('#simplemodal-appointment-container').find('input[name=_csrf]').val(),
                    'widgetIdentifier': widgetIdentifierValue,
                    'widgetType': widgetTypeValue,
                    'firmType': firmType,
                    'branch': branch,
                    'solicitor': solicitor
                },
                success: function(data) {
                    openAppointmentModal(e);
                }
            });
        });
    }
});

if($('.number-input').length > 0) {
	$('.number-input').each(function() {
	    $(this).keydown(function (e) {
	        // Allow: backspace, delete, tab, escape, enter and .
	        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
	             // Allow: Ctrl+A, Command+A
	            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
	             // Allow: home, end, left, right, down, up
	            (e.keyCode >= 35 && e.keyCode <= 40)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        // Ensure that it is a number and stop the keypress
	        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	            e.preventDefault();
	        }
		}); 
	});
}

var getWeekdayName = function(date, startsAtOne) {
    var dayOfWeek = date.getUTCDay();
    if(startsAtOne) dayOfWeek = dayOfWeek - 1;
    var weekdayName;
    switch(dayOfWeek) {
	case 1: weekdayName = "Monday"; break;
	case 2: weekdayName = "Tuesday"; break;
	case 3: weekdayName = "Wednesday"; break;
	case 4: weekdayName = "Thursday"; break;
	case 5: weekdayName = "Friday"; break;
	case 6: weekdayName = "Saturday"; break;
	case 0: weekdayName = "Sunday";
    }
    return weekdayName;
};

var getCurrentTimeAsNumber = function(date) {
    return (date.getHours() * 100) + date.getMinutes();
};

var setDatePicker = function() {
    var date = new Date();
    var minDate = 0;
    var currentTimeAsNumber = getCurrentTimeAsNumber(date);
    var dayOfWeek = (date.getDay() || 7) - 1;
    if (currentTimeAsNumber >= workingTime[dayOfWeek][1]
        || date.getHours() > 16
        || (date.getHours() == 16 && date.getMinutes() > 30)) {
        minDate = 1;
        date.setDate(date.getDate() + 1);
    }

    prepareHourSelector(date);

    $('#appointment-date').val($.datepicker.formatDate("dd/mm/yy", date));
    $('#datecopy').text($.datepicker.formatDate("dd/mm/yy", date));
    $("#weekday").text(getWeekdayName(date));
    $('#appointment-date').datepicker({
        showOn: "both",
        buttonText: "<i class='fa fa-calendar'></i>",
        dateFormat: "dd/mm/yy",
        minDate: minDate,
        defaultDate: $.datepicker.parseDate("dd mm yy", "31 8 2015"),
        beforeShowDay: function(date) {
            var day = (date.getDay() || 7) - 1;
            return [closedDays.indexOf(day) < 0];
        },
        onSelect: function (s) {
            var today = new Date();
            var date = $(this).datepicker('getDate');
            date.setHours(today.getHours(), today.getMinutes(), today.getSeconds());
            $("#weekday").text(getWeekdayName(date));
            $("#datecopy").text(s);
            prepareHourSelector(date);
        }
    }).off('focus').click(function () {
        $(this).datepicker('show');
    });
};

$(document).ready(function() {
    $('.image-gallery').slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        variableWidth: true
    });

    $('.additional-areas-of-law-btn').click(function (event) {
        event.preventDefault();

        $('.additional-ranking-area-of-law').show();
        $('.additional-areas-of-law-btn').hide();
    });

    function setAreasOfLawColors() {
        var labels = $('.ranking-area-of-law-name');

        for (i = 0; i < labels.length; i++) {
            var text = "";
            if (labels.eq(i).children('span').length > 0) {
                text = labels.eq(i).children('span').first().text();
            } else {
                text = labels.eq(i).text();
            }
            labels[i].style.background=getColorForAreaOfLaw(text);
        }
    }

    setAreasOfLawColors();

    function switchRankings() {
        var localRanking = $('.local-ranking');
        var nationalRanking = $('.national-ranking');

        if (localRanking.is(":hidden")) {
            nationalRanking.hide(10, "linear", function() {
               localRanking.show(10), "linear";
            });
        }

        if (nationalRanking.is(":hidden")) {
            localRanking.hide(10, "linear", function() {
                nationalRanking.show(10, "linear");
            });
        }
    }

    function bindRankingSlider() {
        var localRanking = $('.local-ranking');
        var nationalRanking = $('.national-ranking');
        if (localRanking.length > 0 && nationalRanking.length > 0) {
            localRanking.removeClass();
            localRanking.addClass("col-xs-6 ranking-line green local-ranking");
            nationalRanking.removeClass();
            nationalRanking.addClass("col-xs-6 ranking-line green national-ranking");
            localRanking.hide();
            localRanking.find('a').append(" law firms");

            setInterval(function(){
                switchRankings();
            }, 4000);
        }
    }

    if ($(window).width() <= 992) {
        bindRankingSlider();
    }
});


