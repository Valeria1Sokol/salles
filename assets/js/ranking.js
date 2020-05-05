var additionalCriteriaForm = $('#ranking-page-additional-criteria-form');

$("#av1").click(function() {
    if(!$("#av1").is(':checked')) {
        if ($("#av2").is(':checked')) {
            $('#av2').prop('checked', false);
        }
        if ($("#av3").is(':checked')) {
            $('#av3').prop('checked', false);
        }
    }
});

$("#av2").click(function() {
    if(!$("#av2").is(':checked') && $("#av3").is(':checked')) {
        $('#av3').prop('checked', false);
    }
});

$(".criteria-form").click(function() {
    $("#preloader").show();
    additionalCriteriaForm.submit();
});

function openNav() {
    $('#ranking-map').show();
    initializeRankingMap();
}

function closeNav() {
    $('#ranking-map').hide();
}

function excludeNearby() {
    $('#exclude-nearby').prop('checked', true);
    $("#preloader").show();
    additionalCriteriaForm.submit();
}

function includeNearby() {
    $('#exclude-nearby').prop('checked', false);
    $("#preloader").show();
    additionalCriteriaForm.submit();
}