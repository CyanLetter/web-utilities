	/****************************************************************

	POLYFILLS

	****************************************************************/

	/* 
	 * Run the polyfills you want when initializing a page.
	 */


	/* 
	 * polyfill for String.prototype.includes method in ecmascript 6 spec.
	 * This is not well supported in all browsers yet.
	 */
	DL_.polyfillStringIncludes = function() {
		if (!String.prototype.includes) {
			String.prototype.includes = function() {'use strict';
				return String.prototype.indexOf.apply(this, arguments) !== -1;
			};
		}
	};

	/* 
	 * In case we forget to take out console statements. 
	 * IE becomes very unhappy when we forget. 
	 * Let's not make IE unhappy
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

	/*
	 * Polyfill for Math.sign method in ecmascript 6 spec.
	 * This is not yet supported in IE or Safari
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

	/*
	 * Polyfill for CustomEvent constructor in IE 11 and under.
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