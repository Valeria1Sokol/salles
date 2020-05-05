$(document).ready(function() {
    $('.legal-cases-carousel-container').slick({
        infinite: false,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,

        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }]
    }).slick("slickPause");

    $('.legal-cases-carousel-container').on('setPosition', function () {
        $(this).find('.slick-slide').height('auto');
        var slickTrack = $(this).find('.slick-track');
        var slickTrackHeight = $(slickTrack).height();
        $(this).find('.slick-slide').css('height', slickTrackHeight + 'px');

        $('.limit-text').each(function() {
            var content = $(this).html();
            var showChar = 190;

            if(content.length > showChar) {
                var c = content.substr(0, showChar);
                var html = c + '<span>...</span>';

                $(this).html(html);

                $(this).parent().parent().find(".read-more-button").show();
            }
        });
    });

    $('.read-more-button').click(function (e) {
        var reviewIntro = e.target.parentElement.parentElement.children[0].children[0].innerHTML;
        var review = e.target.parentElement.parentElement.children[0].children[2].innerHTML;
        var actionTakenIntro = e.target.parentElement.parentElement.children[1].children[0].innerHTML;
        var actionTaken = e.target.parentElement.parentElement.children[1].children[2].innerHTML;
        var reviewParagraph = $('.reviewParagraph');
        var actionParagraph = $('.actionTakenParagraph');


        $('#review-modal').modal({
            minWidth :700,
            onShow:function(dialog){
                reviewParagraph.html(reviewIntro + " " + review);
                actionParagraph.html(actionTakenIntro + " " + actionTaken);
                setTimeout(function(){
                    dialog.data.find("input#focusme").focus();
                },1000);
            }
        });
        return false;
    });

    $('.legal-case-premium-show-btn').click(function() {
        if($('#legal-cases-section').length) {
            $('#legal-cases-section').slideDown('slow', function () {
                initiateAfterLegalCaseShown();
            });
        } else {
            $('#no-legal-case-div-wrapper').slideDown('slow');
        }

        $('#legal-case-div-wrapper').slideUp('slow');
    });

    var initiateAfterLegalCaseShown = function() {
        $('.legal-cases-carousel-container')[0].slick.refresh();
        addHelpfulHandler();
        bindRequestsForms();
    };

    var addHelpfulHandler = function() {
        $('.legal-cases a.click-ajax').off('click');
        $('.legal-cases a.click-ajax').click(function(e) {
            e.preventDefault();
            var $a = $(this);
            if($a.hasClass('dead-link'))
                return;
            var csrf = $('input[name=_csrf]').val();
            if (typeof csrf != 'undefined') {
                $.ajax({
                    type: 'POST',
                    url: $a.attr('data-url'),
                    data: { '_csrf': csrf },
                    success: function(data) {
                        // check payload and update element if required
                        if(data.text) {
                            $a.text(data.text);
                            $a.addClass('dead-link');
                        }
                    }
                });
            }
        });
    };

    var bindRequestsForms = function() {
        $('.report-inaccuracy-btn').off('click');
        $('.report-inaccuracy-btn').click(function (e) {
            $('#legal-case-inaccuracy-modal').modal({
                minWidth :700
            });
            return false;
        });

        $('.request-removal-btn').off('click');
        $('.request-removal-btn').click(function (e) {
            $('#legal-case-removal-request-modal').modal({
                minWidth :700
            });
            return false;
        });

        $('.modalCloseImg').off('click');
        $('.modalCloseImg').click(function (e) {
            $.modal.close();
            return false;
        });
    };

    bindRequestsForms();
});