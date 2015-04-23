
// A simple script used during development to output game packets,  but skipping those which are too common. Useful to debug unknown values.


var artemisLib = require('../index');
var artemisSocket = artemisLib.Socket;




var mySock = new artemisSocket();

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


