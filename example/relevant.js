
// A simple script used during development to output game packets,  but skipping those which are too common. Useful to debug unknown values.


var artemisLib = require('../index');
var artemisSocket = artemisLib.Socket;



// debug:true will print partially parsed packets.
var mySock = new artemisSocket({debug: true});


// The Socket will throw errors when parsing a packet fails
mySock.on('error', function(err) {
	console.error(err);
});


mySock.on('packet', function(packetName, packet){
	if (packetName === 'playerShip' ||
	    packetName === 'npc' ||
	    packetName === 'whale' ||
	    packetName === 'intel' ||
	    packetName === 'weapons' ||
	    packetName === 'upgrades' ||
	    packetName === 'noUpdate')
		return;
		
	console.log(packetName, packet);
});

mySock.connect({ host: 'localhost', port: 2010 });


