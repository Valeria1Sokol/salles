// Function to handle deferred script loading
function loadScriptThen(src, fn) {
	if(!window.loadedScripts)
		window.loadedScripts = [];
	if(window.loadedScripts.indexOf(src) > -1) {
	    fn();
	    return;
	}		
	window.loadedScripts.push(src);
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type='text/javascript';
	script.onreadystatechange= function () {
		if (this.readyState == 'complete' && fn) fn();
	}
	script.onload=fn;
	script.src=src;
	head.appendChild(script);
};

// this is to stop maps loading too early
window.semaphore = true;

var loadScripts = function() {
	// 1. Load web font
	loadScriptThen('/assets/js/ext/webfont-1.6.8.js', function() {
		WebFont.load({ google: { families: ['Open+Sans:300,400,600,700'] } });
	});

	// 2. Load other dependencies specified as query params
	var scripts = document.getElementsByTagName('script');
	var toLoad = [];
	for(var ix = 0; ix < scripts.length; ix++) {
		var qs = scripts[ix].src.replace(/^[^\#]+\#?/,'').split(',');
		for(var jx = 0; jx < qs.length; jx++) {
			toLoad.push(qs[jx].trim());
		}
	}
	for(var ix = 0; ix < toLoad.length; ix++) {
		if (toLoad[ix].length > 0) {
			loadScriptThen('/assets/js/'+toLoad[ix]+'.js', function() {});			
		}
	}
};

var serviceUrl = '/service/v1';

if(window.scriptsLoading) {
	console.log('scripts.js was loaded more than once so the subsequent load has been aborted - this probably means some resources you expect to be available are not');
} else {
	window.scriptsLoading = true;
	loadScripts();
}	