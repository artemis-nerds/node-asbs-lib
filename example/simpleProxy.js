
// A simple naïve proxy. This demonstrates how a asbs.Server can receive 
//   clients which will be sent to the game server and viceversa.

// It is *very* naïve and doesn't implement world model, console statuses
//   at start-up, disconnections/reconnections, et cetera. It's 
//   here to serve as an example.

var asbsLib = require('../index');
var net = require('net');

// This will connect the proxy to the game server.
var asbsSocket = new asbsLib.Socket();

// List of active client connections, used when the proxy needs to fan out
//   packets from the game server.
var conns = [];

// The Socket will throw errors when parsing a packet fails
asbsSocket.on('error', function(err) {
	console.error(err);
});
asbsSocket.on('unparsed', function(err) {
	console.warn(err);
});


// This will connect the clients to the proxy.
var asbsServer = new asbsLib.Server();

asbsServer.on('connection', function(conn){
	
	// These four packets are the bare minimum required for clients 
	//   to think that this is a server.
	
	// The welcome message can be modified, but it has to be the same
	//   length as the original one, or else clients will
	//   reject this as a game server.
	conn.send('welcome', {str: "This is IvanSanchez's example of a Artemis Space Bridge Simulator proxy. Welcome.                              "}, true);
// 	conn.send('welcome', {str: "You have connected to Thom Robertson's Artemis Bridge Simulator. Please connect with an authorized game client."}, true);
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
	console.log('Packet from game server, fanning out to all clients: ',n,d);
	for (var i in conns) {
		conns[i].send(n, d, true);
	}
});

// And this is the real Artemis server we'll be using.
asbsSocket.connect({ host: '192.168.0.188', port: 2010 });

