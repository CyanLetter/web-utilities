	/****************************************************************

	VALIDATION

	****************************************************************/

	/**
	 * Test for touch capabilities.
	 * Yes this has issues and false positives.
	 * But it's good enough for most situations.
	 *
	 * @function DL_.isTouchDevice
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
	 * @function DL_.isInt
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
	 * @function DL_.isObjectEmpty
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