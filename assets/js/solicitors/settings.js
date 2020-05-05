$(document).ready(function() {
    $('.checkmark, .labelCheck').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var thisCheckbox;
        if ($(this).hasClass("checkmark")) {
            thisCheckbox = $(this).prevAll('input');
        } else {
            thisCheckbox = $(this).find('input');
        }

        if (thisCheckbox) {
            var originalValue = thisCheckbox.prop("checked");
            var userCheckboxes = $(this).closest('.tittle').find('input');
            userCheckboxes.prop("checked", false);
            thisCheckbox.prop("checked", !originalValue);
        }

        return true;
    });

    $('.search-link').click(function (e) {
       $(this).closest('form').submit();
    });

    $('.submit-column').click(function (e) {
       $(this).closest('form').submit();
    });
});