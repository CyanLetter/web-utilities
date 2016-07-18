	/****************************************************************

	MATHS AND CONVERSIONS

	****************************************************************/

	/*
	 * Converting color types
	 * RGB (e.g. 224, 28, 95) to Hexadecimal (e.g. #e01c5f)
	 */
	DL_.rgbToHex = function (r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	};

	/*
	 * Converting color types
	 * Hexadecimal (e.g. #e01c5f) to RGB (e.g. 224, 28, 95)
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

	/*
	 * Round to significant digits, to help
	 * prevent excessively large floats.
	 * Do not use these functions where
	 * accuracy is key.
	 * Defaults to 2 decimal places.
	 */
	DL_.toSignificant = function(number, accuracy) {
		accuracy = accuracy || 2;
		return +number.toFixed(accuracy);
	};

	/*
	 * Degrees to Radians
	 */
	DL_.d2r = function (degrees) {
		return degrees * (Math.PI/180);
	};

	/*
	 * Radians to Degrees
	 */
	DL_.r2d = function (radians) {
		return radians * (180/Math.PI);
	};

	/*
	 * Round input to nearest quarter.
	 * Useful for rounding times from events that cannot 
	 * be guaranteed to fire more frequently than every
	 * 0.25s, e.g. HTML5 video timeupdate.
	 * See https://developer.mozilla.org/en-US/docs/Web/Events/timeupdate
	 * for more details on timeupdate granularity.
	 */
	DL_.roundNearQtr = function (number) {
		return +(Math.round(number * 4) / 4).toFixed(2);
	};

	/*
	 * Normalizes a vector2, such that |v1|=|v2|=1
	 * e.g. returns a vector of length 1
	 * Necessary for functions requiring acos
	 */
	DL_.normalize = function (x, y) {
		var length = Math.sqrt((x * x) + (y * y));
		return {x: x / length, y: y / length};
	};

	/*
	 * Dot product of two vectors
	 * e.g. multiply two vectors to return a scalar number
	 */
	DL_.dot = function (Ax, Ay, Bx, By) {
		return (Ax * Bx) + (Ay * By);
	};

	/*
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

	/*
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