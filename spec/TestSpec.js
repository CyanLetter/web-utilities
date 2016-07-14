describe("A test suite", function() {
	it("contains a simple sanity check", function() {
		expect(true).toBe(true);
	});
});

describe("A set of conversions", function(){
	it ("returns a hex string given an rgb input", function() {
		expect(DL_Util.rgbToHex(255, 51, 153)).toBe("#ff3399"); // raging magenta, my favorite color
	});

	it ("returns an array of rgb values given a hexadecimal string input", function() {
		expect(DL_Util.hexToRgb("#ff3399")).toEqual({r: 255, g: 51, b: 153});
	});

	it ("returns a number in radians, given an input in degrees, accurate to the default two decimal places", function(){
		expect(DL_Util.d2r(90)).toEqual(1.57);
	});

	it ("returns a number in radians, given an input in degrees, accurate to seven decimal places", function(){
		expect(DL_Util.d2r(1, 7)).toEqual(0.0174533);
	});

	it ("returns a number in degrees, given an input in radians, accurate to the default two decimal places", function(){
		expect(DL_Util.r2d(0.05)).toEqual(2.86);
	});

	it ("returns a number in degrees, given an input in radians, accurate to three decimal places", function(){
		expect(DL_Util.r2d(1, 3)).toEqual(57.296);
	});
});