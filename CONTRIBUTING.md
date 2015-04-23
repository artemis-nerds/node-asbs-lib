

## Contributing code

Preferred way of accepting new code is via pull requests. Quality bug reports are also highly valued.



## Versioning

One of the aims of this library is to try and have compatibility with different versions of Artemis SBS. The `master` branch shall host the code compatible with the latest available version of the game. Branches compatible with previous versions shall be hosted in branches with the version supported, e.g. `artemis-v2.1.0`.



## ES6

This library uses the awesomeness of ECMAScript6, with its built-in classes and exports and whatnot.

Unfortunately nodejs and iojs don't support some of the features, so for the time being, this will use babeljs to transpile ES6 to ES5 with some gobble-babel magic.

Source files are in `/src`, and the transpiled files will be in `lib`. This is transparent when installing the library via `npm install`, but if you're developing or testing, you really want to keep transpiling as you type new stuff into the source code.

In other words: when developing, open up an extra console and run `npm script watch` in the background.










