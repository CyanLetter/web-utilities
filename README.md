# DL_ Web Utilities

![travis-ci](https://travis-ci.org/CyanLetter/web-utilities.svg?branch=master) 
[![Test Coverage](https://codeclimate.com/github/CyanLetter/web-utilities/badges/coverage.svg)](https://codeclimate.com/github/CyanLetter/web-utilities/coverage)
[![Inline docs](http://inch-ci.org/github/CyanLetter/web-utilities.svg?branch=master)](http://inch-ci.org/github/CyanLetter/web-utilities)

This is a collection of utility functions that I have found helpful to have on hand. Some of these, like collision testing, are useful for games. Some are helpful for working with javascript in general.

This has also served as my go-to project for learning how to implement things like build automation, unit testing, and documentation generation.

## Documentation

Documentation can be found at [cyanletter.github.io/web-utilities/](http://cyanletter.github.io/web-utilities/)

Generated with [Docma](https://github.com/onury/docma/)

## Usage

Include one of the files located in the `build` folder in your site, e.g.

`<script type="text/javascript" src="assets/js/utilities.min.js"></script>`

This creates a global object, `DL_`, through which you can access all of the functions. Most of these functions simply return a value when called, for example:

```
var color = DL_.rgbToHex(42, 215, 252); 
// #2ad7fc
```

Notable exceptions include:

The **Timer**, which requires a constructor.

```
var delay = new DL_.Timer(function(){
	// do things
}, 1000);
```

**Polyfills**, which you should run once before trying to use the polyfilled function.

```
DL_.polyfillMathSign();
// use normally
var sign = Math.sign(-42);
```

And functions with **jQuery dependencies**, which will default to a no-op function if you use them without loading jquery.

