describe("A test suite", function() {
	it("contains a simple sanity check", function() {
		expect(true).toBe(true);
	});
});

// Physics section
describe("A set of physics helpers", function(){
	it ("Calculates a collision between two rects", function(){
		expect(DL_.boxIntersect(-2, 1, 5, 5, 2, 4, 10, 18)).toBe(true);
	});

	it ("Calculates no collision between two rects", function(){
		expect(DL_.boxIntersect(10, 10, 4, 5, 1, 2, 12, 8)).toBe(false);
	});

	it ("Calculates a collision between two circles", function(){
		expect(DL_.circleIntersect(1, 3, 12, -4, 0, 1)).toBe(true);
	});

	it ("Calculates no collision between two circles", function(){
		// The point of the decimals is that this would overlap
		// if it were a box intersect
		expect(DL_.circleIntersect(-1, 5, 3, 1.9, 7.9, 1)).toBe(false);
	});
});

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

	it ("returns a number in radians, given an input in degrees, accurate to seven decimal places", function(){
		expect(DL_.toSignificant(DL_.d2r(1), 7)).toBe(0.0174533);
	});

	it ("returns a number in degrees, given an input in radians, accurate to four decimal places", function(){
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

describe("A set of functions to randomize or return randomized things", function(){

});