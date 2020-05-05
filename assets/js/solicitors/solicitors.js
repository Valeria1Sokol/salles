$(document).ready(function() {
    var blockUnusedArrows = function() {
        $(".individual-solicitors-list").each(function() {
            $(this).children().each(function() {
            	$(this).find(".prev-order-solicitor").removeClass("grey-order-solicitor");
            	$(this).find(".next-order-solicitor").removeClass("grey-order-solicitor");
			});
            $(this).children().first().find(".prev-order-solicitor").addClass("grey-order-solicitor");
            $(this).children().last().find(".next-order-solicitor").addClass("grey-order-solicitor");
        });
    }

	blockUnusedArrows();

	$(".add-solicitor").click(function(){
		var branchId = $(this).closest(".branch-id-div").attr("id");
		window.location = "/solicitor/solicitors/add?branchId=" + branchId;
	});

    $(".edit-solicitor").click(function(){
        var solicitorId = $(this).closest(".individual-solicitor").attr("id").substr(10);
        window.location = "/solicitor/solicitors/edit-individual?solicitorId=" + solicitorId;
    });

    $(".next-order-solicitor").click(function(){
        var parent = $(this).parents(".individual-solicitor");
        var nextToParent = parent.next();

        if(nextToParent) {
            var oldId = parent.attr("id").substr(10);
            var newId = nextToParent.attr("id").substr(10);
            var _csrf = parent.find("[name='_csrf']").val();

            $.ajax({
                url: "/solicitor/solicitors/order",
                data: {_csrf: _csrf, oldId: oldId, newId: newId},
                type: "POST",
                success: function(a) {
                    parent.insertAfter(nextToParent);
                    blockUnusedArrows();
                }
            });
        }
	});

    $(".prev-order-solicitor").click(function(){
        var parent = $(this).parents(".individual-solicitor");
        var nextToParent = parent.prev();

        if(nextToParent) {
            var oldId = parent.attr("id").substr(10);
            var newId = nextToParent.attr("id").substr(10);
            var _csrf = parent.find("[name='_csrf']").val();

            $.ajax({
                url: "/solicitor/solicitors/order",
                data: {_csrf: _csrf, oldId: oldId, newId: newId},
                type: "POST",
                success: function(a) {
                    parent.insertBefore(nextToParent);
                    blockUnusedArrows();
                }
            });
        }
    });
	
	$(".remove-solicitor").click(function() {
//		var branchId = $(this).closest(".branch-id-div").attr("id");
//		//window.location = "/solicitor/solicitors/remove?branchId=" + branchId;
//		var solicitorId = $(this).attr("id");
//		$.ajax({
//			url: "/solicitor/solicitors/remove",
//			data: {branchId: branchId, solicitorId: solicitorId},
//			type: "POST",
//			success: function(a) {
//				location.reload();
//			}
//		});
		$(this).closest("#removeSolicitorForm").submit();
	});

});