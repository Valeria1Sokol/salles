$(document).ready(function() {
    var checkbox = $("#defamatory-form-acting-on-behalf");
    var hidden = $("#defamatory-form-claimant-info");

    handleCheckbox();

    checkbox.change(function() {
        handleCheckbox();
    });

    function handleCheckbox() {
        if (checkbox.is(':checked')) {
            hidden.show();
        } else {
            hidden.hide();
        }
    }
});