$(document).ready(function () {
    $('.shadow').css({
        height: '100%'
    });

    var blockUnusedArrows = function() {
        $(".team").each(function() {
            $(this).find(".teamLead").each(function() {
                $(this).find(".prev-order-solicitor").removeClass("grey-order-solicitor");
                $(this).find(".next-order-solicitor,.next-order-solicitor-team-lead").removeClass("grey-order-solicitor");
            });
            $(this).children().first().find(".prev-order-solicitor").addClass("grey-order-solicitor");
            $(this).children().last().find(".next-order-solicitor,.next-order-solicitor-team-lead").addClass("grey-order-solicitor");
        });
    }

    blockUnusedArrows();
 
    $('.teamChapter img').click(function () {
        $(this).toggleClass('flip');
        var content = $(this).parent().parent().next();

        if (content.is(':hidden')) {
            content.slideDown();
        } else {
            content.slideUp();
        }
    });

    $(".next-order-solicitor,.next-order-solicitor-team-lead").click(function(){
        var parent = $(this).parents(".solicitor");
        var nextToParent = parent.next();

        if(nextToParent) {
            var oldId = parent.attr("id").substr(10);
            var newId = nextToParent.attr("id").substr(10);
            var _csrf = $("[name='_csrf']").val();

            $.ajax({
                url: "/solicitor/individual-solicitors/order",
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
        var parent = $(this).parents(".solicitor");
        var nextToParent = parent.prev();

        if(nextToParent) {
            var oldId = parent.attr("id").substr(10);
            var newId = nextToParent.attr("id").substr(10);
            var _csrf = $("[name='_csrf']").val();

            $.ajax({
                url: "/solicitor/individual-solicitors/order",
                data: {_csrf: _csrf, oldId: oldId, newId: newId},
                type: "POST",
                success: function(a) {
                    parent.insertBefore(nextToParent);
                    blockUnusedArrows();
                }
            });
        }
    });

    $(".remove-individual-solicitor").click(function(){
        var branchId = $(this).closest(".branch-location").attr("id");
        var parent = $(this).parents(".solicitor");
        var solicitorId = parent.attr("id").substr(10);
        var _csrf = $("[name='_csrf']").val();

        $.ajax({
            url: "/solicitor/individual-solicitors/remove",
            data: {_csrf: _csrf, branchId: branchId, solicitorId: solicitorId},
            type: "POST",
            success: function(a) {
                parent.remove();
            }
        });
    });

    $(".teamSrc p ").click(function(){
        var _csrf = $("[name='_csrf']").val();

        $.ajax({
            url: "/solicitor/individual-solicitors/add-entire-firm",
            data: {_csrf: _csrf},
            type: "POST",
            success: function(a) {
                $('.shadow').after('<p class="message">Your request has been sent successfully</p>')
            }
        });
    });

    $(".edit-individual-solicitor").click(function(){
        var solicitorId = $(this).parents(".solicitor").attr("id").substr(10);
        window.location = "/solicitor/individual-solicitors/edit?id=" + solicitorId;
    });

    $(".addProf").click(function(){
        var branchId = $(this).closest(".branch-location").attr("id");
        window.location = "/solicitor/individual-solicitors/add?branchId=" + branchId;
    });

    function changeAllowSolicitorsReply() {
        var firmId = $(".individual-solicitors-content").first().attr("id");
        var allow = $("#allow-reply").is(':checked');
        var _csrf = $("[name='_csrf']").val();

        $.ajax({
            url: "/solicitor/individual-solicitors/allow-solicitors-reply",
            data: {_csrf: _csrf, firmId: firmId, allowReply: allow},
            type: "POST",
            success: function(a) {
                $('#allow-reply').prop('checked', allow)
            }
        });
    }

    $("#allow-reply-label").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        changeAllowSolicitorsReply()
    });

    $("#allow-reply").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        changeAllowSolicitorsReply()
    });

    function setAreasOfLawColors() {
        var labels = $('.job');

        for (i = 0; i < labels.length; i++) {
            labels[i].style.background = getColorForAreaOfLaw(labels.eq(i).text());
        }
    }

    $('.resend-activation').click(function(e) {
        var button = $(this);
        button.removeClass("resend-activation");
        button.off();
        button.addClass("resend-activation-btn-disabled");

        var _csrf = $("[name='_csrf']").val();
        var id = $(this).parents(".solicitor").attr("id").substr(10);
        $.ajax({
            url: "/solicitor/individual-solicitors/resend-activate",
            data: {_csrf: _csrf, id: id},
            type: "POST",
            success: function(a) {
                button.text("Activation email sent");
            }
        });
    });

    var openTransferSolicitor = function(clickedElement) {
        var solicitorId = clickedElement.parents(".solicitor").attr("id").substr(10);
        var solicitorName = clickedElement.parent().siblings('p.name').text();

        $('.transferSolisBlock .solicitor-id').val(solicitorId);
        $('.transferSolisBlock .solicitor-name').text(solicitorName);

        var scrollTop = $(window).scrollTop() ;
        var top = scrollTop + 0.15 * innerHeight;
        $('.transferSolisBlock').css({
            display: 'block'
            , top: top
        });
        $('.shadow').css({
            display: 'block'
        });
        $('body').css({
            overflowY:'hidden'
        });
    };

    var closeAssignSolicitor = function() {
        $('.transferSolisBlock').css({
            top: '-60%'
            , });
        $('.shadow').css({
            display: 'none'
        });
        $('body').css({
            overflowY:'auto'
        });
    };

    $('.transfer-individual-solicitor').click(function () {
        openTransferSolicitor($(this));
    });

    $('.transferSolis-close').click(function () {
        closeAssignSolicitor();
    });

    setAreasOfLawColors();

});