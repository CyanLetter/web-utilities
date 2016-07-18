	/****************************************************************

	RANDOMIZATION

	****************************************************************/

	/*
	 * Get random item from passed array.
	 * Returns the item itself, not the index.
	 */
	DL_.randFromArray = function (array) {
		return array[Math.floor(Math.random() * array.length)];
	};

	/*
	 * Get random item from passed object.
	 * Returns the object key as a string.
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

	/*
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	DL_.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	/*
	 * Returns 1 or -1.
	 */
	DL_.randPosNeg = function () {
		return Math.random() >= 0.5 ? 1 : -1;
	};

	/*
	 * Basic array randomization function.
	 * Previously modified the Array prototype
	 * but I didn't like doing that... so now
	 * just shuffles the passed array in place.
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