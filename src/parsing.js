	/****************************************************************

	PARSING

	****************************************************************/

	/*  
	 * get the query string from the uri.
	 * Mostly added so we can override for unit testing.
	 * Substring is to drop the ? from the beginning.
	 */
	DL_.getLocationSearch = function() {
		return window.location.search.substring(1);
	};

	/*  
	 * get variable from query string
	 * so running getQueryVariable('dest') on
	 * www.mysite.com/default.aspx?dest=aboutus.aspx
	 * would return
	 * "aboutus.aspx"
	 */
	DL_.getQueryVariable = function(variable) {
		var vars = DL_.getLocationSearch().split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) == variable) {
				return decodeURIComponent(pair[1]);
			}
		}
		console.log('Query variable %s not found', variable);
		return null;
	};

	/*
	 * User Agent Sniffing method of mobile detection. Gross.
	 * Last Jan 11, 2016
	 * from https://gist.github.com/dalethedeveloper/1503252
	 */
	DL_.mobilecheck = function() {
		var check = false;
		( function(a) {
			if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(a)) {
				check = true;
			}
		})(navigator.userAgent);
		return check; 
	};

	/*
	 * Get file type from extension. 
	 * Removes query strings that come 
	 * after the file request as well. 
	 * Does NOT deal with invalid inputs 
	 * at the moment, so should probably 
	 * validate that input equals output
	 */
	DL_.getFileType = function (url) {
		var fileType = url.split('?').shift().split('.').pop().toLowerCase();
		return fileType;
	};