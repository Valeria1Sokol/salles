$(document).ready(function() {
	$("#submit-single-client").click(function() {

		$("#submit-single-client").prop("disabled",true);
		
		
		$("body").css("cursor", "progress");
		
		$("#contact-single-client").submit();
		
	});
	
	function getCSRFTokenValue() {
		var csrf = $('input[name=_csrf]').val();
		return csrf;
	}
	
	$("#contact-single-client").on("submit", function() {
		
		var firstName = $("#contact-single-client").find("#firstName").val();
		var surname = $("#contact-single-client").find("#surname").val();
		var areaOfLaw = $("#contact-single-client").find("#areaOfLaw").val();
		var email = $("#contact-single-client").find("#email").val();
		
		//var transactionType = $("#contact-single-client").find("#transaction-type").val();
		
		$.ajax({
			url: "/api/v1/send-single-review-email",
			type: "POST",
			data: {firstName: firstName, surname: surname, areaOfLaw: areaOfLaw, email: email, _csrf: getCSRFTokenValue()},
			success:function(json) {
				var htmlToAdd = $("<tr> <td>" + firstName + "</td><td>" + surname + "</td><td>" + email + "</td> <td>" + areaOfLaw + "</td> <td><i class='fa fa-check-circle' style='color:green;'></i></td>  </tr>");
				
				$("#history-table").append(htmlToAdd);
				
				var history = document.getElementById("history");
				
				history.scrollTop = history.scrollHeight;
				
				$("#submit-single-client").prop("disabled",false);
				
				$("body").css("cursor", "default");
			},
			error:function(xmlHttpRequest, textStatus, errorThrown) {
				var htmlToAdd = $("<tr> <td>" + firstName + "</td><td>" + surname + "</td><td>" + email + "</td> <td>" + areaOfLaw + "</td> <td><i class='fa fa-times-circle' style='color:red;'></i></td>  </tr>");
				
				$("#history-table").append(htmlToAdd);
				
				var history = document.getElementById("history");
				
				history.scrollTop = history.scrollHeight;
				
				$("#submit-single-client").prop("disabled",false);
				
				$("body").css("cursor", "default");
			}
		})
		return false;
		
	});
	
});