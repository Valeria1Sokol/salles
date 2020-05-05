$("#requestsPeriod").change(function() {
    var selectedPeriod = $(this).val();
    var fragment = $('#reviewRequestsFragment');
    fragment.attr("style", "text-align: center;");
    fragment.html('<img src="/assets/img/solicitor/review-requests-spinner.gif" style="width: fit-content;">');

    $.ajax({
        url: "/solicitor/get-more-reviews/" + selectedPeriod,
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