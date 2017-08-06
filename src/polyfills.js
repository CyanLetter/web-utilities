	/****************************************************************

	POLYFILLS

	****************************************************************/

	/* 
	 * Run the polyfills you want when initializing a page.
	 */


	/**
	 * polyfill for String.prototype.includes method in ecmascript 6 spec.
	 * This is not well supported in all browsers yet.
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Browser_compatibility
	 * Run this when loading your page, will polyfill if necessary.
	 *
	 * @function polyfillStringIncludes
	 *
	 * @example
	 * // useful for IE support
	 * window.onload = function() {
	 * 		DL_.polyfillStringIncludes();
	 * 		var testString = "IE can use String.includes now!";
	 * 		testString.includes("now!"); // true
	 * }
	 
	 */
	DL_.polyfillStringIncludes = function() {
		if (!String.prototype.includes) {
			String.prototype.includes = function() {'use strict';
				return String.prototype.indexOf.apply(this, arguments) !== -1;
			};
		}
	};

	/**
	 * In case we forget to take out console statements. 
	 * IE becomes very unhappy when we forget. 
	 * Let's not make IE unhappy
	 * Can probably be removed soon. This was one of the original 
	 * functions included in this library, back when IE7 support was more required.
	 * Run this when loading your page, will polyfill if necessary.
	 *
	 * @function polyfillConsole
	 * 
	 * @example
	 * window.onload = function() {
	 * 		DL_.polyfillConsole();
	 * 		console.log("IE won't error on console statement now!");
	 * }
	 *
	 */
	DL_.polyfillConsole = function() {
		if (typeof(window.console) === 'undefined') {
			window.console = {};
			window.consolearray = [];
			console.log = console.groupCollapsed = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function(msg) {
				consolearray.push(msg);
			};
		}
	};

	/**
	 * Polyfill for Math.sign method in ecmascript 6 spec.
	 * Support is better as of August 2017, but still not perfect
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
	 * Run this when loading your page, will polyfill if necessary.
	 *
	 * @function polyfillMathSign
	 * @example
	 * window.onload = function() {
	 * 		DL_.polyfillMathSign();
	 * 		var sign = Math.sign(-430); // -1
	 * }
	 */
	DL_.polyfillMathSign = function() {
		Math.sign = Math.sign || function(x) {
			x = +x; // convert to a number
			if (x === 0 || isNaN(x)) {
				return x;
			}
			return x > 0 ? 1 : -1;
		};
	};

	/**
	 * Polyfill for CustomEvent constructor in IE <= 11.
	 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
	 * Run this when loading your page, will polyfill if necessary.
	 *
	 * @function polyfillCustomEvent
	 * @example
	 * window.onload = function() {
	 * 		DL_.polyfillCustomEvent();
	 * 		window.addEventListener("myEvent");
	 *		window.dispatchEvent(new CustomEvent("myEvent"));
	 * }
	 */
	DL_.polyfillCustomEvent = function() {
		try {
			new window.CustomEvent("customEventPolyfillTest");
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
	};