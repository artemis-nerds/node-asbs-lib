// gobblefile.js
var gobble = require( 'gobble' );

module.exports = gobble('src')
	.transform('babel',{sourceMap: false})
	.observe('eslint', {
// 		env: {
// 			es6: true
// 		},
		rules: {
			// No special rules, let's use eslint's defaults by now.
		}
	})
	;
