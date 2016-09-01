const path = require('path'),
    phantomjs = require('phantomjs-prebuilt');

const CONFIG = require('../../config.json'),
    LOCAL_HOST = `http://localhost:${CONFIG.PORT}`;

var program = phantomjs.exec(path.join(__dirname, 'lib/simple.js'), JSON.stringify({
    PROXY_URL: LOCAL_HOST, 
    STAGE_URL: `${LOCAL_HOST}/recording-proxy/stage`, 
    FINAL_URL: `${LOCAL_HOST}/recording-proxy/final`, 
    TARGET_URL: CONFIG.TARGET_URL
}));
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', () => {
    // do something on end
})
