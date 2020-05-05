$(document).ready(function () {
    $('.teamChapter img').click(function () {
        $(this).toggleClass('flip');
        var content = $(this).parent().parent().next();

        if (content.is(':hidden')) {
            content.slideDown();
        } else {
            content.slideUp();
        }
    });

    var openedMember;

    $('.solicitor-container').click(function() {
        var statsDiv = $(".showHide");
        var statBoxes = $('.hideBox');
        var currentlyClickedElement = this;
        $('.activeImg').slideUp(400);
        statsDiv.slideUp(400, function() {
            statBoxes.hide();

            var teamContainer = $('.teamAll');
            var members = teamContainer.children(':not(.showHide)');
            var clickedIndex = members.index(currentlyClickedElement);

            if (clickedIndex !== openedMember) {
                var member = members.first();
                var teamWidth = teamContainer.width();
                var memberWidth = member.outerWidth(true);
                var howManyMembersInRow = Math.floor(teamWidth / memberWidth);
                var rowAfterWhichStatsShouldShow = Math.ceil((clickedIndex + 1) / howManyMembersInRow);
                var lastElementInFoundRow = rowAfterWhichStatsShouldShow * howManyMembersInRow;

                var elementAfterWhichStatsShouldShow = members.eq(lastElementInFoundRow - 1);

                if (elementAfterWhichStatsShouldShow.length < 1) {
                    for (i = lastElementInFoundRow - 2; i >= 0; i--) {
                        elementAfterWhichStatsShouldShow = members.eq(i);
                        if (elementAfterWhichStatsShouldShow.length) {
                            break;
                        }
                    }
                }

                elementAfterWhichStatsShouldShow.after(statsDiv);

                var clickedMemberId = $(currentlyClickedElement).attr("id");
                var statBoxToShow = $('#stats_' + clickedMemberId);
                statBoxToShow.show();

                $(currentlyClickedElement).find('.activeImg').slideDown(400);
                statsDiv.slideDown(400);
                openedMember = clickedIndex;
            } else {
                openedMember = null;
            }
        });
    });

    $('.report-link').click(function () {
        var link = $(this);
        setTimeout(function() {
            link.removeAttr("href");
            link.html("<img src='/assets/img/solicitors/ic.png'> Download will start shortly");
        }, 200);
    });

    $('.dummy-link').click(function () {
        var link = $(this);
        setTimeout(function() {
            link.removeAttr("href");
            link.html("<img src='/assets/img/solicitors/ic.png'> You are now downloading a dummy report. Your teams have recently been set up and you will be able to download actual live reports 7 days after your initial setup. This will be from Thursday 27th June 2019");
        }, 100);
    });

    var setAreasOfLawColors = function() {
        var labels = $('.job');

        for (i = 0; i < labels.length; i++) {
            labels[i].style.background = getColorForAreaOfLaw(labels.eq(i).text());
        }
    };

    setAreasOfLawColors();
});
