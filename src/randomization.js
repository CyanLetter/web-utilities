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