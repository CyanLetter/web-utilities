describe("The first test suite", function() {
	it("Contains a simple sanity check", function() {
		expect(true).toBe(true);

		expect(typeof DL_).toBe("object");
		expect(typeof DL_.noop).toBe("function");
		expect(typeof DL_.noop()).toBe("undefined");
	});
});

/****************************************************************

PHYSICS

****************************************************************/

describe("A set of physics helpers", function(){
	it ("Calculates collision between two rects", function(){
		expect(DL_.boxIntersect(-2, 1, 5, 5, 2, 4, 10, 18)).toBe(true);
		expect(DL_.boxIntersect(10, 10, 4, 5, 1, 2, 12, 8)).toBe(false);
	});

	it ("Calculates collision between two circles", function(){
		expect(DL_.circleIntersect(1, 3, 12, -4, 0, 1)).toBe(true);
		// The point of the decimals is that this would overlap
		// if it were a box intersect
		expect(DL_.circleIntersect(-1, 5, 3, 1.9, 7.9, 1)).toBe(false);
	});
});

/****************************************************************

MATHS AND CONVERSIONS

****************************************************************/

// Maths and conversions section

describe("A set of math and conversion functions", function(){
	it ("returns a hex string given an rgb input", function() {
		expect(DL_.rgbToHex(255, 51, 153)).toBe("#ff3399"); // raging magenta, my favorite color
		expect(DL_.rgbToHex(42, 215, 252)).toBe("#2ad7fc");
	});

	it ("returns an array of rgb values given a hexadecimal string input", function() {
		expect(DL_.hexToRgb("#ff3399")).toEqual({r: 255, g: 51, b: 153});
		expect(DL_.hexToRgb("#2ad7fc")).toEqual({r: 42, g: 215, b: 252});
	});

	it ("expands a shorthand hex color code to a six character code", function(){
		var regex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		var hex = "#03F".replace(regex, DL_.expandHexShorthand);
		expect(hex).toBe("0033FF");
	});

	it ("returns a number rounded to two significant digits", function(){
		expect(DL_.toSignificant(5.23985769)).toBe(5.24);
	});

	it ("returns a number in radians, given an input in degrees, rounded to seven significant digits", function(){
		expect(DL_.toSignificant(DL_.d2r(1), 7)).toBe(0.0174533);
	});

	it ("returns a number in degrees, given an input in radians, rounded to four significant digits", function(){
		expect(DL_.toSignificant(DL_.r2d(1), 4)).toBe(57.2958);
	});

	it ("returns a number rounded to the nearest quarter", function(){
		expect(DL_.roundNearQtr(4.7825)).toBe(4.75);
	});

	it ("returns the normalized value of two vectors", function(){
		expect(DL_.normalize({x: 0, y: 0})).toEqual({x: 0, y: 0});
		expect(DL_.normalize({x: 0, y: 1})).toEqual({x: 0, y: 1});
		expect(DL_.normalize({x: 1, y: -1})).not.toEqual({x: 0, y: 0});
		expect(DL_.normalize({x: 50, y: 0})).toEqual({x: 1, y: 0});
	});

	it ("returns the dot product of two vectors", function(){
		expect(DL_.dot({x: 1, y: 2}, {x: 3, y: 4})).toBe(11);
	});

	it ("returns an unsigned angle between two vectors", function(){
		expect(DL_.getSimpleAngle({x: 1, y: 0}, {x: 0, y: 1})).toBe(90);
	});

	it ("returns the signed angle difference between two vectors", function(){
		expect(DL_.getSignedAngle({x: 1, y: 0}, {x: 0, y: 1})).toBe(-90);
	});

	it ("returns an angle based on the position from center", function(){
		expect(DL_.getClockAngle(0, -1)).toBe(0);
		expect(DL_.getClockAngle(0, 1)).toBe(180);
		expect(DL_.getClockAngle(1, -1)).toBe(45);
		expect(DL_.getClockAngle(1, 1)).toBe(135);
		expect(DL_.getClockAngle(-1, 1)).toBe(225);
		expect(DL_.getClockAngle(-1, -1)).toBe(315);
	});

	it ("returns the value a certain period along a quadratic curve", function(){
		expect(DL_.getPointOnQuadraticCurve(0, 99, -25, 0)).toBe(0);
		expect(DL_.getPointOnQuadraticCurve(0, 1, 2, 0.5)).toBe(1);
		expect(DL_.getPointOnQuadraticCurve(0, 1, 2, -0.5)).toBe(-1);
		expect(DL_.getPointOnQuadraticCurve(0, 15, 2, 0.75)).toBe(6.75);
	});

	it ("returns the value a certain period along a cubic curve", function(){
		expect(DL_.getPointOnCubicCurve(0, 1, 2, 3, 0)).toBe(0);
		expect(DL_.getPointOnCubicCurve(0, 1, 2, 3, 0.5)).toBe(1.5);
		expect(DL_.getPointOnCubicCurve(-5, 10, -10, 0, 0.5)).toBe(-0.625);
	});
});

/****************************************************************

DATA STRUCTURE TRAVERSAL

****************************************************************/

// objects, dictionaries, and searching through them

describe("A set of helpers for traversing data structures", function(){
	var testingArray = [
		{
			name: "Terrence",
			cats: true,
			dogs: false
		},
		{
			name: "Mina",
			cats: false,
			dogs: true
		},
		{
			name: "Pat",
			cats: false,
			dogs: true
		}
	];

	it ("creates a dictionary from an array of objects", function(){
		expect(DL_.createDictionaryFromArray(testingArray, "name")).toEqual({
			"Terrence": {
				name: "Terrence",
				cats: true,
				dogs: false
			},
			"Mina": {
				name: "Mina",
				cats: false,
				dogs: true
			},
			"Pat": {
				name: "Pat",
				cats: false,
				dogs: true
			}
		});
	});

	it ("Gets the first object in an array containing the given property and value", function(){
		expect(DL_.getObjectWithPropValue(testingArray, "dogs", true)).toEqual({
			name: "Mina",
			cats: false,
			dogs: true
		});
		expect(DL_.getObjectWithPropValue(testingArray, "name", "Brent")).toBe(null);
		expect(DL_.getObjectWithPropValue(testingArray, "fish", true)).toBe(null);
	});

	it ("Gets all objects in an array containing the given property and value", function(){
		expect(DL_.getObjectsWithPropValue(testingArray, "dogs", true)).toEqual([
			{
				name: "Mina",
				cats: false,
				dogs: true
			},
			{
				name: "Pat",
				cats: false,
				dogs: true
			}
		]);
	});
});

/****************************************************************

RANDOMIZATION

****************************************************************/

// Unit testing things which are inconsistent by definition - what fun!
// Yes, I know that's not strictly true. I was being facetious.

describe("A set of functions to randomize or return randomized things", function(){
	var testingArray = ["Terrence", "Mina", "Pat"];
	var testingObject = {
		"Terrence": {
			cats: true,
		},
		"Mina": {
			cats: false,
		},
		"Pat": {
			cats: false,
		}
	};

	it ("returns a random value from an array", function(){
		expect(DL_.randFromArray(testingArray)).toMatch(/(Mina|Terrence|Pat)/);
	});

	it ("returns a random item key from an object", function(){
		expect(DL_.randFromObject(testingObject)).toMatch(/(Mina|Terrence|Pat)/);
	});
	
	it ("returns an integer between and including two values passed", function(){
		var valid = true;
		for (var i = 0; i < 100; i++) {
			var rand = DL_.getRandomInt(2, 5);
			if (rand === 2 || rand === 3 || rand === 4 || rand === 5) {
				valid = true;
			} else {
				valid = false;
			}
		}
		
		expect(valid).toBe(true);
	});

	it ("returns either 1 or -1", function(){
		var results = {
			pos: 0,
			neg: 0,
			other: 0
		};
		for (var i = 0; i < 1000; i++) {
			var rand = DL_.randPosNeg();
			if (rand === 1) {
				results.pos += 1;
			} else if (rand === -1) {
				results.neg += 1;
			} else {
				results.other += 1;
			}
		}
		
		// enforces a fair-ish distribution
		// Still possible to fail this for no reason though.
		// Revise if it ever happens.
		expect(results.pos).toBeGreaterThan(400);
		expect(results.neg).toBeGreaterThan(400);
		expect(results.other).toBe(0);
	});

	it ("shuffles an array in place", function(){
		var emptyArray = [];
		var controlArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
		var shuffleArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
		DL_.shuffle(shuffleArray);
		DL_.shuffle(emptyArray);
		expect(shuffleArray).not.toEqual(controlArray);
		expect(emptyArray).toEqual([]);
	});
});

/****************************************************************

PARSING

****************************************************************/

// substrings and such from various other parts of the envinronment.

describe("a set of functions for parsing information from strings", function(){


	beforeEach(function(){
		spyOn(DL_, "getLocationSearch").and.returnValue("?v=153&nice=very&pterosaur=pleaseno");
		spyOn(console, 'error');
	});

	it ("Returns the search query from window.location", function(){
		// This is really just capturing the jasmine spy, but still...
		expect(DL_.getLocationSearch()).toBe("?v=153&nice=very&pterosaur=pleaseno");
	});

	it ("Returns a variable from a query string in the URI", function(){
		expect(DL_.getQueryVariable("nice")).toBe("very");
		expect(DL_.getQueryVariable("puddingpop")).toBe(null);
	});

	it ("Returns true due to the user agent reflecting an iDevice", function(){
		// we are setting the phantom js user agent in the Gruntfile
		// to match an iPhone 5s on iOS 9.3.2
		expect(DL_.mobilecheck()).toBe(true);
	});

	it ("Returns the file extension from a passed string", function(){
		expect(DL_.getFileType("giraffe_photo.jpg")).toBe("jpg");
		expect(DL_.getFileType("assets/style.css?v=87296345")).toBe("css");
	});

	it ("Gets the contents of a set of brackets in a string", function(){
		var testingObject = {
			"Terrence": {
				cats: true,
				names: ["Nimbus", "Itches", "Two Wolves"]
			},
			"Mina": {
				cats: false,
				names: []
			},
			"Pat": {
				cats: false,
				names: []
			}
		};
		var testingObjectString = JSON.stringify(testingObject);
		var testingString = "(((paren-theses ((hell)))))";
		var mismatchedParens = "(((does (not)) fully close )";
		var testingNumber = 12345654321;

		var resultOne = {
			"start": 1,
			"end": 26,
			"contents": "((paren-theses ((hell))))",
			"error": null
		};
		var resultTwo = {
			"start": 18,
			"end": 22,
			"contents": "hell",
			"error": null
		};

		expect(DL_.getBracketedContent(testingString, 1, {openChar: "(", closeChar: ")"})).toEqual(resultOne);
		expect(DL_.getBracketedContent(testingString, "(h", {openChar: "(", closeChar: ")", inclusive: false})).toEqual(resultTwo);
		expect(DL_.getBracketedContent(testingString, 2).error).toBe("Could not find { in data");

		expect(DL_.getBracketedContent(testingObject, 0).contents).toBe(testingObjectString);
		expect(DL_.getBracketedContent(testingObject, 0, {openChar: "[", closeChar: "]", inclusive: false}).contents).toBe('"Nimbus","Itches","Two Wolves"');
		expect(DL_.getBracketedContent(testingObject, {index:0}).error).toBe("Index [object Object] must be of type string or number");

		expect(DL_.getBracketedContent(mismatchedParens, 0, {openChar: "(", closeChar: ")"}).error).toBe("Could not find complete matching bracket set");
		expect(DL_.getBracketedContent(testingNumber, 0).error).toBe("Data must be an object or a string!");
		
	});
	
});

/****************************************************************

VALIDATION

****************************************************************/

describe("A set of functions for validating input and capabilities", function(){

	it ("Returns whether the device has touch capabilities.", function(){
		expect(DL_.isTouchDevice()).toBe(true);
		// Yes, true. PhantomJS reports itself as a touch browser
		// for reasons. Github issue for reference:
		// https://github.com/ariya/phantomjs/issues/10375 
	});

	it ("Returns whether a value is an integer", function(){
		expect(DL_.isInt(42)).toBe(true);
		expect(DL_.isInt(42.00000001)).toBe(false);
		expect(DL_.isInt("Forty Two")).toBe(false);
		expect(DL_.isInt(NaN)).toBe(false);
		expect(DL_.isInt(true)).toBe(false);
	});

	it ("Returns whether an object contains any actual content", function(){
		expect(DL_.isObjectEmpty({})).toBe(true);
		expect(DL_.isObjectEmpty({foo: "bar"})).toBe(false);
		expect(DL_.isObjectEmpty({foo: null})).toBe(false);
		expect(DL_.isObjectEmpty({foo: undefined})).toBe(false);
	});

});

/****************************************************************

TEXT AND LAYOUT

****************************************************************/

describe("A set of functions to modify text to be more consistent and appealing", function(){
	var paragraph, paragraphTwo;

	beforeEach(function(){
		paragraph = $("<p>");
		paragraph.attr("id", "paragraph-test");
		paragraph.html("Should not allow widows.");
		$(document.body).append(paragraph);

		paragraphTwo = $("<p>");
		paragraphTwo.html("This should also not contain widows");
		$(document.body).append(paragraphTwo);

		DL_.preventWidows($("p"));
	});

	afterEach(function(){
		paragraph.remove();
		paragraph = null;
		paragraphTwo.remove();
		paragraphTwo = null;
	});

	it ("Adds a non-breaking space between the last words in all matching selectors.", function(){

		expect($("#paragraph-test").html()).toBe("Should not allow&nbsp;widows.");
		expect($("p").eq(1).html()).toBe("This should also not contain&nbsp;widows");
	});

	it ("It's leftpad, and it's not dependent on npm.", function(){
		expect(DL_.leftpad(4, 3, 0)).toBe("004");
		// pads with spaces by default
		expect(DL_.leftpad('text', 10)).toBe("      text");
	});
});

/****************************************************************

DATE AND TIME

****************************************************************/

describe ("A test suite for some functions related to the more temporal aspects of the universe.", function(){
	var value;

	beforeEach(function(){
		value = 0;
	});

	it ("Sets a timer which can be paused and resumed", function(done){
		var timer = new DL_.Timer(function(){
			value += 1;
		}, 25);

		setTimeout(function(){
			expect(value).toBe(0);
			timer.pause();
		}, 10);

		setTimeout(function(){
			expect(value).toBe(0);
			timer.resume();
		}, 100);

		setTimeout(function(){
			expect(value).toBe(1);
			done();
		}, 500);
	});

	it ("Sets a timer which can be destroyed", function(done){
		var timer = new DL_.Timer(function(){
			value += 1;
		}, 250);

		setTimeout(function(){
			expect(value).toBe(0);
			timer.destroy();
		}, 100);

		setTimeout(function(){
			expect(value).toBe(0);
			done();
		}, 500);
	});

	it ("Prevents a given function from firing more than once per interval", function(done){
		var increment = DL_.debounce(function(){
			value += 1;
		}, 20, true);
		
		increment();
		increment();
		expect(value).toBe(1);

		setTimeout(function(){
			increment();
			expect(value).toBe(1);
		}, 10);

		setTimeout(function(){
			increment();
			increment();
			expect(value).toBe(2);
			done();
		}, 40);
	});

	it ("Returns a date string in a sane, custom format", function(){
		var testDate = new Date(1991, 6, 10, 14, 23);
		var midnight = new Date(2000, 0, 0, 0, 0);
		expect(testDate.getFullYear()).toBe(1991);
		expect(DL_.customDate("#YYYY#")).not.toBe("1991");
		expect(DL_.customDate("#MM#-#DD#-#YY#", testDate)).toBe("07-10-91");
		expect(DL_.customDate("Party like it's #YYYY#", testDate)).toBe("Party like it's 1991");
		expect(DL_.customDate("#MMM# #D#, #YYYY#", testDate)).toBe("Jul 10, 1991");
		expect(DL_.customDate("#h#:#m##ampm#", testDate)).toBe("2:23pm");
		expect(DL_.customDate("#hh#:#mm##ampm#", midnight)).toBe("12:00am");
	});
});

/****************************************************************

ASSET MANAGEMENT

****************************************************************/

describe("A set of functions for loading and handling page assets", function(){

	it ("Returns an array of image elements when given an array of image urls", function(){
		var basePath = window.location.href.split('/');
		basePath = basePath.slice(0, basePath.length - 1).join("/");

		var imageArray = DL_.preloadImageArray(["./abc.jpg", basePath + "/123.jpg"]);

		expect(imageArray[0].nodeType).toBe(Node.ELEMENT_NODE);
		expect(imageArray[0].src).toEqual(basePath + "/abc.jpg");
		expect(imageArray[1].nodeType).toBe(Node.ELEMENT_NODE);
		expect(imageArray[1].src).toEqual(basePath + "/123.jpg");
	});
});

/****************************************************************

POLYFILLS

****************************************************************/

describe("A set of polyfills", function(){

	it ("Add the 'includes' prototype function, if not available", function(){

		String.prototype.includes = undefined;
		// ensure mutability
		expect(typeof String.prototype.includes).toBe("undefined");

		DL_.polyfillStringIncludes();

		expect(typeof String.prototype.includes).not.toBe("undefined");
		expect("The quick brown fox".includes("quick")).toBe(true);
		expect("The quick brown fox".includes("giraffe")).toBe(false);
		expect("There are 7 giraffes".includes(7)).toBe(true);
	});

	it ("Adds a console object if it does not exist, for old IE", function(){

		window.console = undefined;
		// ensure mutability
		expect(typeof window.console).toBe("undefined");

		DL_.polyfillConsole();

		expect(typeof window.console).not.toBe("undefined");
		console.log("Running some unit tests");
		console.error("Oh no!");

		expect(window.consolearray).toEqual(["Running some unit tests", "Oh no!"]);
	});

	it ("Adds a Math.sign method if none exists", function(){

		Math.sign = undefined;
		expect(typeof Math.sign).toBe("undefined");

		DL_.polyfillMathSign();
		expect(typeof Math.sign).not.toBe("undefined");
		expect(Math.sign(0)).toBe(0);
		expect(Math.sign(0.1)).toBe(1);
		expect(Math.sign(-0.1)).toBe(-1);
		expect(Math.sign(-235e-12)).toBe(-1);
		expect(Math.sign(3.575e9)).toBe(1);
		expect(Math.sign("foo")).toEqual(NaN);
	});

	it ("Adds a CustomEvent constructor if none exists", function(){
		var eventSpy = jasmine.createSpy();
		window.addEventListener("jasmineCustomEvent", eventSpy);

		window.CustomEvent = undefined;
		expect(typeof window.CustomEvent).toBe("undefined");

		DL_.polyfillCustomEvent();
		expect(typeof window.CustomEvent).not.toBe("undefined");

		expect(eventSpy).not.toHaveBeenCalled();

		dispatchEvent(new CustomEvent("jasmineCustomEvent"));
		expect(eventSpy).toHaveBeenCalled();
	});
});