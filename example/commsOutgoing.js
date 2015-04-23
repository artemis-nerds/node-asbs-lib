
// Connect to a local game, and send a comms message using the GM
//   interface.


var artemisLib = require('../index');
var artemisSocket = artemisLib.Socket;


var mySock = new artemisSocket();
mySock.connect({ host: 'localhost', port: 2010 });


mySock.send('gameMasterMessage', {
	destination: 0,
	sender: 'Example script',
	msg: 'Hello world!!'	
});


