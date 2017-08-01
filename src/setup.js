	/** 
	 * @namespace DL_
	 * @property {module:AssetManagement} AssetManagement
	 * @property {module:DataStructures} DataStructures
	 * @property {module:DateTime} DateTime
	 * @property {module:Maths} Maths
	 * @property {module:Parsing} Parsing
	 * @property {module:Physics} Physics
	 * @property {module:Polyfills} Polyfills
	 * @property {module:Randomization} Randomization
	 * @property {module:TextLayout} TextLayout
	 * @property {module:Validation} Validation
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