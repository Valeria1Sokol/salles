// Perhaps combine this with the maps and reviews?

var results = [];

var reRenderResults = function() {
	for(var ix = 0; ix < results.length; ix++) {
		$('#'+results[ix].id).appendTo('.results-list');
	}
};

var MIN_REVIEWS_TO_RANK = 5;

var sortByRating = function() {
	results.sort(function(a, b) {		
		// If both are premium or not then next level of sorting, otherwise return whichever is premium first
		if ((a.is_premium && b.is_premium) || (!a.is_premium && !b.is_premium))
			// If they are both above or below 5 reviews then rank on rating, otherwise whoever has 5 or more ranks first, with distance finally if they're otherwise equal.
			if ((a.reviews >= MIN_REVIEWS_TO_RANK && b.reviews >= MIN_REVIEWS_TO_RANK) || (a.reviews < MIN_REVIEWS_TO_RANK && b.reviews < MIN_REVIEWS_TO_RANK)) 
				return (b.rating - a.rating === 0 ? a.distance - b.distance : b.rating - a.rating);
			// Rank by who has over the min reviews
			else
				return a.reviews >= MIN_REVIEWS_TO_RANK ? -1 : 1;
		else
			return a.is_premium && !b.is_premium ? -1 : 1;
	});
	reRenderResults();
	$('.sort a').removeClass('active');
	$('.sort a.by-rating').addClass('active');
}

var sortByDistance = function() {
	results.sort(function(a, b) {
		return a.is_premium && ! b.is_premium ? -1 : 
			( ! a.is_premium && b.is_premium ? 1 : a.distance - b.distance); 
	});
	reRenderResults();
	$('.sort a').removeClass('active');
	$('.sort a.by-distance').addClass('active');
}

var initResultsSort = function() {
	$('.results-list article').each(function(ix, obj) {
		var $article = $(obj);
		results.push({
			id: $article.attr('id'),
			rating: parseInt($article.find('.sort-by-rating').text(), 10),
			reviews: parseInt($article.find('.sort-by-num-reviews').text(), 10),
			distance: parseFloat($article.find('.sort-by-distance').text()),
			is_premium: $article.hasClass('highlighted')
		});
	});
	
	// Set event handlers
	$('.sort .by-rating').click(function(e) {
		e.preventDefault();
		sortByRating();
	});
	
	$('.sort .by-distance').click(function(e) {
		e.preventDefault();
		sortByDistance();
	});
	
	// Sort by rating to start with - server outputs by distance by default
	sortByRating();
	
};
$(function() {
	initResultsSort();
});