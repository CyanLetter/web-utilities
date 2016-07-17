describe("A test suite", function() {
	it("contains a simple sanity check", function() {
		expect(true).toBe(true);
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

describe("A set of conversions", function(){
	it ("returns a hex string given an rgb input", function() {
		expect(DL_.rgbToHex(255, 51, 153)).toBe("#ff3399"); // raging magenta, my favorite color
	});

	it ("returns an array of rgb values given a hexadecimal string input", function() {
		expect(DL_.hexToRgb("#ff3399")).toEqual({r: 255, g: 51, b: 153});
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
		expect(DL_.normalize(0, 1)).toEqual({x: 0, y: 1});
	});

	it ("returns the dot product of two vectors", function(){
		expect(DL_.dot(1, 2, 3, 4)).toBe(11);
	});

	it ("returns an unsigned angle between two vectors", function(){
		expect(DL_.getSimpleAngle(1, 0, 0, 1)).toBe(90);
	});

	it ("returns the signed angle difference between two vectors", function(){
		expect(DL_.getSignedAngle(1, 0, 0, 1)).toBe(-90);
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
		var controlArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
		var shuffleArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
		DL_.shuffle(shuffleArray);
		expect(shuffleArray).not.toEqual(controlArray);
	});
});

/****************************************************************

PARSING

****************************************************************/

// substrings and such from various other parts of the envinronment.

describe("a set of functions for parsing information from strings", function(){

	beforeEach(function(){
		spyOn(DL_, "getLocationSearch").and.returnValue("?v=153&nice=very&pterosaur=pleaseno");
	});

	it ("Returns the search query from window.location", function(){
		// This is really just capturing the jaminse spy, but still...
		expect(DL_.getLocationSearch()).toBe("?v=153&nice=very&pterosaur=pleaseno");
	});

	it ("Returns a variable from a query string in the URI", function(){
		expect(DL_.getQueryVariable("nice")).toBe("very");
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