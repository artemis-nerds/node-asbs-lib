

// Small utility script to parse & debug packets from a debug dump.
// More of a low-level utility than an example, but whatever.



// ef be ad de 16 01 00 00 01 00 00 00 00 00 00 00 02 01 00 00 f9 3d 80 80 01 aa 08 00 00 be aa fb 24 20 00 00 80 3f 23 c1 12 3f 9a 99 19 3f 6f 12 83 3b 01 79 00 7a 44 01 00 00 00 e0 c0 49 47 42 3e 3a 47 a2 c6 b1 bb 27 c9 48 c0 9a 99 19 3f 08 00 00 00 41 00 72 00 74 00 65 00 6d 00 69 00 73 00 00 00 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 50 43 48 08 02 01 ab 08 00 00 ff ff ff ff 7f 00 00 00 00 00 00 80 3f be 6b db 3e 9a 99 19 3f 6f 12 83 3b 01 00 79 00 7a 44 00 00 02 00 00 00 00 00 00 00 d4 9d 49 47 00 00 00 00 8a 26 43 47 00 00 00 00 a4 c5 93 3b 43 d5 48 40 9a 99 19 3f ff ff 09 00 00 00 49 00 6e 00 74 00 72 00 65 00 70 00 69 00 64 00 00 00 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 00 00 00 00 50 43 48 00 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 02 00 00 00 00 00 00 00 00


// var payload = 'be aa fb 24 20 00 00 80 3f 23 c1 12 3f 9a 99 19 3f 6f 12 83 3b 01 79 00 7a 44 01 00 00 00 e0 c0 49 47 42 3e 3a 47 a2 c6 b1 bb 27 c9 48 c0 9a 99 19 3f 08 00 00 00 41 00 72 00 74 00 65 00 6d 00 69 00 73 00 00 00 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 50 43 48 08 02 01 ab 08 00 00 ff ff ff ff 7f 00 00 00 00 00 00 80 3f be 6b db 3e 9a 99 19 3f 6f 12 83 3b 01 00 79 00 7a 44 00 00 02 00 00 00 00 00 00 00 d4 9d 49 47 00 00 00 00 8a 26 43 47 00 00 00 00 a4 c5 93 3b 43 d5 48 40 9a 99 19 3f ff ff 09 00 00 00 49 00 6e 00 74 00 72 00 65 00 70 00 69 00 64 00 00 00 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 00 00 00 00 50 43 48 00 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 02 00 00 00 00 00 00 00 00';




// ef be ad de af 00 00 00 01 00 00 00 00 00 00 00 9b 00 00 00 f9 3d 80 80 01 ed 05 00 00 80 a8 00 00 00 40 89 62 44 a6 12 84 46 5b 12 05 47 71 a8 ad b2 01 ee 05 00 00 80 a8 00 00 00 23 17 62 44 c0 48 66 46 c5 24 1b 47 d5 a7 63 8b 01 6e 07 00 00 be 2a ff 24 24 00 00 80 3f 77 ad eb 3e 9a 99 19 3f 6f 12 83 3b 01 4c 00 7a 44 03 00 00 00 6a ad 4b 47 6d 3d 3b 47 db 0f 49 40 35 5e 3a 3e 79 ff 06 00 00 00 41 00 65 00 67 00 69 00 73 00 00 00 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 50 43 48 08 e4 fd ef ff 02 00 00 00 00 


var payload = "be 2a ff 24 24 00 00 80 3f 77 ad eb 3e 9a 99 19 3f 6f 12 83 3b 01 4c 00 7a 44 03 00 00 00 6a ad 4b 47 6d 3d 3b 47 db 0f 49 40 35 5e 3a 3e 79 ff 06 00 00 00 41 00 65 00 67 00 69 00 73 00 00 00 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 50 43 48 08 e4 fd ef ff 02 00 00 00 00";

var payload = "be 2a ff 24 24 00 00 80 3f 77 ad eb 3e 9a 99 19 3f 6f 12 83 3b 01 4c 00 7a 44 03 00 00 00 6a ad 4b 47 6d 3d 3b 47 db 0f 49 40 35 5e 3a 3e 79 ff 06 00 00 00 41 00 65 00 67 00 69 00 73 00 00 00 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 a0 42 00 50 43 48 08 e4 fd ef ff 02 00 00 00 00";





var hexBytes = payload.split(' ');
var buffer = new Buffer(2048);
buffer.pointer = 0;

for (var i=0; i<hexBytes.length; i++) {
	buffer.writeUInt8(parseInt(hexBytes[i],16),i);
}

// console.log(buffer);

var packetDefs   = require('../lib/packet-defs').getPacketDefs({});
var packetDefsByType = packetDefs.packetDefsByType;
var packetDefsByName = packetDefs.packetDefsByName;

// console.log(packetDefsByName.playerShip.fields.fieldTypes[1]);

// var foo = packetDefsByName.playerShip.fields.fieldTypes[1].debugUnpack(buffer);
// console.dir(foo);
var foo = packetDefsByName.playerShip.fields.fieldTypes[1].debugUnpack(buffer);
console.log('Remaining: ', buffer.slice(buffer.pointer));
console.dir(foo);



