// page setup //////////////////////////////////////////////////////////////////////////////

var page = require('webpage').create();
page.onConsoleMessage = console.log.bind(console);
page.open('http://localhost:8001', function(status) {
	console.log("Status: " + status);
	if(status === 'success'){
		try{
			injectScript('https://code.jquery.com/jquery-3.1.0.min.js', onPageLoad);
		}catch(e){
			console.log(e);
			onDone();
		}
	}else{
		console.log('Page failed to load...');
		onDone();
	}
});

// page exectution ////////////////////////////////////////////////////////////////////////

function injectScript(url, cb){
	var script = document.createElement('script');
	script.src = url;

	script.onload = cb;
	document.body.appendChild(script);
}

function onPageLoad(){
	page.evaluate(function(){
		var fields = document.querySelectorAll('input[type="text"],input[type="password"]');
		var submits = document.querySelectorAll('input[type="submit"]');
		var toInput = [
			'foo',
			'bar',
			'blarg',
			'honk',
			'apples'
		];

		itterate(fields, function(elem){
			console.log(elem);
			elem.value = toInput.shift();
		});

		itterate(submits, function(elem){
			console.log(elem)
			elem.click();
		});

		function itterate(target, callback){
			if(target.toString() === ({}).toString()){
				Object.keys(target).forEach(function(key){
					callback(key, target[key]);
				});
			}else{
				Array.prototype.forEach.call(target, callback);
			}
		}
	});

	console.log('Page evaluation complete...');
	onDone();
}

function onDone(){
	console.log('Exiting Phantom...');
	phantom.exit();
}
