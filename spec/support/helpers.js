module.exports = this;

this.trySnippet = (cb) => {
	try {
		cb();
	}catch(e){
		return e.message;
	}
}