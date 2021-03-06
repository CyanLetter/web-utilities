/*******************************************************************
	This namespacing pattern taken from 
	http://addyosmani.com/blog/essential-js-namespacing/

	namespace (our namespace name) and undefined are passed here
	to ensure 1. namespace can be modified locally and isn't
	overwritten outside of our function context
	2. the value of undefined is guaranteed as being truly
	undefined. This is to avoid issues with undefined being
	mutable pre-ES5.
 *******************************************************************/

(function ( DL_, undefined ) {

	/** 
	 * @namespace DL_
	 */
	DL_ = DL_ || {};

	/**
	 * A predefined noop, so we can make efficient self destroying functions and such.
	 * @function noop
	 * @example
	 * var fireOnce = function() {
	 *   // do something, then redefine self to a noop
	 *   fireOnce = DL_.noop;
	 * }
	 */
	DL_.noop = function (){};

	/****************************************************************

	PHYSICS

	****************************************************************/
	
	/**
	 * Generic intersect check with square bounding box.
	 * Assumes x: 0, y: 0 is the top left corner
	 * for both objects and the screen
	 *
	 * @function boxIntersect
	 * @param {float} aX - The x position of the first object.
	 * @param {float} aY - The y position of the first object.
	 * @param {float} aW - The width of the first object.
	 * @param {float} aH - The height of the first object.
	 * @param {float} bX - The x position of the second object.
	 * @param {float} bY - The y position of the second object.
	 * @param {float} bW - The width of the second object.
	 * @param {float} bH - The height of the second object.
	 * @returns {bool} True if there is an intersection.
	 * @example
	 * var rect1 = {
	 *   x: -2,
	 *   y: 1,
	 *   width: 5,
	 *   height: 5
	 * };
	 * var rect2 = {
	 *   x: 2,
	 *   y: 4,
	 *   width: 10,
	 *   height: 18
	 * };
	 * // returns true
	 * DL_.boxIntersect(rect1.x, rect1.y, rect1.width, rect1.height, rect2.x, rect2.y, rect2.width, rect2.height);
	 */
	DL_.boxIntersect = function (aX, aY, aW, aH, bX, bY, bW, bH) {
		return (
			aX < bX + bW &&		// left edge of A is less than right edge of B
			aX + aW > bX &&		// right edge of A is greater than left edge of B
			aY < bY + bH &&		// top edge of A is less than bottom edge of B
			aY + aH > bY 		// bottom edge of A is greater than top edge of B
		);
	};

	/**
	 * Intersect check with circular boundaries.
	 * Dependent on anchor point.
	 *
	 * @function circleIntersect
	 * @param {float} x1 - The x position of the first object.
	 * @param {float} y1 - The y position of the first object.
	 * @param {float} r1 - The radius of the first object.
	 * @param {float} x2 - The x position of the second object.
	 * @param {float} y2 - The y position of the second object.
	 * @param {float} r2 - The radius of the second object.
	 * @returns {bool} True if there is an intersection.
	 * @example
	 * var circ1 = {
	 *   x: 1,
	 *   y: 3,
	 *   radius: 12
	 * };
	 * var circ2 = {
	 *   x: -4,
	 *   y: 0,
	 *   radius: 1
	 * };
	 * // returns true
	 * DL_.circleIntersect(circ1.x, circ1.y, circ1.radius, circ2.x, circ2.y, circ2.radius);
	 */
	DL_.circleIntersect = function (x1, y1, r1, x2, y2, r2) {
		var xd = x1 - x2;
		var yd = y1 - y2;
		var rt = r2 + r1;
		return (xd * xd + yd * yd <= rt * rt);
	};

	/****************************************************************

	MATHS AND CONVERSIONS

	****************************************************************/

	/**
	 * Converts RGB color values to a hexadecimal color code.
	 * 
	 * @function rgbToHex
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
	 * @function hexToRgb
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
	 * @function expandHexShorthand
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
	 * @function toSignificant
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
	 * @function d2r
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
	 * @function r2d
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
	 * @function roundNearQtr
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
	 * @function normalize
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
	 * @function dot
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
	 * @function getSimpleAngle
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
	 * @function getSignedAngle
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
	 * @function getClockAngle
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
	 * @function getPointOnQuadraticCurve
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
	 * @function getPointOnCubicCurve
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

	/****************************************************************

	DATA STRUCTURES

	****************************************************************/

	/**
	 * Takes an array of objects, and returns a new object
	 * using a specific property as keys.
	 * Useful when you need to look up the associated object
	 * of a certain property many times.
	 * Data must be consistent. Key values should be present
	 * and unique in all objects to return a complete dict
	 *
	 * @function createDictionaryFromArray
	 * @param {array} array - Array of objects
	 * @param {string} key - object key to use for dictionary keys
	 * @returns {object} - Object using key values as keys
	 *
	 * @example
	 * var people = [
	 * 		{name: "Terrence", cats: true},
	 * 		{name: "Mina", cats: false}
	 * ];
	 * var peopleDict = DL_.createDictionaryFromArray(people, "name");
	 * // peopleDict === {
	 * //	"Terrence" : {name: "Terrence", cats: true},
	 * //	"Mina" : {name: "Mina", cats: false}
	 * // }
	 */
	DL_.createDictionaryFromArray = function(array, key) {
		var dict = {};
		for (var i = 0; i < array.length; i++) {
			if (array[i].hasOwnProperty(key)) {
				dict[array[i][key]] = array[i];
			}
		}
		return dict;
	};

	/**
	 * Get object with a certain property from an array of objects
	 * Returns the first object that matches the criteria.
	 * Will not return multiple objects.
	 * If no match is found, returns null.
	 * If you will need to look this up multiple times, 
	 * use createDictionary instead.
	 *
	 * @function getObjectWithPropValue
	 * @param {array} array - Array of objects
	 * @param {string} key - Key to search
	 * @param value - value to search for in each key
	 * @returns {object} - first object with matching key value
	 *
	 * @example
	 * var people = [
	 * 		{name: "Terrence", cats: true},
	 * 		{name: "Mina", cats: false}
	 * ];
	 * var catPerson = DL_.getObjectWithPropValue(people, "cats", true);
	 * // catPerson === {name: "Mina", cats: false};
	 */
	DL_.getObjectWithPropValue = function (array, key, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].hasOwnProperty(key) && array[i][key] === value) {
				return array[i];
			}
		}
		return null;
	};

	/**
	 * Get objects with a certain property from an array of objects
	 * Returns an array of objects that match the criteria.
	 * If no match is found, returns empty array.
	 * Good if you have duplicate values
	 *
	 * @function getObjectsWithPropValue
	 * @param {array} array - Array of objects
	 * @param {string} key - Key to search
	 * @param value - value to search for in each key
	 * @returns {array} - array of objects with matching key value
	 *
	 * @example
	 * var people = [
	 * 		{name: "Terrence", cats: true},
	 * 		{name: "Mina", cats: false}
	 * ];
	 * var catPeople = DL_.getObjectsWithPropValue(people, "cats", true);
	 * // catPeople === [{name: "Mina", cats: false}];
	 */
	DL_.getObjectsWithPropValue = function (array, key, value) {
		var matches = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i].hasOwnProperty(key) && array[i][key] === value) {
				matches.push(array[i]);
			}
		}
		return matches;
	};

	/****************************************************************

	RANDOMIZATION

	****************************************************************/

	/**
	 * Get random item from passed array.
	 * Returns the item itself, not the index.
	 *
	 * @function randFromArray
	 * @param {array} array - array to select from
	 * @returns {*} selected item from the array
	 *
	 * @example
	 * var arr = [1, 5, 7, 9];
	 * var rand = DL_.randFromArray(arr);
	 * // 5, for example
	 */
	DL_.randFromArray = function (array) {
		return array[DL_.getRandomInt(0, array.length - 1)];
	};

	/**
	 * Get random item from passed object.
	 * Returns the object key as a string.
	 * This means you need to use that key to actually get the object content
	 *
	 * @function randFromObject
	 * @param {object} obj - the object to select from
	 * @returns {string} the randomly selected key from the object
	 *
	 * @example
	 * var colors = {red: "#ff0000", blue: "#0000ff"};
	 * var colorKey = DL_.randFromObject(colors);
	 * var actualColor = colors[colorKey];
	 */
	DL_.randFromObject = function (obj) {
		var result;
		var count = 0;
		for (var prop in obj) {
			if (Math.random() < 1/++count) {
				result = prop;
			}
		}
		return result;
	};

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 *
	 * @function getRandomInt
	 * @param {number} min - the minimum (inclusive) number to select
	 * @param {number} max - the maximum (inclusive) number to select
	 * @returns {number} integer in specified range
	 *
	 * @example
	 * var randomNumber = DL_.getRandomInt(1, 10);
	 */
	DL_.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	/**
	 * Returns 1 or -1.
	 *
	 * @function randPosNeg
	 * @returns {number} 1 or -1
	 *
	 * @example
	 * var direction = DL_.randPosNeg();
	 * var moveSpeed = 50 * direction;
	 */
	DL_.randPosNeg = function () {
		return Math.random() >= 0.5 ? 1 : -1;
	};

	/**
	 * Basic array randomization function.
	 * Previously modified the Array prototype
	 * but I didn't like doing that... so now
	 * just shuffles the passed array in place.
	 *
	 * @function shuffle
	 * @param {array} array - the array to shuffle. This array will be altered.
	 *
	 * @example
	 * var arr = [1, 5, 7, 9];
	 * DL_.shuffle(arr);
	 * // arr === [5, 9, 7, 1] or something
	 */
	DL_.shuffle = function (array){
		var i = array.length, j, temp;
		if ( i === 0 ) {
			return;
		}
		while ( --i ) {
			j = Math.floor( Math.random() * ( i + 1 ) );
			temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	};

	/****************************************************************

	PARSING

	****************************************************************/

	/** 
	 * get the query string from the uri. Used by DL_.getQueryVariable.
	 * Mostly added so we can override for unit testing.
	 * Substring is to drop the ? from the beginning.
	 *
	 * @function getLocationSearch
	 * @returns {string} the full query string
	 *
	 * @example
	 * //www.example.com/default.aspx?dest=aboutus.aspx
	 * var queryString = DL_.getLocationSearch();
	 * // "dest=aboutus.aspx"
	 */
	DL_.getLocationSearch = function() {
		return window.location.search.substring(1);
	};

	/**  
	 * Get variable from query string
	 *
	 * @function getQueryVariable
	 * @param {string} variable - the query string variable to search for
	 * @returns {string} the value of the query variable
	 *
	 * @example
	 * //www.example.com/default.aspx?dest=aboutus.aspx
	 * var destination = DL_.getQueryVariable("dest");
	 * // "aboutus.aspx"
	 */
	DL_.getQueryVariable = function(variable) {
		var vars = DL_.getLocationSearch().split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) == variable) {
				return decodeURIComponent(pair[1]);
			}
		}
		console.log('Query variable %s not found', variable);
		return null;
	};

	/**
	 * User Agent Sniffing method of mobile detection. Gross.
	 * Last Jan 11, 2016
	 * from https://gist.github.com/dalethedeveloper/1503252
	 *
	 * @function mobilecheck
	 * @returns {bool} true if mobile
	 *
	 * @example
	 * var isMobile = DL_.mobilecheck();
	 *
	 * if (isMobile) {
	 * 		// do mobile-y things
	 * }
	 */
	DL_.mobilecheck = function() {
		var check = false;
		( function(a) {
			if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(a)) {
				check = true;
			}
		})(navigator.userAgent);
		return check; 
	};

	/**
	 * Get file type from extension. 
	 * Removes query strings that come after the file request as well. 
	 * Does NOT deal with invalid inputs at the moment, so should probably 
	 * validate that input equals output
	 *
	 * @function getFileType
	 * @param {string} url - the full name or path of the file
	 * @returns {string} the file extension, without the dot
	 *
	 * @example
	 * var type = DL_.getFileType("upload/image.png?v=37");
	 * // "png"
	 */
	DL_.getFileType = function(url) {
		var fileType = url.split('?').shift().split('.').pop().toLowerCase();
		return fileType;
	};

	/**
	 * @typedef {Object} BracketedContentResult
	 * @property {number} start - the start index within the data
	 * @property {number} end - the ending index of the bracketed content in the data
	 * @property {string} contents - the stringified content found within brackets
	 * @property {string} [error=null] - error message on a failed search
	 */

	/**
	 * Get the contents of a function body in a file
	 * or other bracketed content, based off of 
	 * an index or search string.
	 * TODO: Add support for stringifying functions in objects
	 * https://stackoverflow.com/questions/18089033/json-stringify-does-not-process-object-methods
	 *
	 * @function getBracketedContent
	 * @param {string|object} data - data to search
	 * @param {number|string} start - position or string to start searching for matching brackets
	 * @param {object} [options] - other function options
	 * @param {string} [options.openChar="{"] - open bracket character to match
	 * @param {string} [options.closeChar="}"] - closing bracket character to match
	 * @param {bool} [options.inclusive=true] - whether to include the first set of enclosing brackets
	 * @returns {BracketedContentResult} object containing match data
	 *
	 * @example
	 * var someObject = {
	 * 		foo: { 
	 * 			bar: "(baz)"
	 *		}
	 * };
	 *
	 * var fooFunc = DL_.getBracketedContent(someObject, "foo");
	 * // {
	 * //	contents:"foo":{"bar":"(baz)"}",
	 * //	start:2,
	 * //	end:22
	 * //	error:null
	 * // }
	 *
	 * var returnVal = DL_.getBracketedContent(someObject, 0, {openChar: "(", closeChar: ")", inclusive: false});
	 * // {
	 * //	contents:"baz",
	 * //	start:16,
	 * //	end:19
	 * //	error:null
	 * // }
	 */
	DL_.getBracketedContent = function(data, start, options) {
		var firstIndex = 0;
		var lastIndex = null;
		var foundFirstBracket = false;
		var bracketCount = 0;
		var openChar = "{";
		var closeChar = "}";
		var inclusive = true;
		var results = {
			"start": null,
			"end": null,
			"contents": null,
			"error": null
		};

		if (typeof data === "object") {
			data = JSON.stringify(data);
		} else if (typeof data !== "string") {
			results.error = "Data must be an object or a string!";
			console.error(results.error);
			return results;
		}

		// validate inputs
		if (typeof start === "number") {
			// this is an index
			firstIndex = parseInt(start);
		} else if (typeof start === "string") {
			// this is a string to search for, get the index ourselves
			firstIndex = data.indexOf(start);
		} else {
			// this is invalid, exit
			results.error = "Index " + start + " must be of type string or number";
			console.error(results.error);
			return results;
		}

		if (typeof options !== "undefined") {
			if (typeof options.openChar !== "undefined") {
				openChar = options.openChar;
			}
			if (typeof options.closeChar !== "undefined") {
				closeChar = options.closeChar;
			}
			if (typeof options.inclusive !== "undefined") {
				inclusive = options.inclusive;
			}
		}

		for (var i = firstIndex; i < data.length; i++) {
			var curChar = data.charAt(i);
			if (curChar == openChar) {
				bracketCount++;

				if (!foundFirstBracket) {
					// this is the first bracket
					if (!inclusive) {
						// don't include brackets if not inclusive
						firstIndex = i + 1;
					}
					foundFirstBracket = true;
				}
			} else if (curChar == closeChar) {
				bracketCount--;
			}

			if (foundFirstBracket) {
				if (bracketCount <= 0) {
					if (!inclusive) {
						lastIndex = i;
					} else {
						lastIndex = (i + 1);
					}
					break;
				}
			}
		}

		if (!foundFirstBracket) {
			results.error = "Could not find " + openChar + " in data";
			console.error(results.error);
			return results;
		}

		if (lastIndex === null) {
			results.error = "Could not find complete matching bracket set";
			console.error(results.error);
			return results;
		}

		// found everything ok!
		results.start = firstIndex;
		results.end = lastIndex;
		results.contents = data.slice(firstIndex, lastIndex);
		return results;
	};

	/****************************************************************

	VALIDATION

	****************************************************************/

	/**
	 * Test for touch capabilities.
	 * Yes this has issues and false positives.
	 * But it's good enough for most situations.
	 *
	 * @function isTouchDevice
	 * @returns {boolean}
	 * @example
	 * var touch = DL_.isTouchDevice();
	 *
	 * if (touch) {
	 *		// enable touch-only features
	 * }
	 */
	DL_.isTouchDevice = function () {
		return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
	};

	/**
	 * check if value is an integer
	 *
	 * @function isInt
	 * @returns {boolean}
	 *
	 * @example
	 *
	 * var foo = "42";
	 * DL_.isInt(someInt); // true
	 *
	 * var bar = "42.5";
	 * DL_.isInt(bar); //false
	 */
	DL_.isInt = function (value) {
		return !isNaN(value) &&
				parseInt(Number(value)) == value &&
				!isNaN(parseInt(value, 10));
	};

	/**
	 * Checks to see if properties in an object
	 * contain any content. Use to make sure 
	 * object structures that are generated
	 * as empty templates don't pollute your
	 * data set with blank entries.
	 *
	 * @function isObjectEmpty
	 * @returns {boolean}
	 *
	 * @example
	 * var myObj = {};
	 * var empty = DL_.isObjectEmpty(myObj); // true
	 */
	DL_.isObjectEmpty = function (obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
			return false;
		}

		return true && JSON.stringify(obj) === JSON.stringify({});
	};

	/****************************************************************

	TEXT AND LAYOUT

	****************************************************************/
	
	/**
	 * takes a jquery selector and inserts a 
	 * non-breaking space character between 
	 * the last two words. Useful for headlines.
	 * Checks for jQuery dependency.
	 *
	 * @function preventWidows
	 * @param {jQuery} selector - jQuery selector for text elements to prevent widows on
	 * 
	 * @example
	 * var paragraph = $("<p>");
	 * paragraph.html("Should not allow widows.");
	 * $(document.body).append(paragraph);
	 *
	 * DL_.preventWidows($("p"));
	 * // becomes "Should not allow&nbsp;widows."
	 */

	DL_.preventWidows = (typeof jQuery === 'undefined') ? DL_.noop : function (selector) {
		selector.each(function() {
			var wordArray = jQuery(this).text().split(" ");
			if (wordArray.length > 1) {
				wordArray[wordArray.length-2] += "&nbsp;" + wordArray[wordArray.length-1];
				wordArray.pop();
				jQuery(this).html(wordArray.join(" "));
			}
		});    
	};

	/**
	 * Takes an input, converts to string, and pads with a specified character
	 * to return a string of appropriate length.
	 * Mostly useful for adding leading zeroes.
	 * Don't feed more than one character to the padCharacter.
	 * It's _such_ a burden to include this here,
	 * maybe I should use an npm package instead...
	 *
	 * @function leftpad
	 * @param {string|number} input - thing to be left padded
	 * @param {number} totalLength - how long the result should be
	 * @param {string|number} [padCharacter=' '] - what to pad empty space with
	 * @returns {string}
	 *
	 * @example
	 * var paddedString = DL_.leftpad(4, 3, 0);
	 * // returns "004"
	 */
	DL_.leftpad = function (input, totalLength, padCharacter) {
		input = String(input);
		var i = -1;
		if (!padCharacter && padCharacter !== 0) {
			padCharacter = ' ';
		}
		totalLength = totalLength - input.length;
		while (++i < totalLength) {
			input = padCharacter + input;
		}
		return input;
	};

	/****************************************************************

	DATE AND TIME

	****************************************************************/

	/**
	 * setTimeout with pause, resume, and destroy functions
	 *
	 * @constructor Timer
	 * @param {function} callback - Function to call when timer is complete
	 * @param {number} delay - Duration the timer should run.
	 *
	 * @example
	 *
	 * var timer = new DL_.Timer(function(){
	 * 		// do something after 3 seconds
	 * }, 3000);
	 */

	DL_.Timer = function(callback, delay) {
		var timerId, start, remaining = delay;

		/**
		 * Pause the timer
		 *
		 * @memberof Timer
		 * @function pause
		 *
		 * @example
		 *
		 * var timer = new DL_.Timer(function(){}, 3000);
		 * timer.pause();
		 */
		this.pause = function() {
			window.clearTimeout(timerId);
			remaining -= new Date() - start;
		};

		/**
		 * Resume the timer
		 *
		 * @memberof Timer
		 * @function resume
		 *
		 * @example
		 *
		 * var timer = new DL_.Timer(function(){}, 3000);
		 * timer.pause();
		 * // some delay
		 * timer.resume();
		 */
		this.resume = function() {
			start = new Date();
			window.clearTimeout(timerId);
			timerId = window.setTimeout(callback, remaining);
		};

		/**
		 * Destroy the timer
		 *
		 * @memberof Timer
		 * @function destroy
		 *
		 * @example
		 *
		 * var timer = new DL_.Timer(function(){}, 3000);
		 * // cancel the timer for some reason
		 * timer.destroy();
		 */
		this.destroy = function() {
			window.clearTimeout(timerId);
		};

		this.resume();
	};

	/** 
	 * Debounce method for preventing functions from firing too often.
	 * Resets the debounce timer every time it is called.
	 * Taken from David Walsh, who took it from underscore:
	 * https://davidwalsh.name/javascript-debounce-function
	 *
	 * @function debounce
	 * @param {function} func - function to limit
	 * @param {number} wait - minimum time between function calls
	 * @param {bool} immediate - whether to call function when creating the debounce
	 * @returns {function} debounced version of the given function
	 *
	 * @example
	 * var exampleFunction = DL_.debounce(function() {
	 *		// Function body
	 *	}, 250, true);
	 * exampleFunction(); // is not called, since immediate is true
	 * exampleFunction(); // is not called, must wait 250ms
	 */
	DL_.debounce = function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	/** 
	 * Date custom format
	 *
	 * This code is copyright 2002-2003 by Gavin Kistner, !@phrogz.net. 
	 * It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
	 *
	 * http://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-js
	 *
	 * @function customDate
	 * @param {string} formatString - string defining how to format the date
	 * @param {object} [date] - optional date object. Will default to using the current date and time.
	 *
	 * @example
	 * var exampleDate = DL_.customDate("#MM#-#DD#-#YY# #hh#:#mm# #AMPM#");
	 * // "08-06-17 03:21 PM"
	 *
	 * var exampleDate2 = DL_.customDate("#DDDD#, #MMMM# #D##th#, #YYYY#");
	 * // "Sunday, August 6th, 2017"
	 *
	 * @example
	 * // date string options. Define by placing between '#'
	 * // year
	 * "#YYYY#" // 2017
	 * "#YY#" // 17
	 * // month
	 * "#MMMM#" // August
	 * "#MMM#" // Aug
	 * "#MM#" // 08
	 * "#M#" // 8
	 * // day
	 * "#DDDD#" // Sunday
	 * "#DDD#" // Sun
	 * "#DD#" // 06
	 * "#D#" // 6
	 * "#th#" // th, so 6th, 1st, etc.
	 * // hours
	 * "#hhhh#" // 015
	 * "#hhh#" // 15
	 * "#hh#" // 03
	 * "#h#" // 3
	 * // minutes
	 * "#mm#" // 05
	 * "#m#" // 5
	 * // seconds
	 * "#ss#" // 05
	 * "#s#" // 5
	 * // AM or PM
	 * "#ampm#" // pm
	 * "#AMPM#" // PM
	 */
	DL_.customDate = function(formatString, date){
		var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
		date = date || new Date();

		YY = ((YYYY = date.getFullYear())+"").slice(-2);
		MM = (M = date.getMonth() + 1) < 10 ? ('0' + M) : M;
		MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
		DD = (D = date.getDate()) < 10 ? ('0' + D) : D;
		DDD = (DDDD = ["Sunday", "Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()]).substring(0, 3);
		th = (D >= 10 && D <= 20 ) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
		formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
		h=(hhh = date.getHours());
		if (h === 0) {
			h = 24;
		}
		if (h > 12) {
			h -= 12;
		}
		hh = h < 10 ? ('0' + h) : h;
		hhhh = h < 10 ? ('0' + hhh) : hhh;
		AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
		mm = (m = date.getMinutes()) < 10 ? ('0' + m) : m;
		ss = (s = date.getSeconds()) < 10 ? ('0' + s) : s;
		return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
	};

	/****************************************************************

	ASSET MANAGEMENT

	****************************************************************/

	/**
	 * Vanilla JS image preloading. 
	 * Feed it an array of image paths, 
	 * and it will return an array of image 
	 * elements ready to be appended to the document.
	 * No callback or complete support, however.
	 * A better solution may be found here:
	 * https://stackoverflow.com/questions/8264528/image-preloader-javascript-that-supports-events/8265310#8265310
	 *
	 * @function preloadImageArray
	 * @param {array} imgPaths - Array of image URLs to load
	 * @returns {array} - Array of image elements
	 *
	 * @example
	 * var preload = ["images/hat1.jpg", "images/hat2.jpg", "images/hat3.jpg"];
	 * var images = DL_.preloadImageArray(preload);
	 *
	 * function changeHat() {
	 * 		var hat = document.getElementById("hat");
	 * 		hat innerHTML = "";
	 * 		hat.append(DL_.randFromArray(images));
	 * }
	 */
    
	DL_.preloadImageArray = function(imgPaths) {
		var imageArray = [];
		for (i = 0; i < imgPaths.length; i++) {
			imageArray[i] = new Image();
			imageArray[i].src = imgPaths[i];
		}
		return imageArray;
	};

	/****************************************************************

	POLYFILLS

	****************************************************************/

	/* 
	 * Run the polyfills you want when initializing a page.
	 */


	/**
	 * polyfill for String.prototype.includes method in ecmascript 6 spec.
	 * This is not well supported in all browsers yet.
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Browser_compatibility
	 * Run this when loading your page, will polyfill if necessary.
	 *
	 * @function polyfillStringIncludes
	 *
	 * @example
	 * // useful for IE support
	 * window.onload = function() {
	 * 		DL_.polyfillStringIncludes();
	 * 		var testString = "IE can use String.includes now!";
	 * 		testString.includes("now!"); // true
	 * }
	 
	 */
	DL_.polyfillStringIncludes = function() {
		if (!String.prototype.includes) {
			String.prototype.includes = function() {'use strict';
				return String.prototype.indexOf.apply(this, arguments) !== -1;
			};
		}
	};

	/**
	 * In case we forget to take out console statements. 
	 * IE becomes very unhappy when we forget. 
	 * Let's not make IE unhappy
	 * Can probably be removed soon. This was one of the original 
	 * functions included in this library, back when IE7 support was more required.
	 * Run this when loading your page, will polyfill if necessary.
	 *
	 * @function polyfillConsole
	 * 
	 * @example
	 * window.onload = function() {
	 * 		DL_.polyfillConsole();
	 * 		console.log("IE won't error on console statement now!");
	 * }
	 *
	 */
	DL_.polyfillConsole = function() {
		if (typeof(window.console) === 'undefined') {
			window.console = {};
			window.consolearray = [];
			console.log = console.groupCollapsed = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function(msg) {
				consolearray.push(msg);
			};
		}
	};

	/**
	 * Polyfill for Math.sign method in ecmascript 6 spec.
	 * Support is better as of August 2017, but still not perfect
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
	 * Run this when loading your page, will polyfill if necessary.
	 *
	 * @function polyfillMathSign
	 * @example
	 * window.onload = function() {
	 * 		DL_.polyfillMathSign();
	 * 		var sign = Math.sign(-430); // -1
	 * }
	 */
	DL_.polyfillMathSign = function() {
		Math.sign = Math.sign || function(x) {
			x = +x; // convert to a number
			if (x === 0 || isNaN(x)) {
				return x;
			}
			return x > 0 ? 1 : -1;
		};
	};

	/**
	 * Polyfill for CustomEvent constructor in IE <= 11.
	 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
	 * Run this when loading your page, will polyfill if necessary.
	 *
	 * @function polyfillCustomEvent
	 * @example
	 * window.onload = function() {
	 * 		DL_.polyfillCustomEvent();
	 * 		window.addEventListener("myEvent");
	 *		window.dispatchEvent(new CustomEvent("myEvent"));
	 * }
	 */
	DL_.polyfillCustomEvent = function() {
		try {
			new window.CustomEvent("customEventPolyfillTest");
		} catch(e) {
			var CustomEvent = function(event, params) {
				var evt;
				params = params || {
					bubbles: false,
					cancelable: false,
					detail: undefined
				};

				evt = document.createEvent("CustomEvent");
				evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
				return evt;
			};

			CustomEvent.prototype = window.Event.prototype;
			window.CustomEvent = CustomEvent; // expose definition to window
		}
	};

})(window.DL_ = window.DL_ || {});