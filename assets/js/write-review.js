var selectedAreaOfLaw = 0;
var addedSolicitors = 0;
var selectedSolicitorsIds = [];

$( '.paper-review-upload' ).each( function() {
    var $input	 = $( this ),
        $label	 = $input.next( 'label' ),
        labelVal = $label.html();

    $input.on( 'change', function( e )
    {
        var fileName = '';

        if( this.files && this.files.length > 1 )
            fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
        else if( e.target.value )
            fileName = e.target.value.split( '\\' ).pop();

        if( fileName )
            $label.html( fileName );
        else
            $label.html( labelVal );
    });

    // Firefox bug fix
    $input
        .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
        .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
});

function showClassBySearchId(searchId) {
    $('.review-question').hide();

    if(selectedAreaOfLaw != searchId) {
        $('.review-question').find(':radio').prop( "checked", false );
        selectedAreaOfLaw = searchId;
    }

    switch(searchId) {
        case "2":
            $('.question-business-litigation').show();
            break;
        case "11":
            $('.question-conveyancing').show();
            break;
        case "9":
            $('.question-criminal').show();
            break;
        case "10":
            $('.question-family').show();
            break;
        case "12":
            $('.question-immigration').show();
            break;
        case "7":
            $('.question-personal-injury').show();
            break;
        case "29":
            $('.question-probate').show();
            $('.question-wills').show();
            break;
    }
}


var show=false;
function showFunc(){
    if(!show){
        show=true;
        $('.content-integrity').show()
    }else{
        show=false;
        $('.content-integrity').hide();
    }
}

function showNegative() {
    $('.positive-phrase').parent().hide();
    $('.negative-phrase').parent().show();
    $('.positive-phrase').prop( "checked", false );
}

function showPositive() {
    $('.positive-phrase').parent().show();
    $('.negative-phrase').parent().hide();
    $('.negative-phrase').prop( "checked", false );
}

function refreshPhrases(value) {
    switch( value ) {
        case '1' : showNegative(); break;
        case '2' : showNegative(); break;
        case '3' : showPositive(); break;
        case '4' : showPositive(); break;
        case '5' : showPositive(); break;
        default: '';
    }
}

$('.select-rating input.overall-star').change(function(e) {
    var $inp = $(this);
    refreshPhrases($inp.val());
});

refreshPhrases($('.select-rating input:checked').val());

function bindAddingSolicitors() {
    $('#add-solicitor').off();
    $('.remove-solicitor').off();

    $('#add-solicitor').on('click', function (e) {
        e.preventDefault();
        addedSolicitors++;

        $('#add-solicitor').parent().parent().parent().append('<div class="solicitor_one clearfix">\n' +
            '                            <div class="rounded-circle">\n' +
            '                                <img id="solicitor-photo-' + addedSolicitors + '" src="/assets/img/individual-solicitors/nophoto.png" alt="">\n' +
            '                            </div>\n' +
            '                            <div id="solicitors-group" class="custom_select">\n' +
            '                                <input id="solicitor-' + addedSolicitors + '" class="solicitor-input bordered" type="text" placeholder="Enter name of the solicitor" />\n' +
            '                                <div id="solicitor-container-' + addedSolicitors + '" class="autocomplete-select-list"></div>\n' +
            '                            </div>\n' +
            '                            <h4><a class="remove-solicitor" href="">Click here </a>to remove this solicitor</h4>\n' +
            '                        </div>');
        $('#add-solicitor').parent().remove();
        addAutocomplete(addedSolicitors);
        bindAddingSolicitors();
    });

    $('.remove-solicitor').on('click', function (e) {
        e.preventDefault();
        var elementArray = $(this).parent().parent().children().first().children().first().attr('id').split("-");
        var removedElement = elementArray[elementArray.length - 1];

        var removedId = $(this).parent().parent().children('#solicitors-group').children('input[name="solicitors"]').val();
        if ($.isNumeric(removedId)) {
            selectedSolicitorsIds = selectedSolicitorsIds.filter(function (e) {
                return e !== parseInt(removedId);
            });
        }

        if (removedElement > 0) {
            $(this).parent().parent().remove();
        } else {
            $(this).parent().parent().children('#solicitors-group').children('input[name="solicitors"]').remove();
            $('#solicitor-0').val("");
            $('#solicitor-photo-0').attr('src', '/assets/img/individual-solicitors/nophoto.png');
            $(this).parent().next().remove();
            $(this).parent().remove();
        }
    });
}

function setHiddenFieldForSolicitor(addedSolicitorId, valueId) {
    if ($('#solicitor-' + addedSolicitorId).parent().children("input[name='solicitors']").length < 1) {
        $('#solicitor-' + addedSolicitorId).parent().append("<input name='solicitors' type='text' class='d-none' value='" + valueId + "'>");

        if (addedSolicitorId == 0) {
            $('#solicitor-' + addedSolicitorId).parent().parent().append('<h4><a class="remove-solicitor" href="">Click here </a>to remove this solicitor</h4>');
        }

        $('#solicitor-' + addedSolicitorId).parent().parent().append('<h4><a id="add-solicitor" href="">Click here </a>if another solicitor assisted you in the matter</h4>');
        bindAddingSolicitors();
    } else {
        var currentValue = $('#solicitor-' + addedSolicitorId).parent().children("input[name='solicitors']").val();
        if ($.isNumeric(currentValue)) {
            selectedSolicitorsIds = selectedSolicitorsIds.filter(function (e) {
                return e !== parseInt(currentValue);
            });
        }
        $('#solicitor-' + addedSolicitorId).parent().children("input[name='solicitors']").val(valueId);
    }
}

if ($("input#area-of-law-question-select").length > 0) {
    $("input#area-of-law-question-select").autocomplete({
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
            $("#area-of-law-field").val(ui.item.id);

            var areaOfLawId = ui.item.id;
            var searchId = "";

            for (var i = 0; i < areasOfLaw.length; i++) {
                if(areasOfLaw[i].label == areaOfLawId) {
                    searchId = areasOfLaw[i].value;
                    break;
                }
            }

            showClassBySearchId(searchId);
        },
        messages: {
            noResults: '',
            results: function () {
            }
        },
        appendTo: '#area-of-law-question-container',
        delay: 400,
        minLength: 2
    });
}

function formatAmount(n) {
    n = parseInt(n);
    return "£" + n.toFixed().replace(/./g, function(c, i, a) {
        return i > 0 && (a.length - i) % 3 === 0 ? "," + c : c;
    });
}

function addOptionToFinalPayment(previousValue, expectedValue, factor) {
    var lowerValue = parseInt(previousValue) + 1;
    var upperValue = (expectedValue * factor).toFixed();
    $('#finalPayment').append(new Option(formatAmount(lowerValue) + " - " + formatAmount(upperValue), upperValue, false, false));
    return upperValue;
}

function updateFinalPaymentField(value) {
    $('#finalPayment').empty();
    $('#finalPayment').append(new Option("Select value range", "", true, true));

    if (value == "") {
        $('#finalPayment').trigger('change');
        $('#finalPayment').attr('disabled',true);
        return;
    }

    $('#finalPayment').attr('disabled',false);

    //values 0 - 1.0
    var maxValue = addOptionToFinalPayment(-1, value, 1);

    //values 1.01 – 1.3
    maxValue = addOptionToFinalPayment(maxValue, value, 1.3);

    //values 1.31 – 1.5
    maxValue = addOptionToFinalPayment(maxValue, value, 1.5);

    //values 1.51 – 2.0
    maxValue = addOptionToFinalPayment(maxValue, value, 2);

    //values 2.01 – 2.5
    maxValue = addOptionToFinalPayment(maxValue, value, 2.5);

    //values 2.51 – 3.5
    maxValue = addOptionToFinalPayment(maxValue, value, 3.5);

    $('#finalPayment').append(new Option(formatAmount(maxValue) + "+", (value * 4.5).toFixed(), false, false));

    $('#finalPayment').trigger('change');
}

$('#expectedPayment').on('select2:select', function (e) {
    updateFinalPaymentField(e.params.data.id);
});

$('#finalPayment').on('select2:select', function (e) {
    var value = e.params.data.id;

    if ((value / $("#expectedPayment").val()) > 1) {
        $('.additional-work-question').show();
    } else {
        $('.additional-work-question').hide();
        $('.additional-work-radios').find(':radio').prop( "checked", false );
    }
});

function showAdditionalWorkQuestionIfNecessary(value) {
    if ((value / $("#expectedPayment").val()) > 1) {
        $('.additional-work-question').show();
    }
}

$('#sign-in-toggle').click(function (e) {
    e.preventDefault();

    $('#signup').val("false");
    $('#signin').val("true");
    $('div.signin').show();
    $('div.signup').hide();
});

$('#sign-up-toggle').click(function (e) {
    e.preventDefault();

    $('#signin').val("false");
    $('#signup').val("true");
    $('div.signup').show();
    $('div.signin').hide();
});

$('.submit-facebook').click(function (e) {
    e.preventDefault();

    $('div.signup').hide();
    $('div.signin').hide();
    $('#signup').val("false");
    $('#signin').val("false");
    $('#socialNetwork').val("facebook");
    $('form.writeReviewForm').submit();
});

function shuffleReviewTags() {
    var container = document.getElementById("review-tags");
    var elementsArray = Array.prototype.slice.call(container.getElementsByClassName('review-tag'));
    elementsArray.forEach(function(element){
        container.removeChild(element);
    });
    shuffleArray(elementsArray);
    elementsArray.forEach(function(element){
        container.appendChild(element);
    });
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

shuffleReviewTags();

