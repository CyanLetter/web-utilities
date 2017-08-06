	/** 
	 * @namespace DL_
	 */
	DL_ = DL_ || {};

	/**
	 * A predefined noop, so we can make efficient self destroying functions and such.
	 * @function noop
	 * @example
	 * var fireOnce = function() {
	 *   // do something, then redefine self to a noop
	 *   fireOnce = DL_.noop;
	 * }
	 */
	DL_.noop = function (){};