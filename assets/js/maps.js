// Perhaps combine this with the search and reviews?

// 1. load Google maps api
loadScriptThen('//maps.googleapis.com/maps/api/js?v=3.exp&signed_in=false&callback=gotMaps&key=AIzaSyBSpVGtpsD6O5eOpLHXLYzonklVk9JIwgg', function() {
});

function gotMaps() {
	// 2. Load markers stuff
	loadScriptThen('/assets/js/ext/markerwithlabel_packed.js', function() {
		// 3. Load infobox
		loadScriptThen('/assets/js/ext/infobox.js', function() {
			// TODO optimize this
			initMap();
		});
	});
};

var initMap = function() {
	if(!window.semaphore) {
		initializeMap();
		initializeSearchMap();
		if ($('#local-competitors') != null ) {
			initializeAltMap();
		}
		if ($('#more-locations') != null ) {
			generateMoreLocations();
		}
		if( $('.location').length > 0 ) {
			initializeMoreMaps();
		}
	} else {
		setTimeout(initMap, 50);
	}
}

function generateMoreLocations() {	
	var id = $('#branchId').val();
	var url = '/more-branches?id=' + id;
	$("#more-locations").load(url, initializeMoreMaps);
}

function initializeMap() {
	
	if (document.getElementById('map-canvas') == null) {
		return;
	}
	
	var lat = document.getElementById('lat').innerHTML;
	var long = document.getElementById('lng').innerHTML;
	var branchName = document.getElementById('branchName').innerHTML;
	
	var isMobile = mobilecheck();
	
	// google maps seems to need a zoom
	var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng(lat, long),
			disableDefaultUI: true,
			scrollwheel: !isMobile,
			draggable: !isMobile
	};
	
	var firmMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
	var markerPosition = new google.maps.LatLng(lat, long);
		
	var image = '/assets/img/map-marker/marker_normal.png';
	
	var marker = new google.maps.Marker({
		position: markerPosition,
	    map: firmMap,
	    title: branchName,
	    icon: image
	});
	
	var infowindow = new google.maps.InfoWindow({
		content: branchName
	});
		
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(marker.get('map'), marker);
	});
}

/**
 * Firm Map: On basic and premium profile pages showing location of the branch.
 */
function initializeMoreMaps() {

	var i = 1;
	
	if (document.getElementById('more-map-canvas'+i) == null) {
		return;
	}
	
	while (document.getElementById('more-map-canvas'+i) != null) {
	
		var lat = document.getElementById('lat'+i).innerHTML;
		var long = document.getElementById('lng'+i).innerHTML;
		var branchName = document.getElementById('branchName'+i).innerHTML;
	
		var isMobile = mobilecheck();
		
		// google maps seems to need a zoom
		var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng(lat, long),
			disableDefaultUI: true,
			scrollwheel: !isMobile,
			draggable: !isMobile
		};
	
	
		var moreMap = new google.maps.Map(document.getElementById('more-map-canvas'+i), mapOptions);
		
		var markerPosition = new google.maps.LatLng(lat, long);
		
		var image = '/assets/img/map-marker/marker_normal.png';
	
		var marker = new google.maps.Marker({
			position: markerPosition,
			map: moreMap,
			title: branchName,
			icon: image,
			url: 'http://maps.google.com/maps?q=' + lat + ',' + long +'&z=15'
		});
			
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				 window.open(marker.url);   
			}
		})(marker, i)); 
		
		i++;
	}
	
	// in some circumstances (e.g. only 1 branch in the town) the map zooms in too far, zoom back a bit.
	var zoomlistener = google.maps.event.addListener(moreMap, "idle", function() { 
		if (moreMap.getZoom() > 15) 
			moreMap.setZoom(15); 
		google.maps.event.removeListener(zoomlistener); 
	});
}


/**
 * Full Map: At bottom of premium profile pages showing location of the branch on a larger map.

function initializeFullMap() {
	
	if (document.getElementById('full-map-canvas') == null) {
		return;
	}
	
	var lat = document.getElementById('lat').innerHTML;
	var long = document.getElementById('lng').innerHTML;
	var branchName = document.getElementById('branchName').innerHTML;
	
	// google maps seems to need a zoom
	var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng(lat, long),
			disableDefaultUI: true
	};
	
	
	var fullMap = new google.maps.Map(document.getElementById('full-map-canvas'), mapOptions);
		
	var markerPosition = new google.maps.LatLng(lat, long);
		
	var image = '/assets/img/map-marker/marker_normal.png';
	
	var marker = new google.maps.Marker({
		position: markerPosition,
	    map: fullMap,
	    title: branchName,
	    icon: image
	});
		
	var infowindow = new google.maps.InfoWindow({
		content: branchName
	});
		
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(marker.get('map'), marker);
	});
}

// Map Initialize
google.maps.event.addDomListener(window, 'load', initializeFullMap);
*/

/**
 * Search Map: Shows the location of all branches in the vicinity of a search.
 * Adds search results branches and 'rolled-up' other branches on the map
 */
var searchMap;

function initializeSearchMap() {
	
	if (document.getElementById('search-map-canvas') == null) {
		return;
	}
	
	var isMobile = mobilecheck();
	
	var mapOptions = {
			//zoom: 15,
			disableDefaultUI: true,
			scrollwheel: !isMobile,
			draggable: !isMobile
	};
	
	searchMap = new google.maps.Map(document.getElementById('search-map-canvas'), mapOptions);
		
	var premImage = '/assets/img/map-marker/marker_premium.png';
	var image = '/assets/img/map-marker/marker_normal.png';
	
	var markerBounds = new google.maps.LatLngBounds();
	
	addBranches('mapHigh', markerBounds, premImage, google.maps.Marker.MAX_ZINDEX);
	addBranches('mapSumm', markerBounds, image, google.maps.Marker.MAX_ZINDEX-1);
	
	// Tweak the size of the map to bring it in a little.
	// This seems problematic as google maps has a course zoom level and the map won't
	// change until you cross a zoom level
	// markerBounds = tweakMapSize(markerBounds);
	
	// default map to a town if there are no branches
	if (markerBounds.isEmpty()) {
		//addDefaultTown(markerBounds);
		setDefaultMap(markerBounds);
	}
	
	// calculate the zoom and pan to the center.
	searchMap.fitBounds(markerBounds);
	
	// in some circumstances (e.g. only 1 branch in the town) the map zooms in too far, zoom back a bit.
	var listener = google.maps.event.addListener(searchMap, "idle", function() { 
		if (searchMap.getZoom() > 15) 
			searchMap.setZoom(15); 
		google.maps.event.removeListener(listener); 
	});
	 
}

var rankingMap;

function initializeRankingMap() {

    if (document.getElementById('ranking-map-canvas') == null) {
        return;
    }

    var isMobile = mobilecheck();

    var mapOptions = {
        //zoom: 15,
        disableDefaultUI: true,
        scrollwheel: !isMobile,
        draggable: !isMobile
    };

    var parentHeight = document.getElementById('ranking-map-canvas').parentElement.parentElement.offsetHeight;
    var closeButtonHeight = document.getElementById('closebtn').offsetHeight;
    document.getElementById('ranking-map-canvas').style.height = parentHeight - closeButtonHeight - 30 + "px";

    rankingMap = new google.maps.Map(document.getElementById('ranking-map-canvas'));

    var premImage = '/assets/img/map-marker/marker_premium.png';
    var image = '/assets/img/map-marker/marker_normal.png';

    var markerBounds = new google.maps.LatLngBounds();

    addRankingBranches('mapBranchPremium', markerBounds, premImage, google.maps.Marker.MAX_ZINDEX);
    addRankingBranches('mapBranchBasic', markerBounds, image, google.maps.Marker.MAX_ZINDEX-1);

    if (markerBounds.isEmpty()) {
        setDefaultMap(markerBounds);
    }

    rankingMap.fitBounds(markerBounds);

    // in some circumstances (e.g. only 1 branch in the town) the map zooms in too far, zoom back a bit.
    var listener = google.maps.event.addListener(rankingMap, "idle", function() {
        if (rankingMap.getZoom() > 15)
            rankingMap.setZoom(15);
        google.maps.event.removeListener(listener);
    });

}


function tweakMapSize(bounds) {
	var ne = bounds.getNorthEast();
	var sw = bounds.getSouthWest();
	
	var latPer = (ne.lat() - sw.lat()) * 0.25; // 10%
	var lngPer = (ne.lng() - sw.lng()) * 0.25; // 10%

	var smallerNE = new google.maps.LatLng(ne.lat()-latPer, ne.lng()-lngPer);
	var smallerSW = new google.maps.LatLng(sw.lat()+latPer, sw.lng()+lngPer);
	
	return new google.maps.LatLngBounds(smallerSW, smallerNE);
}


function addBranches(type, markerBounds, image, zValue) {
	var i = 1;
	while(document.getElementById(type + 'Branch'+i) != null) {
			
		// get the branch data
		var branchName = document.getElementById(type + 'BranchName'+i).innerHTML;
		var lat = document.getElementById(type + 'BranchLat'+i).innerHTML;
		var lng = document.getElementById(type + 'BranchLng'+i).innerHTML;
		
		var markerPosition = new google.maps.LatLng(lat, lng);
		markerBounds.extend(markerPosition);

		var marker = new google.maps.Marker({
			position: markerPosition,
		    map: searchMap,
		    title: branchName,
		    icon: image,
		    zIndex: zValue
		});

		var boxText = document.getElementById(type + 'Branch'+i);

		createInfoWindow(marker, type, boxText, searchMap);

		// add other branches
		if (document.getElementById(type + 'Branch' + i + 'Other1') != null) {
			addOthers(type, markerBounds, image, i, zValue);
		}
		
		i++;
	}
}

function addRankingBranches(type, markerBounds, image, zValue) {
    var i = 1;
    while(document.getElementById('mapBranch'+i) != null) {
    	var mapData = document.getElementById('mapBranch' + i);

		if (mapData.className.split(/\s+/).indexOf(type) !== -1) {
            // get the branch data
            var branchName = document.getElementById('mapBranchName' + i).innerHTML;
            var lat = document.getElementById('mapBranchLat' + i).innerHTML;
            var lng = document.getElementById('mapBranchLng' + i).innerHTML;

            var markerPosition = new google.maps.LatLng(lat, lng);
            markerBounds.extend(markerPosition);

            var marker = new google.maps.Marker({
                position: markerPosition,
                map: rankingMap,
                title: branchName,
                icon: image,
                zIndex: zValue
            });

            createInfoWindow(marker, type, mapData, rankingMap);
        }

        i++;
    }
}

function addOthers(type, markerBounds, image, parent, zValue) {
	var i = 1;
	while(document.getElementById(type + 'Branch' + parent + 'Other' + i) != null) {
			
		// get the branch data
		var branchName = document.getElementById(type + 'Branch' + parent +'OtherName'+i).innerHTML;
		var lat = document.getElementById(type + 'Branch' + parent +'OtherLat'+i).innerHTML;
		var lng = document.getElementById(type + 'Branch' + parent +'OtherLng'+i).innerHTML;
		
		var markerPosition = new google.maps.LatLng(lat, lng);
		markerBounds.extend(markerPosition);
		
		var smallerImage = new google.maps.MarkerImage(image, null, null, null, new google.maps.Size(15, 18));
		
		var marker = new google.maps.Marker({
			position: markerPosition,
		    map: searchMap,
		    title: branchName,
		    icon: smallerImage,
		    zIndex: zValue
		});
			
		var boxText = document.getElementById(type + 'Branch'+parent+'Other'+i);
			
		createInfoWindow(marker, type, boxText, searchMap);
		
		i++;
	}
}

//function addDefaultTown(markerBounds) {
//	var lat = document.getElementById("mapTownLat").innerHTML;
//	var lng = document.getElementById("mapTownLng").innerHTML;
//	
//	var markerPosition = new google.maps.LatLng(lat, lng);
//	markerBounds.extend(markerPosition);
//}

function setDefaultMap(markerBounds) {
	var lat = 59.512029
	var lng = 1.845703	
	var markerPosition = new google.maps.LatLng(lat, lng);
	markerBounds.extend(markerPosition);
	
	lat = 49.696062
	lng = -11.074219	
	markerPosition = new google.maps.LatLng(lat, lng);
	markerBounds.extend(markerPosition);
}

var searchCount = 0;
function createInfoWindow(marker, type, boxText, map) {
	searchCount++;
	var infowindow = new google.maps.InfoWindow();
     	
     var myOptions = {
    		 content: boxText
    		,disableAutoPan: false
    		,maxWidth: 0
    		,pixelOffset: new google.maps.Size(-140, -180)
    		,zIndex: null
    		,closeBoxMargin: "10px 2px 2px 2px"
    		,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
    		,infoBoxClearance: new google.maps.Size(1, 1)
    		,isHidden: false
    		,pane: "floatPane"
    		,enableEventPropagation: false
    };

    var ib = new InfoBox(myOptions);
	
    google.maps.event.addListener(marker, 'click', (function(marker, searchCount) {
		return function() {
			ib.open(map, marker);
            map.panTo(marker.getPosition())
		}
	})(marker, searchCount)); 
}

/**
 * ALternative Map: The map of nearby competitors that a customer may also be interested in.
 */
var altMap;

function initializeAltMap() {
		
	if (document.getElementById('alt-map-canvas') == null) {
		return;
	}
	
	var isMobile = mobilecheck();
	
	var mapOptions = {
			zoom: 15,
			disableDefaultUI: true,
			scrollwheel: !isMobile,
			draggable: !isMobile
	};
	
	altMap = new google.maps.Map(document.getElementById('alt-map-canvas'), mapOptions);
		
	var image = '/assets/img/map-marker/marker_basic.png';
		
	var markerBounds = new google.maps.LatLngBounds();
		
	var i = 1;
	while(document.getElementById('altBranch'+i) != null) {
			
		// get the branch data
		var branchName = document.getElementById('altBranchName'+i).innerHTML;
		var lat = document.getElementById('altBranchLat'+i).innerHTML;
		var lng = document.getElementById('altBranchLng'+i).innerHTML;
			
		addMarkerToMap(markerBounds, lat, lng, branchName, i, image);
		i++;
	}
		
	// calculate the zoom and pan to the center.
	altMap.fitBounds(markerBounds);
	
	// in some circumstances (e.g. only 1 branch in the town) the map zooms in too far, zoom back a bit.
	var zoomlistener = google.maps.event.addListener(altMap, "idle", function() { 
		if (altMap.getZoom() > 15) 
			altMap.setZoom(15); 
		google.maps.event.removeListener(zoomlistener); 
	});
}
	
var markerCount = 0;
// This function will add a marker to the map each time it
// is called.  It takes latitude, longitude, branch name
// for the content you want to appear in the info window
// for the marker.
function addMarkerToMap(markerBounds, lat, long, branchName, i, image){
  
	var infowindow = new google.maps.InfoWindow();
	var myLatLng = new google.maps.LatLng(lat, long);
	markerBounds.extend(myLatLng);
	
	
	var marker = new MarkerWithLabel({
      position: myLatLng,
      map: altMap,
      icon: image,
      labelContent: ""+i,
      labelClass: "map-icon-label", // CSS class for the label
      labelInBackground: false,
      labelAnchor: new google.maps.Point(3, 50),
      draggable: false,
      raiseOnDrag: false
	});
   
	// Gives each marker an Id for the on click
	markerCount++;

	// Creates the event listener for clicking the marker
	// and places the marker on the map
	google.maps.event.addListener(marker, 'click', (function(marker, markerCount) {
		return function() {
			infowindow.setContent(branchName);
			infowindow.open(altMap, marker);
			altMap.panTo(marker.getPosition())      
		}
	})(marker, markerCount)); 
   
}
