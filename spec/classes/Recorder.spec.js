"use strict";

const Recorder = require('../../Recorder'),
	trySnippet = require('../support/helpers').trySnippet,
	NOOP = function noop(){},
	validMarker = {
		method: 'GET',
		path: '/foo'
	},
	altEndMarker = {
		method: 'GET',
		path: '/bar'
	};

var instance = null,
	errorMessage = null;

describe("Recorder class:", () => {
	describe("The constructor", () => {
		beforeEach(() => {
			instance = null;
			errorMessage = null;
		});

		it("should require three arguments.", () => {
			errorMessage = trySnippet(() => {
				instance = new Recorder;
			});
			expect(errorMessage).toBe('Recorder requires three arguments at construction: "startMarker", "endMarker", and "callback".');
			expect(instance).toBe(null);

			errorMessage = trySnippet(() => {
				instance = new Recorder(validMarker);
			});
			expect(errorMessage).toBe('Recorder requires three arguments at construction: "startMarker", "endMarker", and "callback".');
			expect(instance).toBe(null);

			errorMessage = trySnippet(() => {
				instance = new Recorder(null, validMarker);
			});
			expect(errorMessage).toBe('Recorder requires three arguments at construction: "startMarker", "endMarker", and "callback".');
			expect(instance).toBe(null);

			errorMessage = trySnippet(() => {
				instance = new Recorder(validMarker, validMarker);
			});
			expect(errorMessage).toBe('Recorder requires three arguments at construction: "startMarker", "endMarker", and "callback".');
			expect(instance).toBe(null);

			expect(new Recorder(validMarker, validMarker, NOOP) instanceof Recorder).toBe(true);
		});

		describe("should accept an object as it's first argument", () => {
			beforeEach(() => {
				instance = null;
				errorMessage = null;
			});

			it("and contain property 'method'.", () => {
				errorMessage = trySnippet(() => {
					instance = new Recorder({}, validMarker, NOOP);
				});
				expect(errorMessage).toBe('Recorder constructed with bad "startMarker"');
				expect(instance).toBe(null);

				errorMessage = trySnippet(() => {
					instance = new Recorder({path: validMarker.path}, validMarker, NOOP);
				});
				expect(errorMessage).toBe('Recorder constructed with bad "startMarker"');
				expect(instance).toBe(null);
			});

			it("and contain property 'path'.", () => {
				errorMessage = trySnippet(() => {
					instance = new Recorder({method: validMarker.method}, validMarker, NOOP);
				});
				expect(errorMessage).toBe('Recorder constructed with bad "startMarker"');
				expect(instance).toBe(null);
			});
		});

		describe("should accept an object as it's second argument", () => {
			beforeEach(() => {
				instance = null;
				errorMessage = null;
			});

			it("and contain property 'method'.", () => {
				errorMessage = trySnippet(() => {
					instance = new Recorder(validMarker, {}, NOOP);
				});
				expect(errorMessage).toBe('Recorder constructed with bad "endMarker"');
				expect(instance).toBe(null);

				errorMessage = trySnippet(() => {
					instance = new Recorder(validMarker, {path: validMarker.path}, NOOP);
				});
				expect(errorMessage).toBe('Recorder constructed with bad "endMarker"');
				expect(instance).toBe(null);
			});

			it("and contain property 'path'.", () => {
				errorMessage = trySnippet(() => {
					instance = new Recorder(validMarker, {method: validMarker.method}, NOOP);
				});
				expect(errorMessage).toBe('Recorder constructed with bad "endMarker"');
				expect(instance).toBe(null);
			});
		});

		it("should accept an function as it's third argument", () => {
			errorMessage = trySnippet(() => {
				instance = new Recorder(validMarker, validMarker, {});
			});
			expect(errorMessage).toBe('Recorder constructed with bad "callback"... Must be a function');
			expect(instance).toBe(null);
		});
	});

	describe("Each instance", () => {
		let reqStub = {
			headers: '1234567890-test',
			method: 'GET',
			path: '/foo'
		};

		describe("should have a 'middleware' property", () => {
			beforeEach(() => {
				instance = new Recorder(validMarker, altEndMarker, NOOP);
			});

			it("that is a function.", () => {
				expect(typeof instance.middleware).toBe('function');
			});

			it("that sets the '_recording' property to true when recieving a request matching it's startMarker", () => {
				instance.middleware(reqStub, {});
				expect(instance._recording).toBe(true);
			});

			it("that sets the '_key' property to the request that matched the startMarker", () => {
				instance.middleware(reqStub, {});
				expect(instance._key).toBe(JSON.stringify(reqStub));
			});
		});
	});

	describe("The prototype", () => {
		describe("should have a 'requestMatchesStart' method", () => {
			beforeEach(() => {
				errorMessage = null;
			});

			it("that requires one argument 'req'", () => {
				errorMessage = trySnippet(() => {
					Recorder.prototype.requestMatchesStart();
				});
				expect(errorMessage).toBe('Expected a request object.');
			});	

			it("that returns true when all properties in '_start' can be found in 'req'.", () => {
				var ret = Recorder.prototype.requestMatchesStart.call({
					_start: validMarker
				}, validMarker);
				expect(ret).toBe(true);
			});

			it("that returns true when all properties in '_start' can be found in 'req'.", () => {
				var ret = Recorder.prototype.requestMatchesStart.call({
					_start: validMarker
				}, {});
				expect(ret).toBe(false);
			});
		});

		describe("should have a 'requestMatchesEnd' method", () => {
			beforeEach(() => {
				errorMessage = null;
			});

			it("that requires one argument 'req'", () => {
				errorMessage = trySnippet(() => {
					Recorder.prototype.requestMatchesEnd();
				});
				expect(errorMessage).toBe('Expected a request object.');
			});
				

			it("that returns true when all properties in '_end' can be found in 'req' ", () => {
				var ret = Recorder.prototype.requestMatchesEnd.call({
					_end: validMarker
				}, validMarker);
				expect(ret).toBe(true);
			});

			it("that returns true when all properties in '_end' can be found in 'req' ", () => {
				var ret = Recorder.prototype.requestMatchesEnd.call({
					_end: validMarker
				}, {});
				expect(ret).toBe(false);
			});
		});

	});
});
