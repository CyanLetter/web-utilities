	/****************************************************************

	TEXT AND LAYOUT

	****************************************************************/

	/**
	 * Text and Layout module
	 * @module TextLayout
	 */

	/**
	 * takes a jquery selector and inserts a 
	 * non-breaking space character between 
	 * the last two words. Useful for headlines.
	 * Checks for jQuery dependency.
	 *
	 * @function preventWidows
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