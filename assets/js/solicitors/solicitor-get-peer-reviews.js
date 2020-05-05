$(document).ready(function() {
    $("#submit-single-peer").click(function() {

        $("#submit-single-peer").prop("disabled",true);


        $("body").css("cursor", "progress");

        $("#contact-single-peer").submit();

    });

    function getCSRFTokenValue() {
        var csrf = $('input[name=_csrf]').val();
        return csrf;
    }

    $("#contact-single-peer").on("submit", function() {

        var firstName = $("#contact-single-peer").find("#firstName").val();
        var surname = $("#contact-single-peer").find("#surname").val();
        var email = $("#contact-single-peer").find("#email").val();


        $.ajax({
            url: "/api/v1/send-single-peer-review",
            type: "POST",
            data: {firstName: firstName, surname: surname, email: email, _csrf: getCSRFTokenValue()},
            success:function(json) {
                var htmlToAdd = $("<tr> <td>" + firstName + "</td><td>" + surname + "</td><td>" + email + "</td> <td><i class='fa fa-check-circle' style='color:green;'></i></td>  </tr>");

                $("#history-table").append(htmlToAdd);

                var history = document.getElementById("history");

                history.scrollTop = history.scrollHeight;

                $("#submit-single-peer").prop("disabled",false);

                $("body").css("cursor", "default");
            },
            error:function(xmlHttpRequest, textStatus, errorThrown) {
                var htmlToAdd = $("<tr> <td>" + firstName + "</td><td>" + surname + "</td><td>" + email + "</td> <td><i class='fa fa-times-circle' style='color:red;'></i></td>  </tr>");

                $("#history-table").append(htmlToAdd);

                var history = document.getElementById("history");

                history.scrollTop = history.scrollHeight;

                $("#submit-single-peer").prop("disabled",false);

                $("body").css("cursor", "default");
            }
        })
        return false;

    });

});