$(document).ready(function () {
    $('.shadow').css({
        height: '100%'
    });

    var openCreateTeam = function() {
        var scrollTop = $(window).scrollTop() ;
        var top = scrollTop + 0.15 * innerHeight;
        $('.createTeam').css({
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

    var closeCreateTeam = function() {
        $('.createTeam').css({
            top: '-60%'
            , });
        $('.shadow').css({
            display: 'none'
        });
        $('body').css({
            overflowY:'auto'
        });
    };

    var openAssignLead = function() {
        var scrollTop = $(window).scrollTop() ;
        var top = scrollTop + 0.15 * innerHeight;
        $('.assignTeamLead').css({
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

    var closeAssignLead = function() {
        $('.assignTeamLead').css({
            top: '-60%'
            , });
        $('.shadow').css({
            display: 'none'
        });
        $('body').css({
            overflowY:'auto'
        });
    };

    var closeAddSolicitorToTeam = function() {
        $('.addSolisToTeamBlock').css({
            top: '-60%'
            , });
        $('.shadow').css({
            display: 'none'
        });
        $('body').css({
            overflowY:'auto'
        });
    };

    var openAssignSolicitor = function(clickedElement) {
        var teamId = clickedElement.parent().parent().attr('id');
        var teamName = clickedElement.parent().find('.team-name').text();

        var leaderNames = clickedElement.parent().parent().find('.teamLead .name').map(function(){
                return $(this).text();
            }).get();
        var leaderName = leaderNames.join(', ');

        $('.addSolisBlock .team-id').val(teamId);
        $('.addSolisBlock .team-name').text(teamName);
        $('.addSolisBlock .leader-name').text(leaderName);

        var scrollTop = $(window).scrollTop() ;
        var top = scrollTop + 0.15 * innerHeight;
        $('.addSolisBlock').css({
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

    var openAddSolicitorToTeam = function() {
        var scrollTop = $(window).scrollTop() ;
        var top = scrollTop + 0.15 * innerHeight;
        $('.addSolisToTeamBlock').css({
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
        $('.addSolisBlock').css({
            top: '-60%'
            , });
        $('.shadow').css({
            display: 'none'
        });
        $('body').css({
            overflowY:'auto'
        });
    };

    var removeSolicitorFromTeam = function(solicitor) {
        if (parseInt(solicitor.find('.assigned-team-count').text(), 10) > 1) {
            solicitor.remove();
        } else {
            var unassignedContainer = $('.allUnassigned');

            unassignedContainer.append(solicitor);

            solicitor.find('.sectionIcon').hide();
            solicitor.find('.assigned-team-name').text(' - Unassigned');
        }
    };

    var removeLeaderFromTeam = function(lead) {
        var leadId = lead.attr("id").substr(10);
        var noLead = lead.next();
        var teamContainer = lead.parent().parent().find('.teamAll');
        var photo = lead.find('.photoLead').first().attr('style');
        var name = lead.find('.name').text();
        var teamName = lead.find('.assigned-team-name').text();
        var teamCount = lead.find('.assigned-team-count').text();

        lead.remove();

        if (noLead.parent().children('div').length <= 1) {
            noLead.show();
        }

        teamContainer.append('<div class="team-solicitor" id="solicitor_' + leadId + '">' +
            '                    <div class="teamInfo">\n' +
            '                        <div class="sectionIcon"> <img src="/assets/img/solicitors/ic-delete.png" class="remove-sol-from-team"> </div>\n' +
            '                            <div style="' + photo + '" class="photoLead"></div>\n' +
            '                            <p class="name">' + name + '</p>\n' +
            '                            <p>Account type <span> - Solicitor</span>\n' +
            '                            </p>\n' +
            '                            <p>Assigned team? <span class="assigned-team-name">' + teamName + '</span></p>\n' +
            '                            <p class="assigned-team-count">' + teamCount + '</p>\n' +
            '                        </div>' +
            '                        <img src="/assets/img/solicitors/divider1.png" class="divider">' +
            '                    </div>');

        bindRemovingSolicitorFromTeam();
    };

    var bindRemovingSolicitorFromTeam = function() {
        $('.remove-sol-from-team').click(function () {
            var solicitor = $(this).parent().parent().parent();
            var solicitorId = solicitor.attr("id").substr(10);
            var teamId = solicitor.parent().parent().parent().attr("id");
            var _csrf = $("[name='_csrf']").val();

            $.ajax({
                url: "/solicitor/teams/remove-solicitor",
                data: {_csrf: _csrf, solicitorId: solicitorId, teamId: teamId},
                type: "POST",
                success: function(a) {
                    removeSolicitorFromTeam(solicitor);
                }
            });
        });
    };
 
    $('.create').click(function () {
        openCreateTeam();
    });
    $('.add').click(function () {
        openCreateTeam();
    });
    $('.createTeam .ngdialog-close').click(function () {
        closeCreateTeam();
    });
    $('.assignLead').click(function () {
        openAssignLead();
        $('.assignTeamLead .teams-list option:eq(0)').prop('selected', true);
    });
    $('.assign-close').click(function () {
        closeAssignLead();
    });

    $('.addSolisToTeam-close').click(function () {
        closeAddSolicitorToTeam();
    });

    $('.assignToTeam').click(function () {
        openAssignSolicitor($(this));
    });

    $('.assignSolicitorToTeam').click(function () {
        openAddSolicitorToTeam();

        var solicitorId = $(this).parent().attr("id").substr(10);
        $('.addSolisToTeamBlock .unassigned-list option[value="' + solicitorId + '"]').prop('selected', true);
    });

    $('.addSolis-close').click(function () {
        closeAssignSolicitor();
    });

    $('.create-team-from-create-lead').click(function () {
        closeAssignLead();
        openCreateTeam();
    });

    $('.create-team-from-add-sols').click(function () {
        closeAddSolicitorToTeam();
        openCreateTeam();
    });

    $('.assign').click(function () {
       openAssignLead();

       var teamId = $(this).parent().parent().parent().parent().attr("id");
       $('.assignTeamLead .teams-list option[value="' + teamId + '"]').prop('selected', true);
    });

    $('.show-hide-toggle').click(function () {
        $(this).toggleClass('flip');
        var content = $(this).parent().parent().next();

        if (content.is(':hidden')) {
            content.slideDown();
        } else {
            content.slideUp();
        }
    });

    $('.remove-lead-from-team').click(function () {
        var lead = $(this).parent().parent();
        var teamId = lead.parent().parent().parent().attr("id");
        var solicitorId = lead.attr("id").substr(10);
        var _csrf = $("[name='_csrf']").val();

        $.ajax({
            url: "/solicitor/teams/remove-leader",
            data: {_csrf: _csrf, teamId: teamId, solicitorId: solicitorId},
            type: "POST",
            success: function(a) {
                removeLeaderFromTeam(lead);
            }
        });
    });

    var setAreasOfLawColors = function() {
        var labels = $('.job');

        for (i = 0; i < labels.length; i++) {
            labels[i].style.background = getColorForAreaOfLaw(labels.eq(i).text());
        }
    };

    $('.remove-team').click(function () {
        var teamContainer = $(this).parent().parent();
        var teamId = teamContainer.attr("id");
        var _csrf = $("[name='_csrf']").val();

        $.ajax({
            url: "/solicitor/teams/delete",
            data: {_csrf: _csrf, id: teamId},
            type: "POST",
            success: function(a) {
                var leader = teamContainer.find('.teamLead:not(.missingLead)');
                if (leader.length) {
                    removeLeaderFromTeam(leader);
                }

                var solicitors = teamContainer.find('.team-solicitor');
                solicitors.each(function( index ) {
                    removeSolicitorFromTeam($(this));
                });

                teamContainer.remove();

                $("select.teams-list option[value='" + teamId + "']").remove();
            }
        });
    });

    setAreasOfLawColors();

    bindRemovingSolicitorFromTeam();

    $('.report-link').click(function () {
        var link = $(this);
        setTimeout(function() {
            link.removeAttr("href");
            link.html("<img src='/assets/img/solicitors/ic.png'> Download will start shortly");
        }, 200);
    });
});