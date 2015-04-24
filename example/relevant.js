
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
	// Ignore common packets.
	if (packetName === 'playerShip' ||
	    packetName === 'npc'     ||
	    packetName === 'mine'    ||
	    packetName === 'nebula'  ||
	    packetName === 'asteroid'||
	    packetName === 'anomaly' ||
	    packetName === 'drone'   ||
	    packetName === 'whale'   ||
	    packetName === 'intel'   ||
	    packetName === 'weapons' ||
	    packetName === 'upgrades' ||
	    packetName === 'damConInfo' ||
	    packetName === 'beamFired' ||
	    packetName === 'noUpdate')
		return;
		
	console.log(packetName, packet);
});

mySock.connect({ host: 'localhost', port: 2010 });


mySock.send('setPlayerShipIndex', {playerShipIndex: 0 });

mySock.send('setConsole',{console: 0 /* MnScr */ , selected: 1});
mySock.send('setConsole',{console: 5 /* Comms */ , selected: 1});
mySock.send('setConsole',{console: 6 /* Data  */ , selected: 1});
mySock.send('setConsole',{console: 7 /* Obsrv */ , selected: 1});
mySock.send('setConsole',{console: 8 /* Captn */ , selected: 1});
mySock.send('setConsole',{console: 9 /* GMstr */ , selected: 1});

