var webpage = require('webpage'),
	targetPage = webpage.create(),
	args = require('system').args,
	consoleRef = console.log.bind(console),
	targetUrl = args[1];

targetPage.onConsoleMessage = consoleRef;
targetPage.onError = consoleRef;

targetPage.open(targetUrl, function(status) {
	console.log("Target Page loadded with status: " + status);
	if(status === 'success'){
		try{
			onPageLoad();
		}catch(e){
			console.log(e);
			onDone();
		}
	}else{
		onDone();
	}
});

function onPageLoad(){
	var links = [],
		loaded = 0;

	targetPage.includeJs('https://code.jquery.com/jquery-3.1.0.min.js', function(){
		links = targetPage.evaluate(gatherLinks);
		links.forEach(function(link){
			openOtherPage(link, function(status){
				console.log('Page: "' + link + '" was loadded with status: "' + status + '"');
				if(++loaded === links.length){
					console.log('Page evaluation complete...');
					onDone();
				}
			});
		});
	});
}

function gatherLinks(){
	var linksFromDOM = document.querySelector('#navbar').querySelectorAll('a');

	return Array.prototype.map.call(linksFromDOM, function(link){
		return link.href;
	});
}

function openOtherPage(url, callback){
	var page = webpage.create();
	page.open(url, callback);
}

function onDone(){
	console.log('Exiting Phantom...');
	phantom.exit();
}
