// gobblefile.js
var gobble = require( 'gobble' );

module.exports = gobble('src').transform('babel',{sourceMap: false});
