	/****************************************************************

	PARSING

	****************************************************************/

	/**
	 * Parsing module
	 * @module Parsing
	 */

	/*  
	 * get the query string from the uri.
	 * Mostly added so we can override for unit testing.
	 * Substring is to drop the ? from the beginning.
	 */
	DL_.getLocationSearch = function() {
		return window.location.search.substring(1);
	};

	/*  
	 * get variable from query string
	 * so running getQueryVariable('dest') on
	 * www.mysite.com/default.aspx?dest=aboutus.aspx
	 * would return
	 * "aboutus.aspx"
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

	/*
	 * User Agent Sniffing method of mobile detection. Gross.
	 * Last Jan 11, 2016
	 * from https://gist.github.com/dalethedeveloper/1503252
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

	/*
	 * Get file type from extension. 
	 * Removes query strings that come 
	 * after the file request as well. 
	 * Does NOT deal with invalid inputs 
	 * at the moment, so should probably 
	 * validate that input equals output
	 */
	DL_.getFileType = function(url) {
		var fileType = url.split('?').shift().split('.').pop().toLowerCase();
		return fileType;
	};

	/*
	 * Get the contents of a function body
	 * or other bracketed content, based off of 
	 * an index or search string.
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