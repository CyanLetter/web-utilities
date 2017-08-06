	/****************************************************************

	PHYSICS

	****************************************************************/
	
	/**
	 * Generic intersect check with square bounding box.
	 * Assumes x: 0, y: 0 is the top left corner
	 * for both objects and the screen
	 *
	 * @function boxIntersect
	 * @param {float} aX - The x position of the first object.
	 * @param {float} aY - The y position of the first object.
	 * @param {float} aW - The width of the first object.
	 * @param {float} aH - The height of the first object.
	 * @param {float} bX - The x position of the second object.
	 * @param {float} bY - The y position of the second object.
	 * @param {float} bW - The width of the second object.
	 * @param {float} bH - The height of the second object.
	 * @returns {bool} True if there is an intersection.
	 * @example
	 * var rect1 = {
	 *   x: -2,
	 *   y: 1,
	 *   width: 5,
	 *   height: 5
	 * };
	 * var rect2 = {
	 *   x: 2,
	 *   y: 4,
	 *   width: 10,
	 *   height: 18
	 * };
	 * // returns true
	 * DL_.boxIntersect(rect1.x, rect1.y, rect1.width, rect1.height, rect2.x, rect2.y, rect2.width, rect2.height);
	 */
	DL_.boxIntersect = function (aX, aY, aW, aH, bX, bY, bW, bH) {
		return (
			aX < bX + bW &&		// left edge of A is less than right edge of B
			aX + aW > bX &&		// right edge of A is greater than left edge of B
			aY < bY + bH &&		// top edge of A is less than bottom edge of B
			aY + aH > bY 		// bottom edge of A is greater than top edge of B
		);
	};

	/**
	 * Intersect check with circular boundaries.
	 * Dependent on anchor point.
	 *
	 * @function circleIntersect
	 * @param {float} x1 - The x position of the first object.
	 * @param {float} y1 - The y position of the first object.
	 * @param {float} r1 - The radius of the first object.
	 * @param {float} x2 - The x position of the second object.
	 * @param {float} y2 - The y position of the second object.
	 * @param {float} r2 - The radius of the second object.
	 * @returns {bool} True if there is an intersection.
	 * @example
	 * var circ1 = {
	 *   x: 1,
	 *   y: 3,
	 *   radius: 12
	 * };
	 * var circ2 = {
	 *   x: -4,
	 *   y: 0,
	 *   radius: 1
	 * };
	 * // returns true
	 * DL_.circleIntersect(circ1.x, circ1.y, circ1.radius, circ2.x, circ2.y, circ2.radius);
	 */
	DL_.circleIntersect = function (x1, y1, r1, x2, y2, r2) {
		var xd = x1 - x2;
		var yd = y1 - y2;
		var rt = r2 + r1;
		return (xd * xd + yd * yd <= rt * rt);
	};