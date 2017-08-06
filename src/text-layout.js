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