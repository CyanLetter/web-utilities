	/****************************************************************

	PHYSICS

	****************************************************************/
	
	/*
	 * Generic intersect check with square bounding box.
	 * Takes x, y, width, and height args for objects a and b.
	 * Assumes x: 0, y: 0 is the top left corner
	 * for both objects and the screen
	 */

	DL_.boxIntersect = function (aX, aY, aW, aH, bX, bY, bW, bH) {
		return (
			aX < bX + bW &&		// left edge of A is less than right edge of B
			aX + aW > bX &&		// right edge of A is greater than left edge of B
			aY < bY + bH &&		// top edge of A is less than bottom edge of B
			aY + aH > bY 		// bottom edge of A is greater than top edge of B
		);
	};

	/*
	 * Intersect check with circular boundaries.
	 * Dependent on anchor point.
	 */
	DL_.circleIntersect = function (x1, y1, r1, x2, y2, r2) {
		var xd = x1 - x2;
		var yd = y1 - y2;
		var rt = r2 + r1;
		return (xd * xd + yd * yd <= rt * rt);
	};