	/****************************************************************

	VALIDATION

	****************************************************************/

	/*
	 * Test for touch capabilities.
	 */
	DL_.isTouchDevice = function () {
		try{ document.createEvent("TouchEvent"); return true; }
		catch(e){ return false; }
	};

	/*
	 * check if value is an integer
	 */
	DL_.isInt = function (value) {
		return !isNaN(value) &&
				parseInt(Number(value)) == value &&
				!isNaN(parseInt(value, 10));
	};

	/*
	 * Checks to see if properties in an object
	 * contain any content. Use to make sure 
	 * object structures that are generated
	 * as empty templates don't pollute your
	 * data set with blank entries.
	 */
	DL_.isObjectEmpty = function (obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
			return false;
		}

		return true && JSON.stringify(obj) === JSON.stringify({});
	};