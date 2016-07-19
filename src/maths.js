	/****************************************************************

	MATHS AND CONVERSIONS

	****************************************************************/

	/**
	 * Converts RGB color values to a hexadecimal color code.
	 * 
	 * @function DL_.rgbToHex
	 * @param {integer} r - The red channel value
	 * @param {integer} g - The green channel value
	 * @param {integer} b - The blue channel value
	 * @returns {string} Hexadecimal color code with octothorpe prepended.
	 * @example
	 * // "#ff3399"
	 * var hexColor = DL_.rgbToHex(255, 51, 153);
	 */
	DL_.rgbToHex = function (r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	};

	/**
	 * @typedef Rgb
	 * @type Object
	 * @property {integer} r - The red channel value
	 * @property {integer} g - The green channel value
	 * @property {integer} b - The blue channel value
	 */

	/**
	 * Converts a hexadecimal color code to an object with RGB values.
	 * Can take both short (e.g. #F00) and long (e.g. #FF0000) values.
	 * 
	 * @function DL_.hexToRgb
	 * @param {string} hex - The hex color code to be converted
	 * @returns {Rgb} The object containing the converted r, g, and b values.
	 * @example
	 * var rgbColor = DL_.hexToRgb("#2ad7fc");
	 * // rgbColor === {
	 * //   r: 42, 
	 * //   g: 215, 
	 * //   b: 252
	 * // }
	 */
	DL_.hexToRgb = function (hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(match, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	};

	/**
	 * Round to significant digits, to help
	 * prevent excessively large floats.
	 * Do not use where accuracy matters.
	 * Defaults to 2 decimal places.
	 *
	 * @function DL_.toSignificant
	 * @param {number} number - The number to be rounded
	 * @param {integer} [accuracy=2] - The number of significant digits to round to
	 * @returns {number} The rounded number.
	 * @example
	 * // equals 5.24
	 * var withDefaultValues = DL_.toSignificant(5.23985769);
	 *
	 * // equals 5.2398577
	 * var withOptionalValue = DL_.toSignificant(5.23985769152, 7);
	 */
	DL_.toSignificant = function(number, accuracy) {
		accuracy = accuracy || 2;
		return +number.toFixed(accuracy);
	};

	/**
	 * Converts a number in degrees to radians.
	 *
	 * @function DL_.d2r
	 * @param {number} degrees - The number in degrees to be converted.
	 * @returns {number} The converted value in radians.
	 * @example
	 * // equals 1.5707963267948966
	 * var radians = DL_.d2r(90);
	 *
	 * // Rounded to two significant digits
	 * // equals 3.14
	 * var rounded = DL_.toSignificant( DL_.d2r(180) );
	 */
	DL_.d2r = function (degrees) {
		return degrees * (Math.PI/180);
	};

	/**
	 * Converts a number in radians to degrees.
	 *
	 * @function DL_.r2d
	 * @param {number} radians - The number in radians to be converted.
	 * @returns {number} The converted number in degrees.
	 * @example
	 * // equals 286.4788975654116
	 * var degrees = DL_.r2d(5);
	 *
	 * // Rounded to two significant digits
	 * // equals 180
	 * var rounded = DL_.toSignificant( DL_.r2d(3.141592653589793) );
	 */
	DL_.r2d = function (radians) {
		return radians * (180/Math.PI);
	};

	/**
	 * Round input to nearest quarter.
	 * Useful for rounding times from events that cannot 
	 * be guaranteed to fire more frequently than every
	 * 0.25s, e.g. HTML5 video timeupdate.
	 * See https://developer.mozilla.org/en-US/docs/Web/Events/timeupdate
	 * for more details on timeupdate granularity.
	 *
	 * @function DL_.roundNearQtr
	 */
	DL_.roundNearQtr = function (number) {
		return +(Math.round(number * 4) / 4).toFixed(2);
	};

	/**
	 * Normalizes a vector2, such that |v1|=|v2|=1
	 * e.g. returns a vector of length 1
	 * Necessary for functions requiring acos
	 */
	DL_.normalize = function (x, y) {
		var length = Math.sqrt((x * x) + (y * y));
		return {x: x / length, y: y / length};
	};

	/**
	 * Dot product of two vectors
	 * e.g. multiply two vectors to return a scalar number
	 */
	DL_.dot = function (Ax, Ay, Bx, By) {
		return (Ax * Bx) + (Ay * By);
	};

	/**
	 * Returns an angle, in degrees, between two vectors.
	 * Applies arc cos to the dot product of the two vectors.
	 * Range is 0 - 180. Does not give a sign, or full 360 rotation.
	 * Formulas gathered from http://www.euclideanspace.com/maths/algebra/vectors/angleBetween/
	 * because I remember none of this from High School.
	 */
	DL_.getSimpleAngle = function (Ax, Ay, Bx, By) {
		var aNorm = DL_.normalize(Ax, Ay);
		var bNorm = DL_.normalize(Bx, By);
		return Math.acos( (aNorm.x * bNorm.x) + (aNorm.y * bNorm.y) ) * (180/Math.PI);
	};

	/**
	 * Returns the signed angle of vector B 
	 * relative to vector A, in degrees.
	 * Put another way, it returns the direction 
	 * and amount you would have to rotate to reach
	 * the direction of vector B from vector A
	 */
	DL_.getSignedAngle = function (Ax, Ay, Bx, By) {
		var aNorm = DL_.normalize(Ax, Ay);
		var bNorm = DL_.normalize(Bx, By);
		return (Math.atan2(aNorm.y, aNorm.x) - Math.atan2(bNorm.y, bNorm.x)) * (180/Math.PI);
	};