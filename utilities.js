
/*******************************************************************
	This namespacing pattern taken from 
	http://addyosmani.com/blog/essential-js-namespacing/

	namespace (our namespace name) and undefined are passed here
	to ensure 1. namespace can be modified locally and isn't
	overwritten outside of our function context
	2. the value of undefined is guaranteed as being truly
	undefined. This is to avoid issues with undefined being
	mutable pre-ES5.
 *******************************************************************/

(function ( DL_Util, undefined ) {

	/*
     * predefined noop so we can make efficient self destroying functions and such
     */
	DL_Util.noop = function (){};

	/****************************************************************

	GAME-SPECIFIC UTILITIES

	****************************************************************/
	
	/*
	 * intersect check with square bounding box
	 * currently designed to work with pixi.js display objects
	 */
	DL_Util.boxIntersect = function (a, b) {
		return (a.x < b.x + b.width && a.x + a.width > b.x &&
			a.y < b.y + b.height && a.y + a.height > b.y);
	};

	/*
	 * Intersect check with circular boundaries.
	 * based on observed behavior, it looks like 
	 * this takes radius instead of width. 
	 * May be dependent on anchor point.
	 */
	DL_Util.circleIntersect = function (x1, y1, r1, x2, y2, r2) {
		var xd = x1 - x2;
		var yd = y1 - y2;
		var rt = r2 + r1;
		return (xd * xd + yd * yd <= rt * rt);
	};

	/*
	 * function to deal with number sequences in JSON spritesheets. 
	 * Flash exports png sequences with 4 digit suffixes, 
	 * so use this to determine which one to use when looping 
	 * through spritesheet frames. 
	 * Useful in PIXI.js when loading movieclip textures.
	 */
	DL_Util.numberSuffix = function (i) {
		var num;
		if (i < 9) {
			num = "000" + (i + 1);
		} else if (i < 99) {
			num = "00" + (i + 1);
		} else if (i < 999) {
			num = "0" + (i + 1);
		} else {
			num = i + 1;
		}
		return num;
	};

	/****************************************************************

	PLATFORM / CAPABILITY DETECTION

	****************************************************************/

	/*
	 * User Agent Sniffing method of mobile detection. Gross.
	 * Last Jan 11, 2016
	 * from https://gist.github.com/dalethedeveloper/1503252
	 */
	DL_Util.mobilecheck = function() {
		var check = false;
		( function(a) {
			if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(a)) {
				check = true;
			}
		})(navigator.userAgent);
		return check; 
	};

	/*
	 * Test for touch capabilities.
	 */
	DL_Util.isTouchDevice = function () {
		try{ document.createEvent("TouchEvent"); return true; }
		catch(e){ return false; }
	};

	/****************************************************************

	CONVERSIONS

	****************************************************************/

	/*
	 * Converting color types
	 * RGB (e.g. 224, 28, 95) to Hexadecimal (e.g. #e01c5f)
	 * Functions for both directions
	 */
	DL_Util.rgbToHex = function (r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	};

	DL_Util.hexToRgb = function (hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(match, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	};

	/*
	 * Degrees to Radians
	 */
	DL_Util.d2r = function (d) {
		return d * (Math.PI/180);
	};

	/*
	 * Round input to nearest quarter.
	 * Useful for rounding times from events that cannot 
	 * be guaranteed to fire more frequently than every
	 * 0.25s, e.g. HTML5 video timeupdate.
	 * See https://developer.mozilla.org/en-US/docs/Web/Events/timeupdate
	 * for more details on timeupdate granularity.
	 */
	DL_Util.roundNearQtr = function (number) {
		return (Math.round(number * 4) / 4).toFixed(2);
	};

	/****************************************************************

	ARRAY AND OBJECT HELPERS

	****************************************************************/

	/*
	 * Get random item from passed array.
	 * Returns the item itself, not the index.
	 */
	DL_Util.randFromArray = function (array) {
		return array[Math.floor(Math.random() * array.length)];
	};

	/*
	 * Get random item from passed object.
	 * Returns the item itself, not the prop name.
	 */
	DL_Util.randFromObject = function (obj) {
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
	 * Takes an array of objects, and returns a new object
	 * using a specific property as keys.
	 * Useful when you need to look up the associated object
	 * of a certain property many times.
	 * Data must be consistent. Key values should be present
	 * and unique in all objects to return a complete dict
	 */
	DL_Util.createDictionaryFromArray = function(array, key) {
		var dict = {};
		for (var i = 0; i < array.length; i++) {
			if (array[i].hasOwnProperty(key)) {
				dict[array[i][key]] = array[i];
			}
		}
		return dict;
	};

	/*
	 * Get object with a certain property from an array of objects
	 * Returns the first object that matches the criteria.
	 * Will not return multiple objects.
	 * If no match is found, returns null.
	 * If you will need to look this up multiple times, 
	 * use createDictionary instead.
	 */
	DL_Util.getObjectWithProperty = function (array, key, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].hasOwnProperty(key) && array[i].key === value) {
				return array[i];
			}
		}
		return null;
	};

	/*
	 * Get objects with a certain property from an array of objects
	 * Returns an array of objects that match the criteria.
	 * If no match is found, returns empty array.
	 * Good if you have duplicate values
	 */
	DL_Util.getObjectsWithProperty = function (array, key, value) {
		var matches = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i].hasOwnProperty(key) && array[i].key === value) {
				matches.push(array[i]);
			}
		}
		return matches;
	};

	/*
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	DL_Util.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	/*
	 * Returns 1 or -1.
	 */
	DL_Util.randPosNeg = function () {
		return Math.random() >= 0.5 ? 1 : -1;
	};

	/*
	 * Basic array randomization function.
	 * Previously modified the Array prototype
	 * but I didn't like doing that... so now
	 * just shuffles the passed array.
	 */
	DL_Util.shuffle = function (array){
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

	/*
	 * Checks to see if properties in an object
	 * contain any content. Use to make sure 
	 * object structures that are generated
	 * as empty templates don't pollute your
	 * data set with blank entries.
	 */
	DL_Util.isObjectEmpty = function (obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
			return false;
		}

		return true && JSON.stringify(obj) === JSON.stringify({});
	};

	/****************************************************************

	PARSING

	****************************************************************/

	/*  
	 *  get variable from query string
	 *  so running getQueryVariable('dest') on
	 *  www.mysite.com/default.aspx?dest=aboutus.aspx
	 *  would return
	 *  "aboutus.aspx"
	 */
	DL_Util.getQueryVariable = function (variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) == variable) {
				return decodeURIComponent(pair[1]);
			}
		}
		console.log('Query variable %s not found', variable);
	};

	/*
	 *  Get file type from extension. 
	 *  Removes query strings that come 
	 *  after the file request as well. 
	 *  Does NOT deal with invalid inputs 
	 *  at the moment, so should probably 
	 *  validate that input equals output
	 */
	DL_Util.getFileType = function (url) {
		var fileType = url.split('?').shift().split('.').pop().toLowerCase();
		return fileType;
	};

	/****************************************************************

	VALIDATION

	****************************************************************/

	/*
	 * check if value is an integer
	 */
	DL_Util.isInt = function (value) {
		return !isNaN(value) &&
				parseInt(Number(value)) == value &&
				!isNaN(parseInt(value, 10));
	};

	/****************************************************************

	TEXT AND LAYOUT

	****************************************************************/
	/*
	 * takes a jquery selector and inserts a 
	 * non-breaking space character between 
	 * the last two words. Useful for headlines.
	 * Checks for jQuery dependency.
	 */

	DL_Util.preventWidows = (typeof jQuery === 'undefined') ? DL_Util.noop : function (selector) {
		selector.each(function() {
			var wordArray = jQuery(this).text().split(" ");
			if (wordArray.length > 1) {
				wordArray[wordArray.length-2] += "&nbsp;" + wordArray[wordArray.length-1];
				wordArray.pop();
				jQuery(this).html(wordArray.join(" "));
			}
		});    
	}


	/* 
	 * UNTESTED!!
	 * In theory sets the source of the first img element 
	 * to the one you want to preload. Probably not the best 
	 * way of doing things, might require there to be an img 
	 * element in the dom that is hidden. Test before using 
	 * in production!!
	 */

	DL_Util.preloadImages = (typeof jQuery === 'undefined') ? DL_Util.noop : function (array) {
		jQuery(array).each(function(){
			jQuery("<img />")[0].src = this;
		});
	}

	/*
	 * Better image preloading. 
	 * Feed it an array of image paths, 
	 * and it will return an array of image 
	 * elements ready to be appended to the document.
	 */
    
	DL_Util.preloadImageArray = function(imgPaths) {
		var imageArray = [];
		for (i = 0; i < imgPaths.length; i++) {
			imageArray[i] = new Image();
			imageArray[i].src = imgPaths[i];
		}
		return imageArray;
	};

})(window.DL_Util = window.DL_Util || {});

/****************************************************************

POLYFILLS, NOT NAMESPACED

****************************************************************/

/* 
 * Right now, the polyfills included will always run.
 * May want to comment out those which will not be used
 * in a particular project. Also consider moving these
 * to individual namespaced functions, and using something
 * like yepnope to run them as needed.
 */


/* 
 * polyfill for String.prototype.includes method in ecmascript 6 spec.
 * This is not well supported in all browsers yet.
 */
if (!String.prototype.includes) {
	String.prototype.includes = function() {'use strict';
		return String.prototype.indexOf.apply(this, arguments) !== -1;
	};
}

/* 
 * In case we forget to take out console statements. 
 * IE becomes very unhappy when we forget. 
 * Let's not make IE unhappy
 */
if (typeof(console) === 'undefined') {
	var console = {};
	var consolearray = [];
	console.log = console.groupCollapsed = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function(msg) {
		consolearray.push(msg);
	};
}

/*
 * Polyfill for Math.sign method in ecmascript 6 spec.
 * This is not yet supported in IE or Safari
 */
Math.sign = Math.sign || function(x) {
	x = +x; // convert to a number
	if (x === 0 || isNaN(x)) {
		return x;
	}
	return x > 0 ? 1 : -1;
};

/*
 * Polyfill for CustomEvent constructor in IE 11 and under.
 */
try {
	new CustomEvent("customEventPolyfillTest");
} catch(e) {
	var CustomEvent = function(event, params) {
		var evt;
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};

		evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	};

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent; // expose definition to window
}

/* Date custom format
 * This code is copyright 2002-2003 by Gavin Kistner, !@phrogz.net
 * It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
 *
 * http://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-js
 *
 * Usage example:
 * var date = new Date();
 * var saneDateString = date.customFormat( "#MM#-#DD#-#YYYY# #hh#:#mm#:#ss#" );
 */
Date.prototype.customFormat = function(formatString){
	var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;

	YY = ((YYYY = this.getFullYear())+"").slice(-2);
	MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
	MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
	DD = (D = this.getDate()) < 10 ? ('0' + D) : D;
	DDD = (DDDD = ["Sunday", "Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()]).substring(0, 3);
	th = (D >= 10 && D <= 20 ) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
	formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
	h=(hhh = this.getHours());
	if (h === 0) {
		h = 24;
	}
	if (h > 12) {
		h -= 12;
	}
	hh = h < 10 ? ('0' + h) : h;
	hhhh = h < 10 ? ('0' + hhh) : hhh;
	AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
	mm = (m = this.getMinutes()) < 10 ? ('0' + m) : m;
	ss = (s = this.getSeconds()) < 10 ? ('0' + s) : s;
	return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
};