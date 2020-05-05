var addedSolicitors = 0;
var selectedSolicitorsIds = [];

function bindAddingSolicitors() {
    $('#add-solicitor').off();
    $('.rem-solicitor').off();

    $('#add-solicitor').on('click', function (e) {
        e.preventDefault();
        addedSolicitors++;

        $('#add-solicitor').parent().parent().parent().append('<div class="form5 solicitor_one">\n' +
            '                                <div class="rounded-circle">\n' +
            '                                    <img id="solicitor-photo-' + addedSolicitors + '" src="/assets/img/individual-solicitors/nophoto.png" alt="">\n' +
            '                                </div>\n' +
            '                                <div class="form-request">\n' +
            '                                    <p class="media">Solicitor involved <span>(optional)</span></p>\n' +
            '                                    <input type="text" id="solicitor-' + addedSolicitors + '" class="solicitor-input bordered" placeholder="Start typing solicitors name">\n' +
            '                                    <div id="solicitor-container-' + addedSolicitors + '" class="autocomplete-select-list"></div>\n' +
            '                                    <input class="rem-solicitor" type="button" value="Remove solicitor">\n' +
            '                                </div>\n' +
            '                            </div>');

        $('#add-solicitor').remove();
        addAutocomplete(addedSolicitors);
        bindAddingSolicitors();
    });

    $('.rem-solicitor').on('click', function (e) {
        e.preventDefault();
        var elementArray = $(this).parent().parent().children().first().children().first().attr('id').split("-");
        var removedElement = elementArray[elementArray.length - 1];

        var removedId = $(this).parent().parent().children('input[name="solicitors"]').val();
        if ($.isNumeric(removedId)) {
            selectedSolicitorsIds = selectedSolicitorsIds.filter(function (e) {
                return e !== parseInt(removedId);
            });
        }

        if (removedElement > 0) {
            $(this).parent().parent().remove();
        } else {
            $(this).parent().parent().children('input[name="solicitors"]').remove();
            $('#solicitor-0').val("");
            $('#solicitor-photo-0').attr('src', '/assets/img/individual-solicitors/nophoto.png');
            $(this).next().remove();
            $(this).remove();
        }
    });
}

function setHiddenFieldForSolicitor(addedSolicitorId, valueId) {
    if ($('#solicitor-' + addedSolicitorId).parent().parent().children("input[name='solicitors']").length < 1) {
        $('#solicitor-' + addedSolicitorId).parent().parent().append("<input name='solicitors' type='text' class='d-none' value='" + valueId + "'>");

        $('#solicitor-' + addedSolicitorId).parent().append('<input id="add-solicitor" type="button" value="Add another solicitor">');

        if (addedSolicitorId == 0) {
            $('#solicitor-' + addedSolicitorId).parent().append('<input class="rem-solicitor" type="button" value="Remove solicitor">');

        }
        bindAddingSolicitors();
    } else {
        var currentValue = $('#solicitor-' + addedSolicitorId).parent().parent().children("input[name='solicitors']").val();
        if ($.isNumeric(currentValue)) {
            selectedSolicitorsIds = selectedSolicitorsIds.filter(function (e) {
                return e !== parseInt(currentValue);
            });
        }
        $('#solicitor-' + addedSolicitorId).parent().parent().children("input[name='solicitors']").val(valueId);
    }
}

$("#requestsPeriod").change(function() {
    var selectedPeriod = $(this).val();
    var fragment = $('#reviewRequestsFragment');
    fragment.attr("style", "align-items: center;");
    fragment.html('<img src="/assets/img/solicitor/review-requests-spinner.gif" style="width: fit-content;">');

    $.ajax({
        url: "/solicitor/single-client-request/" + selectedPeriod,
        type: "GET",
        dataType: "html",
        success: function (data) {
            fragment.removeAttr("style");
            fragment.replaceWith(data);
        },
        error: function (xhr, status) {
            console.error("There was a problem getting review requests data.");
        }
    });
});

$("#requestsPeriodForLinks").change(function() {
    var selectedPeriod = $(this).val();
    var fragment = $('#reviewRequestsFragment');
    fragment.attr("style", "align-items: center;");
    fragment.html('<img src="/assets/img/solicitor/review-requests-spinner.gif" style="width: fit-content;">');

    $.ajax({
        url: "/solicitor/single-client-link/" + selectedPeriod,
        type: "GET",
        dataType: "html",
        success: function (data) {
            fragment.removeAttr("style");
            fragment.replaceWith(data);
        },
        error: function (xhr, status) {
            console.error("There was a problem getting review requests data.");
        }
    });
});