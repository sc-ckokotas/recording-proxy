const path = require('path');
const phantomjs = require('phantomjs-prebuilt');

var program = phantomjs.exec(path.join(__dirname, 'lib/phantom.js'));
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', () => {
  // do something on end
	console.log(arguments)
})
