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