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
	 * @function DL_.createDictionaryFromArray
	 * @param {array} array - Array of objects
	 * @param {string} key - object key to use for dictionary keys
	 * @returns {object} - Object using key values as keys
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
	 * @function DL_.getObjectWithPropValue
	 * @param {array} array - Array of objects
	 * @param {string} key - Key to search
	 * @param value - value to search for in each key
	 * @returns {object} - first object with matching key value
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
	 * @function DL_.getObjectsWithPropValue
	 * @param {array} array - Array of objects
	 * @param {string} key - Key to search
	 * @param value - value to search for in each key
	 * @returns {array} - array of objects with matching key value
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