$('.add-non-sra').click(function(e) {
    $('#addNewSolicitor').prop('checked', true);
    $('#addNewSolicitor').val( true);
    $('.linked-individual-solicitor').hide();
    $('.add-non-sra').hide();
    $('.link-individual-solicitor').show();
    $('#addNewSolicitor').parent().before('<div class="new-solicitor">\n' +
        '<label for="jobTitle">Job title </label>\n' +
        '<input type="text" id="jobTitle" name="jobTitle" required>\n' +
        '</div>');

    $('#individual-solicitor-select').val('');
    $('#individual-solicitor-field').val('');
    $('#sraSolicitor1').prop('checked', false);
});

$('.link-individual-solicitor').click(function(e) {
    $('.linked-individual-solicitor').show();
    $('.add-non-sra').show();
    $('.link-individual-solicitor').hide();
    $('.new-solicitor').remove();
    $('#addNewSolicitor').prop('checked', false);
    $('#addNewSolicitor').val( false);
});

$('#resend-set-password').click(function(e) {
    var _csrf = $("[name='_csrf']").val();
    var id = $("#id").val();
    var button = $(this);
    $.ajax({
        url: "/admin/solicitor/resend-activate",
        data: {_csrf: _csrf, id: id},
        type: "POST",
        success: function(a) {
            button.remove();
        }
    });
});

$('#addNewSolicitor').prop('checked', false);
$('#addNewSolicitor').val( false);