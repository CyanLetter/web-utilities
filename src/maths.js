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
		// Expand shorthand form
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, DL_.expandHexShorthand);

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	};

	/**
	 * Replacement function for regex to expand
	 * shorthand hex form (e.g. "03F") to full form (e.g. "0033FF").
	 * Used by DL_.hexToRgb.
	 * 
	 * @function DL_.expandHexShorthand
	 * @param {string} match - The regex match
	 * @param {string} r - First capture group
	 * @param {string} g - Second capture group
	 * @param {string} b - Third capture group
	 * @returns {string} The expanded, six character hex value.
	 * @example
	 * var regex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	 * var hex = "#03F".replace(regex, DL_.expandHexShorthand);
	 * // hex === "0033FF";
	 */
	DL_.expandHexShorthand = function(match, r, g, b) {
		return r + r + g + g + b + b;
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
	 * @param {number} number - The number to be rounded
	 * @returns {number} The resulting number, rounded to the nearest of .0, .25, .5, or .75
	 * @example
	 * // returns 5.25
	 * var roundedNumber = DL_.roundNearQtr(5.17);
	 */
	DL_.roundNearQtr = function (number) {
		return +(Math.round(number * 4) / 4).toFixed(2);
	};

	/**
	 * @typedef Vector2
	 * @type Object
	 * @property {number} x - The x value of the vector
	 * @property {number} y - The y value of the vector
	 */

	/**
	 * Normalizes a vector2, such that |v1|=|v2|=1
	 * e.g. returns a vector of length 1
	 * Necessary for functions requiring acos
	 *
	 * @function DL_.normalize
	 * @param {Vector2} vector - An object containing x and y values
	 * @returns {Vector2} The resulting normalized x and y values
	 * @example
	 * // returns {x: 0, y: 1}
	 * var verticalLine = DL_.normalize({x: 0, y: 5});
	 *
	 * // returns {x: 0.9805806756909202, y: 0.19611613513818404}
	 * var tiltedLine = DL_.normalize({x: 5, y: 1});
	 */
	DL_.normalize = function (vector) {
		if (vector.x === 0 && vector.y === 0) {
			return {x: 0, y: 0};
		}
		var length = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
		return {x: vector.x / length, y: vector.y / length};
	};

	/**
	 * Dot product of two vectors
	 * e.g. multiply two vectors to return a scalar number
	 *
	 * @function DL_.dot
	 * @param {Vector2} vectorA - The first vector object containing x and y values
	 * @param {Vector2} vectorB - The second vector object containing x and y values
	 * @returns {number} - A single number, the dot product of the two vectors
	 * @example
	 * // returns 11
	 * var simpleDot = DL_.dot({x: 1, y: 2}, {x: 3, y: 4});
	 *
	 * // returns 0; For angle calculation
	 * var normalizedDot = DL_.dot(normalize({x: 10, y: 0}), normalize({x: 0, y: 5}));
	 */
	DL_.dot = function (vectorA, vectorB) {
		return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
	};

	/**
	 * Returns an angle, in degrees, between two vectors.
	 * Applies arc cos to the dot product of the two vectors.
	 * Range is 0 - 180, unsigned
	 * Formulas gathered from http://www.euclideanspace.com/maths/algebra/vectors/angleBetween/
	 * because I remember none of this from High School.
	 *
	 * @function DL_.getSimpleAngle
	 * @param {Vector2} vectorA - The first vector representing the starting angle
	 * @param {Vector2} vectorB - The second vector representing the destination angle
	 * @returns {number} - A single number, from 0 - 180 degrees
	 * @example
	 * // returns 90
	 * var angle = DL_.getSimpleAngle({x:0, y:1}, {x:-1, y: 0});
	 */
	DL_.getSimpleAngle = function (vectorA, vectorB) {
		return DL_.r2d(Math.acos(DL_.dot(DL_.normalize(vectorA), DL_.normalize(vectorB))));
	};

	/**
	 * Returns the signed angle of vector B 
	 * relative to vector A, from -180 to 180 degrees.
	 * Put another way, it returns the direction 
	 * and amount you would have to rotate
	 * to reach vector B from vector A
	 *
	 * @function DL_.getSignedAngle
	 * @param {Vector2} vectorA - The first vector representing the starting angle
	 * @param {Vector2} vectorB - The second vector representing the destination angle
	 * @returns {number} - A single number, from -180 - 180 degrees
	 * @example
	 * // returns -90
	 * var angle = DL_.getSignedAngle({x:0, y:1}, {x:-1, y: 0});
	 */
	DL_.getSignedAngle = function (vectorA, vectorB) {
		var aNorm = DL_.normalize(vectorA);
		var bNorm = DL_.normalize(vectorB);
		return DL_.r2d((Math.atan2(aNorm.y, aNorm.x) - Math.atan2(bNorm.y, bNorm.x)));
	};

	/**
	 * Returns an angle from 0 - 360 degrees
	 * based on the given coordinates, 
	 * and a center point of 0, 0.
	 * Angle is given from 12:00 running clockwise,
	 * so 12:01 is 1deg, and 11:59 is 359deg
	 *
	 * @function DL_.getClockAngle
	 * @param {number} x - x coordinate
	 * @param {number} y - y coordinate
	 * @returns {number} - number from 0 - 360 degrees
	 * @example
	 * // returns 225 - positive y values are down
	 * var angle = DL_.getClockAngle(-1, 1);
	 */
	DL_.getClockAngle = function(x, y) {
		var angle = Math.atan2(y, x);
		if (x >= 0 && y <= 0) {
			// polar quadrant 1
			angle += (Math.PI / 2);
		} else if (x <= 0 && y <= 0) {
			// polar quadrant 2
			angle += (Math.PI * 2.5);
			
		} else if (x <= 0 && y >= 0) {
			// polar quadrant 3
			angle += (Math.PI / 2);
		} else if (x >= 0 && y >= 0) {
			// polar quadrant 4
			angle += (Math.PI / 2);
		}

		return DL_.r2d(angle);
	};

	/**
	 * Returns a value based on a quadratic timing function.
	 * Useful for finding points on a bezier curve.
	 * To find a point on a bezier curve, you need to run this
	 * for the x and y values individually
	 *
	 * @function DL_.getPointOnQuadraticCurve
	 * @param {number} p0 - Start value for curve
	 * @param {number} p1 - Anchor value for curve
	 * @param {number} p2 - End value for curve
	 * @param {number} t - time, or the distance travelled along curve, from 0 - 1
	 * @returns {number} - value on curve based on time
	 * @example
	 * // Get point on simple quadratic curve
	 * var start = {x: 0, y: 0};
	 * var handle = {x: 1, y: 2};
	 * var end = {x: 2, y: 0};
	 * var time = 0.75;
	 * var point = {
	 *   x: DL_.getPointOnQuadraticCurve(start.x, handle.x, end.x, time),
	 *   y: DL_.getPointOnQuadraticCurve(start.y, handle.y, end.y, time)
	 * };
	 */
	DL_.getPointOnQuadraticCurve = function(p0, p1, p2, t) {
		return (1 - t) * ((1 - t) * p0 + (t * p1)) + t * ((1 - t) * p1 + (t * p2));
	};

	/**
	 * Same as quadratic curve, but with two anchor points
	 *
	 * @function DL_.getPointOnCubicCurve
	 * @param {number} p0 - Start value for curve
	 * @param {number} p1 - Anchor value for start point
	 * @param {number} p2 - Anchor value for end point
	 * @param {number} p3 - End value for curve
	 * @param {number} t - time, or the distance travelled along curve, from 0 - 1
	 * @returns {number} - value on curve based on time
	 * @example
	 * // Get array of points along cubic curve
	 *
	 * var start = {x: 0, y: 0};
	 * var handle1 = {x: 3, y: 5};
	 * var handle2 = {x: 7, y: -5};
	 * var end = {x: 10, y: 0};
	 * var increments = 1 / 10;
	 * var points = [];
	 * var time = 0;
	 * while (time <= 1) {
	 *   points.push({
	 *     x: DL_.getPointOnCubicCurve(start.x, handle1.x, handle2.x, end.x, time),
	 *     y: DL_.getPointOnCubicCurve(start.y, handle1.y, handle2.y, end.y, time)
	 *   });
	 *   time += increments;
	 * }
	 */
	DL_.getPointOnCubicCurve = function(p0, p1, p2, p3, t) {
		return (p0 * Math.pow(1 - t, 3)) + (3 * p1 * t * Math.pow(1 - t, 2)) + (3 * p2 * (Math.pow(t, 2) - Math.pow(t, 3))) + (p3 * Math.pow(t, 3));
	};