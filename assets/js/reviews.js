// Reviews: pagination, sorting and filtering
var cReviewsPerPage = 10;
var reviews = [];

var setReviewsAreasOfLawColorsAndReviewsCap = function() {
    var labels = $('.area-of-law-name');

    for (i = 0; i < labels.length; i++) {
        labels[i].style.background=getColorForAreaOfLaw(labels.eq(i).val());
    }

	$('.review-text').each(function (index) {
		if ($(this).height() > 120) {
			$(this).after(" <a class='see-more-link'>[See More]</a>");
			$(this).switchClass("review-text", "review-text-capped", 0);
		}
	});

	bindClickAjax();
	bindReportClick()
    bindShowMore();
};

var loadInfiniteScroll = function() {
	$('#rsReviews.infinite, #googleReviews.infinite, #facebookReviews.infinite').jscroll({
		autoTrigger: false,
	    loadingHtml: '<div class="infinite-more loading"><img src="/assets/img/x-loading.gif" alt="Loading" /></div>',
	    padding: 20,
	    nextSelector: '.infinite-more a:last',
	    contentSelector: '',
        callback: setReviewsAreasOfLawColorsAndReviewsCap
	});
};

var loadInfiniteScrollForSolicitor = function() {
    $('.comments.infinite').jscroll({
        autoTrigger: false,
        loadingHtml: '<div class="infinite-more loading"><img src="/assets/img/x-loading.gif" alt="Loading" /></div>',
        padding: 20,
        nextSelector: '.infinite-more a:last',
        contentSelector: '',
		callback: setReviewsAreasOfLawColorsAndReviewsCap
    });
};

var loadInfiniteScrollForPeerReviews = function() {
    $('#peer-reviews.infinite').jscroll({
        autoTrigger: false,
        loadingHtml: '<div class="infinite-more loading"><img src="/assets/img/x-loading.gif" alt="Loading" /></div>',
        padding: 20,
        nextSelector: '.infinite-more-peer-reviews a:last',
        contentSelector: ''
    });
};

var bindShowMore = function() {
	$('.see-more-link').click(function (e) {
		$(this).prevAll('.review-text-capped').switchClass("review-text-capped", "review-text", 400);
		$(this).remove();
	});
};

/* old pagination code */


var initSort = function() {
	$('article.review').each(function(ix, obj) {
		var $article = $(obj);
		reviews.push({
			id: $article.attr('id'),
			branchId : $article.data('branchid'),
			rating: parseInt($article.find('.review-rating').text(), 10),
			date: $article.find('.review-created').text(),
			is_replied: $article.find('.reply').length > 0
		});
	});
	
	$('.sort-rating').click(function(e) {
		e.preventDefault();
		// If rated the same then by date
		reviews.sort(function(a,b) { return (a.rating == b.rating ? b.date.localeCompare(a.date) : b.rating - a.rating) } );
		rerenderReviews();
		$('.sort a').removeClass('active');
		$('.sort a.sort-rating').addClass('active');
	});
	
	$('.sort-rating-asc').click(function(e) {
		e.preventDefault();
		// If rated the same then by date
		reviews.sort(function(a,b) { return (a.rating == b.rating ? b.date.localeCompare(a.date) : a.rating - b.rating) } );
		rerenderReviews();
		$('.sort a').removeClass('active');
		$('.sort a.sort-rating-asc').addClass('active');
	});
	
	$('.sort-recent').click(function(e) {
		e.preventDefault();
		reviews.sort(function(a,b) { return b.date.localeCompare(a.date) } );
		rerenderReviews();
		$('.sort a').removeClass('active');
		$('.sort a.sort-recent').addClass('active');
	});
	
};

var filterReviews = function(fromDate, toDate) {
	var formatDate = function(date) {
		return date.getFullYear()+
			(''+(date.getMonth()+1)).paddingLeft('00')+
			(''+date.getDate()).paddingLeft('00')+'000000';
	}

	var datefrom;
	var dateto;
	if (fromDate && toDate) {
		datefrom = formatDate(fromDate);
		dateto = formatDate(toDate);
	} else {
		datefrom = formatDate(new Date());
		dateto = formatDate(new Date());
	}
	var ratings = [];
	var options = document.getElementById('ratingsFilter').children;
	for (var i=options.length-1; i>-1; i--) {
		ratings.push(options[i].selected);
	}

	var branches = [];
	options = document.getElementById('branchFilter').children;
	for (var i=options.length-1; i>-1; i--) {
		if (options[i].selected) {
			branches.push(parseInt(options[i].value));
		}
	}
	var excludeReplied = $('input#excludeReplied').is(':checked');
	$('.review.filtered').removeClass('filtered');
	for(var ix = 0; ix < reviews.length; ix++) {
		if(! ratings[reviews[ix].rating-1] || reviews[ix].date < datefrom || reviews[ix].date > dateto ||
				(excludeReplied && reviews[ix].is_replied) || (branches.indexOf(reviews[ix].branchId)<0) )
			$('#'+reviews[ix].id).addClass('filtered');
	}
	showPage(1);
};

var initPagination = function() {
	var cReviews = $('.review').not('.filtered').length;
	if(cReviews == 0)
		$('.pagination-footer .row').add('.review-summary').add('div.sort').hide();
	else
		$('.pagination-footer .row').add('.review-summary').add('div.sort').show();
	
	var cPages = Math.ceil(cReviews / cReviewsPerPage);
	$('#pagination').children().remove();
	if(cPages > 1) {
		var $prev = $('<a href="#reviews" title="Previous page" class="pagination-previous"><i class="fa fa-angle-double-left"></i></a>');
		$prev.click(function(e) {
			var $current = $('#pagination a.current');
			var current = parseInt($current.text(), 10);
			if(current > 1)
				showPage(current-1);
		});
		var $next = $('<a href="#reviews" title="Next page" class="pagination-next" href="#"><i class="fa fa-angle-double-right"></i></a>');
		$next.click(function(e) {
			var $current = $('#pagination a.current');
			var current = parseInt($current.text(), 10);
			if(current < cPages)
				showPage(current+1);
		});
		$('#pagination').append($prev);
		for(var ix = 1; ix <= cPages; ix++) {
			var $a = $('<a href="#reviews" class="pagination-'+ix+(ix==1 ? ' current' : '')+'">'+ix+'</a>');
			$a.click(function(e) {
				var $selected = $(this);
				var $current = $('#pagination a.current');
				showPage(parseInt($selected.text(), 10));
			});
			$('#pagination').append($a);
		}
		$('#pagination').append($next);
	}
};

var rerenderReviews = function() {
	for(var ix = 0; ix < reviews.length; ix++) {
		$('#'+reviews[ix].id).appendTo('#reviews');
	}
	showPage(1);
};

var showPage = function(page) {
	$('.review').hide();
    $('.review').not('.filtered').each(function(n) {
        if (n >= cReviewsPerPage * (page - 1) && n < cReviewsPerPage * page) {
            $(this).show();
        }
    });
	$('#pagination a').removeClass('current');
	$('#pagination a.pagination-'+page).addClass('current');
    var cReviews = $('.review').not('.filtered').length;
    if(cReviews==0)
    	$('.pagination-summary').text('No reviews');
    else if(cReviews==1)
    	$('.pagination-summary').text('1 review');
    else {
    	var cLimit = cReviewsPerPage * page;
    	if(cLimit > cReviews) cLimit = cReviews;
    	$('.pagination-summary').text((1 + (cReviewsPerPage * (page - 1)))+'-'+cLimit+' of '+cReviews+' reviews');
    }
    initPagination(); // Re-render pagination based on the number of reviews now showing
}

var paginateReviews = function() {
    initPagination();
    showPage(1);
	//initSort();
}


loadScriptThen('/assets/js/ext/jquery.jscroll.min.js', function() {
	$(function() {
		// solicitor dash reviews page only
		$('.filter-reviews form input').change(filterReviews);

		// either pagination or infinite scroll
		loadInfiniteScroll();
		loadInfiniteScrollForSolicitor();
		loadInfiniteScrollForPeerReviews();
		// paginateReviews();
		
		if($('.review').length == 0 && $('form.auto-ajax').find('input[name=branchId]').length > 0) {
			// make ajax call to the server
			var url = '/branch/'+$('form.auto-ajax').find('input[name=branchId]').val()+'/reviews/rs';
			$('#reviews').load(url, function() {
				initPagination();
			});
		}
		
		// click on WWW link on branch profile pages TODO convert to ajax-click
		$('.websiteClick').on('click', function (e) {
			var utmTags = "utm_source=reviewsolicitors&utm_medium=referral&utm_campaign=ReviewSolicitors";
			// Add utm_ tags to the link 
			// Horrible hack alert - if it's not QS as it breaks their site
			if (this.href.indexOf("qualitysolicitors.com") == 0)
				this.href = (this.href.indexOf("?") > -1 ? this.href + "&" + utmTags : this.href + "?" + utmTags);
			
			$.ajax({
				type: 'POST',
				url: serviceUrl + '/branch/' + $('form.auto-ajax').find('input[name=branchId]').val() + '/website',
				data: { '_csrf': $('input[name=_csrf]').val() },
				success: function(data) {} // Doesn't matter, only POSTing to avoid caching
			});
		});
		
		// click on WWW link on branch profile pages TODO convert to ajax-click
		$('.callbackClick').on('click', function (e) {
		});
		
		// click on WWW link on branch profile pages TODO convert to ajax-click
		$('.appointmentClick').on('click', function (e) {
		});
		
		// submit add review form on branch profile pages
		$('.add-rating input[name="rating"]').change(function(e) {
			var $inp = $(this);
			$inp.closest('form')[0].submit();
		});
		
		// click on Email on branch profile pages TODO convert to ajax-click
		$('#emailClick').on('click', function (e) {
			$.ajax({
				type: 'POST',
				url: serviceUrl + '/branch/' + $('form.auto-ajax').find('input[name=branchId]').val() + '/email',
				data: { '_csrf': $('form.auto-ajax').find('input[name=_csrf]').val() },
				success: function(data) {
					console.log(data);
				}
			});
			window.location.href = "mailto:" + $('#emailClick').attr("value");
		});

        $("#rs-source-logo").click(function (){
            $('html, body').animate({
                scrollTop: $("#rsReviews").offset().top
            }, 500);
        });

        $("#google-source-logo").click(function (){
            $('html, body').animate({
                scrollTop: $("#google-reviews-header").offset().top
            }, 500);
        });

        $("#facebook-source-logo").click(function (){
            $('html, body').animate({
                scrollTop: $("#facebook-reviews-header").offset().top
            }, 500);
        });

        setReviewsAreasOfLawColorsAndReviewsCap();
		
	});
});