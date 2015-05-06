
// A simple script used during development to output game packets,  but skipping those which are too common. Useful to debug unknown values.


var artemisLib = require('../index');
var artemisSocket = artemisLib.Socket;



var mySock = new artemisSocket({
	enum: true,
	bool: true
});


// The Socket will throw errors when parsing a packet fails
mySock.on('error', function(err) {
	console.error(err);
});


mySock.on('packet', function(packetName, packet){
	// Ignore common packets.
	if (
	    packetName === 'playerShip' ||
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

mySock.send('setConsole',{console: 'mainScreen'     , selected: 1});
mySock.send('setConsole',{console: 'communications' , selected: 1});
mySock.send('setConsole',{console: 'data'           , selected: 1});
mySock.send('setConsole',{console: 'observer'       , selected: 1});
mySock.send('setConsole',{console: 'captainsMap'    , selected: 1});
mySock.send('setConsole',{console: 'gameMaster'     , selected: 1});

