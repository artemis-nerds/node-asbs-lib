
# node-asbs-lib

The bastard child of [artemis-glitter](https://github.com/IvanSanchez/artemis-glitter) and [node-artemis](https://github.com/mrfishie/node-artemis), now in reusable library form.



**Heavy work in progress!! Some packets are not parsed yet, interface is not stable, lotsa stuff to do.**




The goal is to abstract the low-level details of the Artemis Space Bridge Simulator protocol, exposing a subclass of `net.Socket`, called `artemisSocket` (and `net.Server`, called `artemisServer`).

Ideally, splitting the network library will allow programs and scripts to switch the version of `node-asbs-lib` for newer versions of ArtemisSBS and still work seamlessly even when the protocol changes.

This does **not** implement a world model, socket reconnection, packet forwarding, or game logic. That is left for the code using this library.


## API


### `asbs-lib.Socket`

In addition to the `net` functionality, the `node-artemis-lib.Socket`s implement:

#### `constructor(options)`

In addition to the options available to `Net.Server`, an asbs Socket accepts `enum` and `bool`:

```js
var mySock = new asbs.Socket({
	host: 'localhost'	// from Net.Socket
	port: 2010,	// from Net.Socket
	bool: true,	// Cast all known boolean fields into boolean values
	enum: true	// Cast all known enumerated field into enums
});
```

Some developers prefer integer values to booleans (`0` or `1` instead of `true` and `false`), and some prefer integer values to enums (e.g. `0` to `3` instead of `homing`, `nuke`, `emp` and `mine`). Both options default to `true` for maximum prettifycation.

#### event: `packet`

Each time a known game packet is received (and parsed), this event is emmited. The callback should expect two parameters: `packetName` and `packetData`.

`packetName` is self-explaining. `packetData` is a plain javascript object, and its structure mimics the definition in the `packet-defs.js` file. `packetData`s may include arrays and plain objects inside, as per their definitions.

New developers are encouraged to run some of the examples to see how the event payloads look like.

#### `send()`

`send(str packetName, object packetData, bool fromServer)`

Kinda the inverse operation of the `packet` event. Given a packet name and payload, will pack it in a binary structure and send it down the wire.

Set `fromServer` to false if you are using `artemisSocket` to connect to a game server; this should be true only if you're implementing game server-like or proxy-like functionality.


#### event: `error`

An `node-artemis-lib.Socket` is a subclass of EventEmitter and, as such, instead of `throw`ing errors it emits `error` events.

Besides the errors from `net.Socket`, problems when parsing Artemis SBS packets will emit an `error` event with a `ParseError` as a parameter. As with `net.Socket`, this event will cause the socket to close.

#### event: `unparsed`

Similar to the `error` event, but used for recoverable errors that shouldn't cause the socket to close, like a packet length mismatch, body parse error, etc. A `ParseError` will be provided as a parameter.

### `asbs-lib.Server`

Works exactly as a `net.Server`, but the spawned sockets will behave as `asbs-lib.Socket` instead of plain `net.Socket`s.


## Examples

There are a few example scripts in the `examples/` directory. They are some of the simplest things that can be performed with the library, pretty small and commented.

Note that these examples do NOT handle socket reconnections and will fail if you don't have a game running in localhost.



## Legalese

Beerware license, see LICENSE file. 

Kudos to [Artemis Spaceship Bridge Simulator](http://www.artemis.eochu.com/), [ArtClientLib packet protocol](https://github.com/rjwut/ArtClientLib/wiki/Artemis-Packet-Protocol) and [node-artemis](https://github.com/mrfishie/node-artemis).


