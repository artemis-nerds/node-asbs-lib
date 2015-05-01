

// Data types for packet unpacking/packing for the Artemis SBS net protocol.

var enums = require('./data-types');


/**
 * Data types contained in the Artemis SBS net protocol.
 *
 * Data types are plain objects like this:
 *
 * var type = {
 *     unpack: function(buffer) {},
 *       pack: function(buffer, value) {}
 * }
 *
 * Assume that the buffer parameter is a Buffer object with an extra "pointer" property.
 * The job of both pack and unpack is to read from the buffer at the position indicated
 * by the pointer (int, in bytes), and advance the pointer as needed.
 *
 * The Artemis SBS net protocol uses little-endian everywhere. No reason to implement any
 * endiannes switching logic here.
 *
 * Uses a few ideas borrowed from node-ref. Not using node-ref because the
 * data  structures here have variable sizes, and I want to pack/unpack them to a Buffer,
 * not read/write from/to memory.
 */



export var int8 = {
	unpack: function(buffer){
		var value = buffer.readUInt8(buffer.pointer);
		buffer.pointer += 1;
		return value;
	},
	pack: function(buffer, value){
		buffer.writeUInt8(value || 0, buffer.pointer);
		buffer.pointer += 1;
	}
}

export var int16 = {
	unpack: function(buffer){
		var value = buffer.readUInt16LE(buffer.pointer);
		buffer.pointer += 2;
		return value;
	},
	pack: function(buffer, value){
		buffer.writeUInt16LE(value || 0, buffer.pointer);
		buffer.pointer += 2;
	}
}

export var int32 = {
	unpack: function(buffer){
		var value = buffer.readUInt32LE(buffer.pointer);
		buffer.pointer += 4;
		return value;
	},
	pack: function(buffer, value){
		buffer.writeUInt32LE(value || 0, buffer.pointer);
		buffer.pointer += 4;
	}
}

export var float = {
	unpack: function(buffer){
		var value = buffer.readFloatLE(buffer.pointer);
		buffer.pointer += 4;
		return value;
	},
	pack: function(buffer, value){
		buffer.writeFloatLE(value || 0, buffer.pointer);
		buffer.pointer += 4;
	}
}

export var string = {
	unpack: function(buffer){
		var strLen = buffer.readUInt32LE(buffer.pointer) * 2;
		if (strLen > 1024) {
			console.warn ("String length seems too long: ", strLen);
			console.warn ("String chars seems to read: ", buffer.toString('ascii', buffer.pointer+4, buffer.pointer + 8));
		}
		
		var str    = buffer.toString('utf16le', buffer.pointer+4, buffer.pointer + strLen + 2)
// 	var str    = buffer.toString('ascii', this.pointer+4, this.pointer + strLen + 2);
		var strEnd = buffer.readUInt16LE(buffer.pointer + strLen + 2);
		if (strEnd !== 0) {
			console.warn("String does not end with 0x0000!!");
		}
		buffer.pointer += strLen + 4;
// 					console.warn ("Read string:" , str);
		return str;
	},
	pack: function(buffer, str){
		var strLen = str.length;
		buffer.writeUInt32LE(strLen+1, buffer.pointer);
		buffer.pointer += 4;
		
		/// HACK: Node doesn't seem to handle little-endian UTF16 well enough on ARMel CPUs, so let's fall back to ASCII for the time being.
		buffer.write(str,buffer.pointer, strLen*2, 'utf16le');
	// 	this.buffer.write(str,buffer.pointer, strLen*2, 'ascii');
		buffer.pointer += strLen*2;
		buffer.writeUInt16LE(0, buffer.pointer);
		buffer.pointer += 2;
	}
}

export var asciiString = {
	unpack: function(buffer){
		// This is only called on the welcome packet; all other strings
		//   are UTF-16.
		var strLen = buffer.readUInt32LE(buffer.pointer);
		
		var str    = buffer.toString('ascii', buffer.pointer+4, buffer.pointer + strLen + 4)
		buffer.pointer += 4 + strLen;
		return str;
	},
	pack: function(buffer, str){
		var strLen = str.length;
		buffer.writeUInt32LE(strLen+1, buffer.pointer);
		buffer.pointer += 4;
		
		buffer.write(str,buffer.pointer, strLen, 'ascii');
	// 	this.buffer.write(str,buffer.pointer, strLen*2, 'ascii');
		buffer.pointer += strLen;
	}
}


/**
 * A struct is roughly equal to a map/dictionary, as it will pack and unpack to/from a plain object.
 * For any given struct, create a new instance, passing the struct fields in a plain object
 *
 * // var myStruct = new Struct({ name: string, id: int32 });
 * // var myStruct =     struct({ name: string, id: int32 });	// shorthand
 *
 * @param {Object} fields
 * @constructor
 */


class Struct {
	constructor(fields) {
		this.fieldNames = Object.keys(fields);
		this.fieldTypes = [];
		this.fieldCount = this.fieldNames.length;
		for (var i=0; i<this.fieldCount; i++)  {
			this.fieldTypes[i] = fields[ this.fieldNames[i] ];
		}
	}

	unpack(buffer){
		var value = {};
		for (var i=0; i<this.fieldCount; i++)  {
			value[ this.fieldNames[i] ] = this.fieldTypes[i].unpack(buffer);
// 		console.log('struct, ', i, ' pointer ', buffer.pointer, ' value ' , value[ this.fieldNames[i] ]);
		}
		return value;
	}

	pack(buffer,data){
		for (var i=0; i<this.fieldCount; i++)  {
			if (data.hasOwnProperty( this.fieldNames[i] )) {
				this.fieldTypes[i].pack(buffer, data[ this.fieldNames[i] ]);
			} else {
				this.fieldTypes[i].pack(buffer, undefined);
			}
		}
	}
}


export function struct(fields) { return new Struct(fields); }




/**
 * Pretty much like a struct, but prepended by a bitmap - if a bit is 1, then the field is defined;
 * if 0, the value for that field is undefined.
 *
 * The order in which the fields is defined is obviously critical to match the bits in the bitmap!
 * Bitmap length is always in bytes. Some of the bits might be unused.
 *
 * @param {Number} bitmapLength
 * @param {Object} fields
 * @constructor
 */
class BitmapStruct{
	constructor(bitmapLength,fields) {
		this.bitmapLength = bitmapLength;
		this.fieldNames = Object.keys(fields);
		this.fieldTypes = [];
		this.fieldCount = this.fieldNames.length;
		for (var i=0; i<this.fieldCount; i++)  {
			this.fieldTypes[i] = fields[ this.fieldNames[i] ];
		}
	}

	unpack(buffer) {
		var bitmap = Array(this.bitmapLength);
		for (var i=0; i<this.bitmapLength; i++)  {
			bitmap[i] = (int8.unpack(buffer));
		}
		var value = {};
		var i = 0;
		for (var byte=0; byte<this.bitmapLength; byte++)  {
			for (var bit=0; bit<8 && i< this.fieldCount; bit++)  {
				if (bitmap[byte] & 1<<bit ) {
					value[ this.fieldNames[i] ] = this.fieldTypes[i].unpack(buffer);
				}
				i++;
			}
		}
		return value;
	}

	pack(buffer,data) {
		var bitmap = Array(this.bitmapLength);
		for (var i=0; i<this.bitmapLength; i++)  {
			bitmap[i]=0;
		}

		var i = 0;
		for (var byte=0; byte<this.bitmapLength; byte++)  {
			for (var bit=0; bit<8; bit++)  {
				if (this.fieldNames[i] in data) {
					bitmap[byte] += 1<<bit;
				}
				i++;
			}
			int8.pack(buffer, bitmap[byte]);
		}

		for (var i=0; i<this.fieldCount; i++)  {
			if (this.fieldNames[i] in data) {
				this.fieldTypes[i].pack(buffer, data[ this.fieldNames[i] ]);
			}
		}
	}

}

export function bitmapstruct(bitmapLength,fields) { return new BitmapStruct(bitmapLength,fields); }






/**
 * Similar in the consruction to a BitmapStruct, this is basically multiple structs
 * one after the other, 1-indexed.
 * TODO: maybe instead of converting fields to a struct we should accept any data type
 *       to support single-item arrays
 *
 * @param {Number} length
 * @param {Object} fields
 * @constructor
 */
class StaticSizeArray {
	constructor (length, fields) {
		this._length = length;
		this._struct = new Struct(fields);
	}

	unpack(buffer) {
		var value = [];
		for (var i = 0; i < this._length; i++) {
	// 		console.log('staticsizearray, i ', i, ' pointer ', buffer.pointer);
			value[i+1] = this._struct.unpack(buffer);
	// 		console.log(value[i]);
		}
		return value;
	}

	pack(buffer, data) {
		for (var i = 0; i < this._length; i++) {
			this._struct.pack(buffer, data[i+1] || {});
		}
	}
}

export function staticsizearray(length, fields) {return new StaticSizeArray(length, fields);}







/**
 * An array with an arbitrary number of concatenated structs. If the byte after a struct
 * is equal to the given boundary marker, that's the end of the array.
 * TODO: maybe instead of converting fields to a struct we should accept any data type
 *       to support single-item arrays
 *
 * @param {Number} marker
 * @param {Object} fields
 * @constructor
 */
class ByteBoundArray {
	constructor(marker,fields) {
		this._marker = marker;
		this._struct = new Struct(fields);
	}

	unpack(buffer) {
		var value = [];
		var i = 0;
		while (buffer.readUInt8(buffer.pointer) !== this._marker) {
	// 		console.log('staticsizearray, i ', i, ' pointer ', buffer.pointer);
			value[i+1] = this._struct.unpack(buffer);
	// 		console.log(value[i]);
			i +=1 ;
		}
		buffer.pointer += 1;
		return value;
	}

	pack(buffer,data) {
		for (var i = 0; i < data.length; i++) {
			this._struct.pack(buffer, data[i+1] || {});
		}
		buffer.writeUInt8(this._marker, buffer.pointer);
	}

}

export function byteboundarray(marker, fields) { return new ByteBoundArray(marker,fields); }




/**
 * An enumerated type. Internally it has a map of keys-values, used to convert string values
 * into numeric values on the wire (and viceversa).
 * 
 * @param {type} Base type
 * @param {Object} key-value map
 * @constructor
 */
// class _enum {
// 	constructor(type, map) {
// 		this._type = type;
// 		this._map = Object.create(map);
// 		this._inverseMap = {};
// 		for (var i in this._map) {
// 			this._inverseMap[ this._map[i] ] = i;
// 		}
// 	}
// 	
// 	unpack(buffer) {
// 		return this._map[ this._type.unpack(buffer) ];
// 	}
// 	
// 	pack(buffer, data) {
// 		return this._type.pack( this._inverseMap[data] );
// 	}
// 	
// }
// 
// 
// export var beamFrequency8  = new _enum(int8,  enums.beamFrequency);
// export var beamFrequency32 = new _enum(int32, enums.beamFrequency);



