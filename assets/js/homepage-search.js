var currentRequestTimestamp = 0;
var selected;

var visibleY = function(el){
    var rect = el.getBoundingClientRect(), top = rect.top, height = rect.height,
        rect = document.getElementById('homepage-results').getBoundingClientRect();
    if ((top + height)  <= rect.bottom === false) return false;
    if (top <= rect.top) return false;
    return true;
};

var autocompleteSearch = function() {
    var terms = document.querySelector('#homepage-search').value;
    if (terms.length > 2) {
        currentRequestTimestamp = Date.now();
        scheduleAutocompleteSearch(currentRequestTimestamp, terms);
    }
};

var scheduleAutocompleteSearch = function(startingTimestamp, terms) {
    setTimeout(function() {
        startAutocompleteSearch(startingTimestamp, terms);
    }, 200);
};

var bindHoverSelecting = function() {
    $('.selectable-element')
        .mouseover(function() {
            $('.selectable-element').removeClass('selected-element');
            selected = $(this).attr('id');
            $(this).addClass('selected-element');
        });
};

var showHomeSearchAutocompleteResults = function(data) {
    if (data && data.searchTimestamp === currentRequestTimestamp) {
        selected = null;
        $('.selectable-element').removeClass('selected-element');
        $('#homepage-results').scrollTo('0%');
        var branchList = $('.list1');
        var solicitorList = $('.list2');
        branchList.empty();
        solicitorList.empty();

        if (data.results.length > 0) {
            for (i = 0 ; i < data.results.length ; i++) {
                if (data.results[i].branch) {
                    var branch = data.results[i].branch;
                    var branchClass = 'selectable-element';
                    if (branch.headOffice) {
                        branchClass = 'selectable-element firm-search-list-item';
                    }

                    var tradingNamesSpan = '<span>Trading as - ' + branch.tradingNames + '</span>';
                    if (!branch.tradingNames) {
                        tradingNamesSpan = '&nbsp;';
                    }

                    branchList.append('<li id="firm-' + (i + 1) + '" class="' + branchClass + '">\n' +
                        '     <a href="' + branch.url + '">\n' +
                        '        <div class="clm1"><img src="/assets/img/Forma1.png" alt="">\n' +
                        '            <p>' + branch.name + '<br><span>' + branch.address + '</span><br>' + tradingNamesSpan + '</p>\n' +
                        '        </div>\n' +
                        '    </a>\n' +
                        '</li>');
                }
                if (data.results[i].solicitor) {
                    var solicitor = data.results[i].solicitor;
                    var solicitorIcon;
                    if (solicitor.registered) {
                        solicitorIcon = '<img src="/assets/img/Forma3.png" alt="">\n';
                    } else {
                        solicitorIcon = '<img src="/assets/img/Forma2.png" alt="">\n';
                    }

                    solicitorList.append('<li id="solicitor-' + (i + 1) + '" class="selectable-element">\n' +
                        '    <a href="' + solicitor.url + '">\n' +
                        '        <div class="clm1">' + solicitorIcon +
                        '            <p><span>&nbsp;</span><br>' + solicitor.name + '<br><span>' + solicitor.firmName + '&nbsp;</span></p>\n' +
                        '        </div>\n' +
                        '    </a>\n' +
                        '</li>');
                }
            }

            bindHoverSelecting();

            $('#firm-menu-container').show();
        }
    }
};

var startAutocompleteSearch = function(startingTimestamp, terms) {
    if (startingTimestamp === currentRequestTimestamp) {

        $.ajax({
            type: 'GET',
            cache: false,
            url: serviceUrl + '/autocomplete-homepage-search',
            data: {
                'term': terms,
                'timestamp': startingTimestamp
            },
            dataType: 'json',
            success: function(data) {
                showHomeSearchAutocompleteResults(data);
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                console.log(textStatus + ', ' + errorThrown);
            }
        });
    }
};

$(document).on('keypress',function(e) {
    if (e.which === 13) {
        if (selected) {
            var element = $('#' + selected);
            if (element) {
                window.location.href = element.find('a').attr('href');
                e.preventDefault();
            }
        }
    }
});

$(document).keyup(function(e) {
    if (e.key === "Escape") {
        selected = null;
        $('.selectable-element').removeClass('selected-element');
        $('#homepage-results').scrollTo('0%');
        $("#firm-menu-container").hide();
    }
});

var selectByKeys = function(id) {
    var element = $('#' + id);
    if (element.length) {
        $('.selectable-element').removeClass('selected-element');
        selected = id;
        element.addClass('selected-element');
        return element;
    }
};

$(document).keydown(function(e) {
    if (e.which === 38 || e.which === 40 || e.which === 39 || e.which === 37) {
        if (selected) {
            var selectedIdParts = selected.split('-');
            if (e.which === 39) {
                if (selectedIdParts[0] === 'firm') {
                    var selectedElement = selectByKeys('solicitor-' + selectedIdParts[1]);
                    if (!selectedElement) {
                        selectByKeys($('.list2 li').last().attr('id'));
                    }
                }
            } else if (e.which === 37) {
                if (selectedIdParts[0] === 'solicitor') {
                    var selectedElement = selectByKeys('firm-' + selectedIdParts[1]);
                    if (!selectedElement) {
                        selectByKeys($('.list1 li').last().attr('id'));
                    }
                }
            } else if (e.which === 40) {
                var selectedElement = selectByKeys(selectedIdParts[0] + '-' + (parseInt(selectedIdParts[1]) + 1));
                if (!visibleY(selectedElement[0])) {
                    $('#homepage-results').scrollTo('+='+ selectedElement.outerHeight() + 'px', 200);
                }
            } else if (e.which === 38) {
                if (selectedIdParts[1] === '1') {
                    selected = null;
                    $('.selectable-element').removeClass('selected-element');
                    $('#homepage-search').focus();
                } else {
                    var selectedElement = selectByKeys(selectedIdParts[0] + '-' + (parseInt(selectedIdParts[1]) - 1));
                    if (!visibleY(selectedElement[0])) {
                        $('#homepage-results').scrollTo('-='+ selectedElement.outerHeight() + 'px', 200);
                    }
                }
            }
            e.preventDefault();
        } else if (e.which === 40) {
            if ($('#homepage-search').is(':focus')) {
                var selectedElement = selectByKeys('firm-1');
                if (!selectedElement) {
                    selectByKeys('solicitor-1');
                }
                e.preventDefault();
            }
        }
    }
});

$(document).mouseup(function (e) {
    var div = $("#firm-menu-container");
    var input = $("#homepage-search");
    if (!div.is(e.target)
        && div.has(e.target).length === 0
        && !input.is(e.target)
        && input.has(e.target).length === 0) {
        selected = null;
        $('.selectable-element').removeClass('selected-element');
        $('#homepage-results').scrollTo('0%');
        div.hide();
    }
});