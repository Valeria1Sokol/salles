//loadScriptThen('/assets/js/ext/jquery.validate.additional-methods.min.js', function() { });

//Request Callback form validator
$("#requestCallback").validate({
    
    rules: {
        name: {
            required: true,
            maxlength: 100,
            minlength: 2
        },
        number: {
            required: true,
            minlength: 10,
            maxlength: 12
        },
        preferredTime: {
            required: false,
            maxlength: 50,
            minlength: 2
        },
        email: {
            required: true,
            email: true
        },
        message: {
            minlength: 10
        }
    },
    ignore: '',
    //Hidden elements won't be validated otherwise (our radiobuttons are actually hidden).
    wrapper: 'p',
    messages: {
        name: {
            required: "Name is required.",
            maxlength: "Name is too long.",
            minlength: "Name field requires at least 2 characters."
        },
        number: {
            required: "Contact number is required",
            minlength: "Please enter at least 10 numbers.",
            maxlength: "Please enter no more than 12 number.",
        },
        preferredTime: {
            required: "Preferred time is required"
        },
        email: {
            required: "Email is required.",
            email: "Email format is invalid"
        }
    }
});

loadScriptThen('/assets/js/ext/jquery.simplemodal.js', function() {
    	
    	$('.open-callback').click(function (e) {
    		$('#callback-modal').modal({
    			minWidth :700
    		});
    		return false;
    	});
});
