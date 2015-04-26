'use strict';


var net = require("net");
var util = require('util');
var asbsSocket = require('./asbs-socket');


// Extends a plain net.Socket by adding properties
//   and methods during run-time. 
function decoratePlainSocket(sock) {
	sock._parseData   = asbsSocket.prototype._parseData;
	sock.send         = asbsSocket.prototype.send;
	sock._debugBuffer = asbsSocket.prototype._debugBuffer;
	
	sock.on('data', sock._parseData);
	return sock;
}



// For some reason, the ES6 classes through BabelJS fuck up
//   the inheritance of net.Server, so I've inspired myself on the 
//   node TLS code.

function Server(/* [options], listener */) {

	if (!(this instanceof Server)) return new Server(options, listener);

	net.Server.call(this, function(rawSocket){
		rawSocket = decoratePlainSocket(rawSocket);
	});
	
}

util.inherits(Server, net.Server);
module.exports = Server;

