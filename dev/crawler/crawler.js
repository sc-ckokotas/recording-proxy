const path = require('path'),
    phantomjs = require('phantomjs-prebuilt');

const CONFIG = require('../../config.json');

var program = phantomjs.exec(path.join(__dirname, 'lib/simple.js'), `http://localhost:${CONFIG.PORT}`);
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', () => {
    // do something on end
})
