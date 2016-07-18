	/****************************************************************

	DATE AND TIME

	****************************************************************/

	/*
	 * setTimeout with pause, resume, and destroy functions
	 */

	DL_.timer = function(callback, delay) {
		var timerId, start, remaining = delay;

		this.pause = function() {
			window.clearTimeout(timerId);
			remaining -= new Date() - start;
		};

		this.resume = function() {
			start = new Date();
			window.clearTimeout(timerId);
			timerId = window.setTimeout(callback, remaining);
		};

		this.destroy = function() {
			window.clearTimeout(timerId);
		};

		this.resume();
	};

	/* 
	 * Debounce method for preventing functions from firing too often.
	 * Resets the debounce timer every time it is called.
	 * Taken from David Walsh, who took it from underscore:
	 * https://davidwalsh.name/javascript-debounce-function
	 *
	 * Usage:
	 * var exampleFunction = DL_.debounce(function() {
	 *		// Function body
	 *	}, 250, true);
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

	/* Date custom format
	 * This code is copyright 2002-2003 by Gavin Kistner, !@phrogz.net
	 * It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
	 *
	 * http://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-js
	 *
	 * Usage example:
	 * var saneDateString = DL_.customDate("#MM#-#DD#-#YY# #hh#:#mm# #AMPM#");
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