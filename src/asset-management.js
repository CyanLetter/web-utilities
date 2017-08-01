	/****************************************************************

	ASSET MANAGEMENT

	****************************************************************/
	
	/**
	 * Asset Management module
	 * @module AssetManagement
	 */

	/**
	 * Vanilla JS image preloading. 
	 * Feed it an array of image paths, 
	 * and it will return an array of image 
	 * elements ready to be appended to the document.
	 *
	 * @function preloadImageArray
	 * @param {array} imgPaths - Array of image URLs to load
	 * @returns {array} - Array of image elements
	 */
    
	DL_.preloadImageArray = function(imgPaths) {
		var imageArray = [];
		for (i = 0; i < imgPaths.length; i++) {
			imageArray[i] = new Image();
			imageArray[i].src = imgPaths[i];
		}
		return imageArray;
	};