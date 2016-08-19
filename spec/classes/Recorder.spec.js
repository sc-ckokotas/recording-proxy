"use strict";

const Recorder = require('../../Recorder');

describe("Recorder class:", () => {

	/**
	 * An express middleware instance
	 */

	let validMarker = {
		method: 'GET',
		path: '/foo'
	};

	describe("The constructor", () => {
		var instance = null;

		it("should require two arguments.", () => {
			try{
				instance = new Recorder;
			}catch(e){
				expect(e.message).toBe('Recorder requires two arguments at construction.');
			} expect(instance).toBe(null);

			try{
				instance = new Recorder(validMarker);
			}catch(e){
				expect(e.message).toBe('Recorder requires two arguments at construction.');
			} expect(instance).toBe(null);

			try{
				instance = new Recorder(null, validMarker);
			}catch(e){
				expect(e.message).toBe('Recorder requires two arguments at construction.');
			} expect(instance).toBe(null);

			expect(new Recorder(validMarker, validMarker) instanceof Recorder).toBe(true);
		});

		describe("should accept an object as it's first argument", () => {
			it("and contain property 'method'.", () => {
				try{
					instance = new Recorder({}, validMarker);
				}catch(e){
					expect(e.message).toBe('Recorder constructed with bad "startMarker"');
				} expect(instance).toBe(null);

				try{
					instance = new Recorder({path: validMarker.path}, validMarker)
				}catch(e){
					expect(e.message).toBe('Recorder constructed with bad "startMarker"');
				} expect(instance).toBe(null);
			});

			it("and contain property 'path'.", () => {
				try{
					instance = new Recorder({method: validMarker.method}, validMarker)
				}catch(e){
					expect(e.message).toBe('Recorder constructed with bad "startMarker"');
				} expect(instance).toBe(null);
			});
		});

		describe("should accept an object as it's second argument", () => {
			it("and contain property 'method'.", () => {
				try{
					instance = new Recorder(validMarker, {});
				}catch(e){
					expect(e.message).toBe('Recorder constructed with bad "endMarker"');
				} expect(instance).toBe(null);

				try{
					instance = new Recorder(validMarker, {path: validMarker.path})
				}catch(e){
					expect(e.message).toBe('Recorder constructed with bad "endMarker"');
				} expect(instance).toBe(null);
			});

			it("and contain property 'path'.", () => {
				try{
					instance = new Recorder(validMarker, {method: validMarker.method});
				}catch(e){
					expect(e.message).toBe('Recorder constructed with bad "endMarker"');
				} expect(instance).toBe(null);
			});
		});
	});

	describe("Each instance", () => {
		var instance = null;
		var reqStub = {
			headers: '1234567890-test',
			method: 'GET',
			path: '/foo'
		};

		beforeEach(() => {
			instance = new Recorder(validMarker, validMarker);
		});

		describe("should have a 'middleware' property", () => {
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
});
