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