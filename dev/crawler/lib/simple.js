var webpage = require('webpage'),
	args = require('system').args;

var CONFIG = JSON.parse(args[1]);

var stage = webpage.create(),
	final = webpage.create(),
	target = webpage.create(),
	consoleRef = console.log.bind(console);

stage.onConsoleMessage = final.onConsoleMessage = target.onConsoleMessage = consoleRef;
stage.onError = final.onError = target.onError = consoleRef;

openPage(stage, CONFIG.STAGE_URL, function(page){
	page.evaluate(enterFlowCookie, 'crawl');
});

openPage(target, CONFIG.TARGET_URL, function(page){
	var linksLoaded = 0;

	page.evaluate(gatherLinks).forEach(function(link, i, links){
		openPage(webpage.create(), CONFIG.PROXY_URL + link, function(page){
			if(++linksLoaded === links.length){
				openPage(final, CONFIG.FINAL_URL, onDone);
			}
		});
	});
});

function openPage(page, URL, callback){
	page.open(URL, function(status){
		console.log(URL + " loadded with status: " + status);
		if(status === 'success'){
			try{
				callback(page);
			}catch(e){
				console.log(e);
				onDone();
			}
		}else{
			onDone();
		}
	});
}

function enterFlowCookie(flow){
	window.onload = function(){
		document.querySelector('#flow-input').value = flow;
		document.querySelector('[type=button]').click();
	}
}

function gatherLinks(){
	var linksFromDOM = document.querySelector('#navbar').querySelectorAll('a');

	return Array.prototype.map.call(linksFromDOM, function(link){
		return link.href.replace(location.origin, '');
	});
}

function onDone(){
	console.log('Exiting Phantom...');
	phantom.exit();
}
