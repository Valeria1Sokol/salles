$('#resend-set-passwords-for-firm').click(function(e) {
    var _csrf = $("[name='_csrf']").val();
    var id = $("#firmId").val();
    var button = $(this);
    $.ajax({
        url: "/admin/firm/resend-activate",
        data: {_csrf: _csrf, id: id},
        type: "POST",
        success: function(a) {
            button.remove();
        }
    });
});