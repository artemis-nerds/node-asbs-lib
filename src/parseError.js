'use strict';

// Called when a ParseError is ToStringed
function debugBuffer(buffer) {
	var str = '';
	for (var i = 0; i < buffer.length; i++) {
		var hex = buffer.readUInt8(i).toString(16);
		if (hex.length < 2) {
			hex = "0" + hex;
		}
		str += hex + ' ';
	}
	return str;
}

class ParseError extends Error {

	constructor(message, buffer, stack) {
		super();
		Error.captureStackTrace(this, this.constructor);

		// Makes sure the values act like proper Error values
		Object.defineProperties(this, {
			message: {value: message},
			buffer:  {value: buffer}
			_stack:  {value: stack}
		});
	}

	get name() {
		return this.constructor.name;
	}

	toString() {
		return this.message +
			'\nBuffer data is:\n' +
			debugBuffer(this.buffer) + '\n' +
			this._stack;
	}

	debugBuffer() {
		var str = '';
		for (var i = 0; i < this.buffer.length; i++) {
			var hex = this.buffer.readUInt8(i).toString(16);
			// todo
		}
	}

}


module.exports = ParseError;