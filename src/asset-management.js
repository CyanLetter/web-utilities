	/****************************************************************

	ASSET MANAGEMENT

	****************************************************************/

	/**
	 * Vanilla JS image preloading. 
	 * Feed it an array of image paths, 
	 * and it will return an array of image 
	 * elements ready to be appended to the document.
	 * No callback or complete support, however.
	 * A better solution may be found here:
	 * https://stackoverflow.com/questions/8264528/image-preloader-javascript-that-supports-events/8265310#8265310
	 *
	 * @function preloadImageArray
	 * @param {array} imgPaths - Array of image URLs to load
	 * @returns {array} - Array of image elements
	 *
	 * @example
	 * var preload = ["images/hat1.jpg", "images/hat2.jpg", "images/hat3.jpg"];
	 * var images = DL_.preloadImageArray(preload);
	 *
	 * function changeHat() {
	 * 		var hat = document.getElementById("hat");
	 * 		hat innerHTML = "";
	 * 		hat.append(DL_.randFromArray(images));
	 * }
	 */
    
	DL_.preloadImageArray = function(imgPaths) {
		var imageArray = [];
		for (i = 0; i < imgPaths.length; i++) {
			imageArray[i] = new Image();
			imageArray[i].src = imgPaths[i];
		}
		return imageArray;
	};