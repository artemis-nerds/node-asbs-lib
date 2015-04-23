
// Whenever someone turns on the red alert, shut it off one second later.
// This shows how to mimic a station in a given player ship index (0-7)

var artemisLib = require('../index');
var artemisSocket = artemisLib.Socket;


var mySock = new artemisSocket();
mySock.connect({ host: 'localhost', port: 2010 });


var alertOn = false;
var myShipIndex = 1;

mySock.on('playerShip', function(packet) {
	
	// playerShip.data is a bitmapstruct internally, which
	//   means it might or might not have its fields set.
	if ('redAlert' in packet.data) {
		
		console.log("The ship's red alert status is:", packet.data.redAlert);
		
		if (!alertOn && packet.data.redAlert) {
			console.log("But I'll turn that infernal noise off in one second.");
			
			setTimeout(function(){
				mySock.send('toggleRedAlert',{});
			}, 1000);
			
		}
		
		alertOn = packet.data.redAlert;
	}
});


// This is 0-indexed, but the playerShip.data.playerShipIndex is 1-based!!
mySock.send('setPlayerShipIndex', {playerShipIndex: myShipIndex -1 });

mySock.send('setConsole',{console: 5 /* Comms */ , selected: 1});


