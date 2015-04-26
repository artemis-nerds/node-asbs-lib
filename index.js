
var dir = './lib';

var net = require('net');

asbsLib = {};

for (var i in net) {
	asbsLib[i] = net[i];
}

asbsLib.Socket     = require(dir + "/asbs-socket");
asbsLib.Constants  = require(dir + "/enum-constants");
asbsLib.ParseError = require(dir + "/parseError")
asbsLib.Server     = require(dir + "/asbs-server");


// module.exports = {
// 
// 	Socket: require(dir + "/artemisSocket"),
// // 	artemisServer: require(dir + "/artemisServer"),
// 	Constants: require(dir + "/enum-constants")
// 
// };


module.exports = asbsLib;

