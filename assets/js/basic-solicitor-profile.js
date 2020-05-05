$('.limit-description').each(function() {
    var content = $(this).html();
    var showChar = 245;

    if(content.length > showChar) {
        var c = content.substr(0, showChar);
        var html = c + '<span>...</span>';

        $(this).html(html);
    }
});