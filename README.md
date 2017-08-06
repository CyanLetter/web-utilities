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

## Building

This project uses grunt to run build tasks.

Download the project and `npm install` to get all of the necessary dev dependencies.

To build everything, use either `grunt` or `grunt build`. This will create both `utilities.js` and `utilities.min.js` in the build folder, run tests, and generate documentation for github pages.

For development builds, run `grunt dev`. This will generate a new, unminified `utilities.js` file in the build folder, and run jshint to flag any problems.

Documentation requires a web server to run, and is built differently for local use and use in github pages. To generate docs that will be accessible locally, run `grunt localdocs` and point a web server at the docs folder. Just remember to run `grunt docs` before committing to make sure github pages can properly understand them.

To run tests, use `grunt test` for the test suite, or `grunt test-coverage` to also test, well, test coverage.
