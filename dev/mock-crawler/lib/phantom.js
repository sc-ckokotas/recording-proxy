var page = require('webpage').create();
page.open('http://localhost:8001', function(status) {
	console.log("Status: " + status);
	if(status === 'success'){

	}else{
		// something went wrong
	}
	phantom.exit();
});
