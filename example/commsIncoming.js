
// Connect to a local game, and output only the comms messages


var artemisLib = require('../index');
var artemisSocket = artemisLib.Socket;




var mySock = new artemisSocket();

mySock.on('commsIncoming', function(packet){
	console.log("Message from: ", packet.sender,
	          "\nPriority: ", packet.priority,
	          "\nContents: ", packet.msg,
	          "\n\n"
	); 
});

mySock.connect({ host: 'localhost', port: 2010 });


