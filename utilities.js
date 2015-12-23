
/****************************************************************
	This namespacing pattern taken from 
	http://addyosmani.com/blog/essential-js-namespacing/

	namespace (our namespace name) and undefined are passed here
	to ensure 1. namespace can be modified locally and isn't
	overwritten outside of our function context
	2. the value of undefined is guaranteed as being truly
	undefined. This is to avoid issues with undefined being
	mutable pre-ES5.
 ****************************************************************/

(function ( DL_Util, undefined ) {

	/*
     * predefined noop so we can make efficient self destroying functions and such
     */
	DL_Util.noop = function (){}

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
	}

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
	}

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
	}

	/****************************************************************

	PLATFORM / CAPABILITY DETECTION

	****************************************************************/

	/*
	 * Test for touch capabilities.
	 * This is the currently preferred method.
	 * There is another version below.
	 * I forget why I prefer this one.
	 */
	DL_Util.isTouchDevice = function () {
		var el = document.createElement('div');
		el.setAttribute('ongesturestart', 'return;');
		if(typeof el.ongesturestart === "function"){
			return true;
		}else {
			return false;
		}
	}

	/*
	 * User Agent Sniffing method of mobile detection. Gross.
	 * Last updated Spring 2015
	 */
	DL_Util.mobilecheck = function() {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check=true})(navigator.userAgent||navigator.vendor||window.opera);
		return check; 
	};

	/*
	 * Test for touch capabilities.
	 * Don't typically use this for some reason.
	 */
	DL_Util.isMobile = function () {
		try{ document.createEvent("TouchEvent"); return true; }
		catch(e){ return false; }
	}

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
	}

	DL_Util.hexToRgb = function (hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	/*
	 * Degrees to Radians
	 */
	DL_Util.d2r = function (d) {
		return d * (Math.PI/180);
	}

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

	RANDOMIZATION

	****************************************************************/

	/*
	 * Get random item from passed array.
	 * Returns the item itself, not the index.
	 */
	DL_Util.randFromArray = function (array) {
		return array[Math.floor(Math.random() * array.length)];
	}

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
	}

	/*
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	DL_Util.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/*
	 * Returns 1 or -1.
	 */
	DL_Util.randPosNeg = function () {
		return Math.random() >= 0.5 ? 1 : -1;
	}

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
	}

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
	}

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
	}

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
	}

	/****************************************************************

	TEXT AND LAYOUT

	****************************************************************/
	/*
	 * takes a jquery selector and inserts a 
	 * non-breaking space character between 
	 * the last two words. Useful for headlines.
	 * Commented out while unused, so as not to 
	 * cause errors due to the jQuery dependency
	 */

	/*
	DL_Util.preventWidows = function (selector) {
		selector.each(function() {
			var wordArray = $(this).text().split(" ");
			if (wordArray.length > 1) {
				wordArray[wordArray.length-2] += "&nbsp;" + wordArray[wordArray.length-1];
				wordArray.pop();
				$(this).html(wordArray.join(" "));
			}
		});    
	}
	*/


	/* 
	 * UNTESTED!!
	 * In theory sets the source of the first img element 
	 * to the one you want to preload. Probably not the best 
	 * way of doing things, might require there to be an img 
	 * element in the dom that is hidden. Test before using 
	 * in production!!
	 */

	/*
	DL_Util.preloadImages = function (array) {
		$(array).each(function(){
			$("<img />")[0].src = this;
		});
	}
	*/

	/*
	 * Better image preloading. 
	 * Feed it an array of image paths, 
	 * and it will return an array of image 
	 * elements ready to be appended to the document.
	 */
    
	DL_Util.preloadImageArray = function(imgPaths) {
		var imageArray = new Array();
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
	console.log = console.groupCollapsed = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function(msg) {consolearray.push(msg)};
};

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
}

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