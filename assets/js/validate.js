//loadScriptThen('/assets/js/ext/jquery.validate.additional-methods.min.js', function() { });
loadScriptThen('/assets/js/ext/jquery.validate.min.js', function() {
    
    //New Review jQuery validation.
    var afterSubmit = false;
    $(".writeReviewForm").validate({
        
        rules: {
            title: {
                required: true,
                maxlength: 256
            },
            text: {
                minlength: 40,
                required: true
            
            },
            acceptConditions: {
                required: true
            },
            confirmClient: {
                required: true
            },
            rating: {
                required: true
            },
            satisfied: {
                required: true
            },
            recommend: {
                required: true
            },
            userEmailAddress: {
                required: true,
                email: true
            },
            userDisplayName: {
                required: true
            },
            clientName: {
                required: true
            },
            clientEmail: {
                email: true
            },
            paperReviewFile: {
                required: true
            },
            signinEmail: {
                required: 'div.signin:visible',
                email: true
            },
            signinPassword: {
                required: 'div.signin:visible'
            },
            firstName: {
                required: 'div.signup:visible'
            },
            lastName: {
                required: 'div.signup:visible'
            },
            signupPassword: {
                required: 'div.signup:visible'
            },
            signupEmail: {
                required: 'div.signup:visible',
                email: true
            }
        },
        messages: {
            title: {
                required: "A review must have a title",
                maxlength: $.validator.format("A title must be shorter than {0} characters")
            },
            text: {
                minlength: $.validator.format("A review must be a minimum of {0} characters"),
                required: "A review can not be empty"
            },
            acceptConditions: {
                required: "You must check the box to confirm that you abide by our content integrity policy"
            },
            confirmClient: {
                required: "You must check the box to confirm that you were a client or that you were looking to use the firm"
            },
            rating: {
                required: "Select 1 to 5 stars"
            },
            satisfied: {
                required: "Please select one of the options"
            },
            recommend: {
                required: "Please select one of the options"
            },
            userEmailAddress: {
                required: "Please provide your email address"
            },
            userDisplayName: {
                required: "Please provide your name"
            },
            clientName: {
                required: "Please provide client name"
            },
            paperReviewFile: {
                required: "Please provide copy of paper review"
            },
            signinEmail: {
                required: "Email address may not be empty",
                email: "Invalid email address"
            },
            signinPassword: {
                required: "Password may not be empty"
            },
            firstName: {
                required: "First name may not be empty"
            },
            lastName: {
                required: "Last name may not be empty"
            },
            signupEmail: {
                required: "Email address may not be empty",
                email: "Invalid email address"
            }
        },
        errorPlacement: function(error, element) {
            switch ($(element).attr("name")) {
            case "confirmClient":
            case "acceptConditions":
                $(error).insertBefore($(element).parent());
                $(error).addClass("error-msg")
                break;
            case "rating":
            case "satisfied":
            case "recommend":
                $(error).insertAfter($(element).parent().next());
                $(error).addClass("error-msg-right")
                break;
            case "paperReviewFile":
                $(error).insertBefore($(element));
                $(error).addClass("error-msg")
                break;
            default:
                $(error).insertAfter(element);
                $(error).addClass("error-msg")
            }
        
        },
        highlight: function(element) {
            switch ($(element).attr("name")) {
            case "confirmClient":
            case "acceptConditions":
            case "rating":
            case "satisfied":
            case "recommend":
            case "paperReviewFile":
                break;
            default:
                $(element).addClass("error");
            }
        
        },
        unhighlight: function(element) {
            $(element).removeClass("error");
        },
        onkeyup: function(element, event) {
            if (afterSubmit) {
                $(element).valid();
            }
        },
        ignore: '',
        //Hidden elements won't be validated otherwise (our radiobuttons are actually hidden).
        wrapper: 'p',
        focusInvalid: false,
        //Scrolls to the last active element by default.
        invalidHandler: function(event, validator) {
            afterSubmit = true;
            var errors = validator.numberOfInvalids();
            if (errors) {
                var firstElement = $(validator.errorList[0].element);
                //Scroll to the first error instead.
                if (firstElement.attr("name") == "rating") {
                    var offset = $(".select-rating").first().offset().top;
                } else {
                    var offset = firstElement.offset().top;
                }
                
                offset -= 40;
                
                console.log(offset);
                $('html, body').animate({
                    scrollTop: offset
                }, 500);
            }
        },
        invalidHandler: function(event, validator) {
            $('#socialNetwork').val("");
            if ($('#signin').val() != "true" && $('#signup').val() != "true") {
                $('#signin').val("false");
                $('#signup').val("true");
                $('div.signup').show();
                $('div.signin').hide();
            }
        }
    });
    
   

});
