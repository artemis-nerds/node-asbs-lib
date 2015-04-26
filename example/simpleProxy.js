
// A simple script used during development to output game packets,  but skipping those which are too common. Useful to debug unknown values.


var asbsLib = require('../index');
var net = require('net');

var asbsSocket = new asbsLib.Socket();

var conns = [];

// The Socket will throw errors when parsing a packet fails
asbsSocket.on('error', function(err) {
	console.error(err);
});
asbsSocket.on('unparsed', function(err) {
	console.warn(err);
});


var asbsServer = new asbsLib.Server();

asbsServer.on('connection', function(conn){
	
// 	console.log('client connected: ', conn);
	console.log('client is a net.Socket: ', conn instanceof net.Socket);
	console.log('client is a asbs.Socket: ', conn instanceof asbsLib.Socket);
	
	// These four packets are the bare minimum required for clients 
	//   to think that this is a server.
	
	// The welcome message cannot be modified, or else clients will
	//   reject this as a game server.
	conn.send('welcome', {str: 'You have connected to Thom Robertson\'s Artemis Bridge Simulator. Please connect with an authorized game client.'}, true);
	conn.send('version', {
		unknown01: 0x04ec,
		unknown02: 0x40000000,
		major: 2,
		minor: 1,
		patch: 5
	}, true);
	conn.send('consoles', { 
		playerShipIndex: 1,
		mainScreen: 0,
		helm: 0,
		weapons: 0,
		engineering: 0,
		science: 0,
		communications: 0,
		data: 0,
		observer: 0,
		captainsmap: 0,
		gameMaster: 0
	}, true);
	
	conn.send('allPlayerShipsSettings', [ ,
		{ driveType: 0, shipType: 0, unknown03: 1, name: 'Artemis' },
		{ driveType: 0, shipType: 0, unknown03: 1, name: 'Intrepid' },
		{ driveType: 0, shipType: 0, unknown03: 1, name: 'Aegis' },
		{ driveType: 0, shipType: 0, unknown03: 1, name: 'Horatio' },
		{ driveType: 0, shipType: 0, unknown03: 1, name: 'Excalibur' },
		{ driveType: 0, shipType: 0, unknown03: 1, name: 'Hera' },
		{ driveType: 0, shipType: 0, unknown03: 1, name: 'Ceres' },
		{ driveType: 0, shipType: 0, unknown03: 1, name: 'Diana' } ]
	, true);
	
	conn.on('packet', function(n,d) {
		console.log('Packet from client, proxying to game server: ',n,d);
		asbsSocket.send(n,d,false);
	});
	conns.push(conn);
});


asbsServer.on('listening', function(){
	console.log('asbsServer listening');
});

asbsServer.listen(2010);


asbsSocket.on('packet', function(n, d){
	// This is gonna be *very* verbose.
	console.log('Packet from game server, proxying to all clients: ',n,d);
	for (var i in conns) {
		conns[i].send(n, d, true);
	}
});

// And this is the real Artemis server we'll be using.
asbsSocket.connect({ host: '192.168.0.188', port: 2010 });

