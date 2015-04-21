


var artemisLib = require('../index');


var artemisSocket = artemisLib.artemisSocket;




var mySock = new artemisSocket();

mySock.on('packet', function(packet){ console.log(packet); });

mySock.connect({ host: 'localhost', port: 2010 });


