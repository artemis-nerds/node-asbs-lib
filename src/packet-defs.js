

// Options are the same as in datatypes:
//   options.enum = true (default) will cast enumerated types to/from their readable string value.
//   options.bool = true (default) will cast boolean types into Boolean (true/false instead of 0/1)
export function getPacketDefs(options) {

	var type = require('./data-types').getTypes(options);
	
	var packetDefsByName = {
		
		// Received when connecting to a game server
		version: {
			type: 0xe548e74a,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				unknown01: type.int32,
				unknown02: type.int32,
				major:   type.int32,
				minor:   type.int32,
				patch:   type.int32
			})
		},
		
		// Received when connecting to a game server
		welcome: {
			type: 0x6d04b3da,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				str: type.asciiString
			})
		},
		
		
		
		// Received when Science finishes a second scan, then at regular intervals
		intel: {
			type: 0xee665279,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				id: type.int32,
				unknown02: type.int8,
				msg: type.string
			})
		},
		
		
		
		
		// FIXME: The incomingAudio packet has conditional fields.
		// incomingAudio: {
		// }
		
		
		
		// Received at regular intervals, supposedly used for ping timeouts.
		heartbeat: {
			type: 0xf5821226,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({})
		},	
		
		
		
		
		// Sent from the game master console to the server
		gameMasterMessage: {
			type: 0x809305a7,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				// Destination:
				// 
				//   0: Comms channel (server generates commsIncoming packet)
				// For destinations 1-6, the game server generates a gameMessage packet.
				//   1: Main Screen
				//   2: Helm
				//   3: Weapons
				//   4: Engineering
				//   5: Science
				//   6: Comms console
				destination: type.int32,
				sender: type.string,		// Who sends the message (Only for comms channel)
				msg: type.string
			})
		},
		
		
		
		// Received when starting a game
		difficulty: {
			type: 0x3de66711,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				difficulty: type.int32,
				// Possible values for gameType are:
				//   0 - Siege
				//   1 - Single front
				//   2 - Double front
				//   3 - Deep Strike
				//   4 - Peacetime
				//   5 - Border War
				// Values are only meaningful for Solo and Coop games.
				gameType: type.gametype
			})
		},	
		
		
		
		
		// Received when an object is removed from play
		remove: {
			type: 0xcc5a3e30,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				type: type.entitytype,
				id: type.int32
			})
		},
		
		
		// Received when DamCon teams move around and repair things, or when
		//   system nodes are damaged.
		damConInfo: {
			type: 0x077e9f3c,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				unknown01: type.int8,
				nodes: type.byteboundarray(0xff,{
					x:      type.int8,
					y:      type.int8,
					z:      type.int8,
					damage: type.float
				}),
				teams: type.byteboundarray(0xfe,{
					teamId: type.int8,
					goalX: type.int32,
					goalY: type.int32,
					goalZ: type.int32,
					x: type.int32,
					y: type.int32,
					z: type.int32,
					progress: type.float,
					members: type.int32
				})
			})
		},
		
		
		
		
		// Received (usually during game start-up) when consoles are being taken by players
		consoles: {
			type: 0x19c6e2d4,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				playerShipIndex: type.int32,	// From 1 to 8
				mainScreen:     type.consolestatus,
				helm:           type.consolestatus,
				weapons:        type.consolestatus,
				engineering:    type.consolestatus,
				science:        type.consolestatus,
				communications: type.consolestatus,
				data:           type.consolestatus,
				observer:       type.consolestatus,
				captainsmap:    type.consolestatus,
				gameMaster:     type.consolestatus
			})
		},
		
		
		
		
		// Received at comms
		commsIncoming: {
			type: 0xd672c35f,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				// Possible values for "priority":
				// 0: We will surrender / We are invincible!
				// 1:
				// 2:
				// 3:
				// 4: We're under attack
				// 5: Docking crew ready
				// 6: We've produced another missile / status report
				// 7: Help us help you
				// 8: Will you surrender?!
				priority: type.int32,
				sender:   type.string,
				msg:      type.string
			})
		},
		
		
		
		
		
		// Sent by comms
// 		commsOutgoing: {
// 			type: 0xd672c35f,
// 			subtypeLength: 0,
// 			subtype: 0,
// 			fields: type.struct({
// 				targetType: type.commsTarget,
// 				targetId:   type.int32,
// 				command:    type.int32,	// See https://github.com/rjwut/ArtClientLib/wiki/Artemis-Packet-Protocol%3A-Enumerations
// 				commandId:  type.int32,
// 				unknown05:  type.int32
// 			})
// 		},
		
		
		
		
		
		// Received when a beam weapon has been fired
		// A beam shot has an ID like any other entities in the world model
		beamFired: {
			type: 0xb83fd2c4,
			subtypeLength: 0,
			subtype: 0,
			fields: type.struct({
				id:        type.int32,
				firedFromOwnShip: type.bool32,
				damage:    type.int32,
				beamPort:  type.int32,	// Usually 0 is starboard arc and 1 is portside arc
				unknown05: type.int32,	// Observed 4
				unknown06: type.int32,	// Observed 1 and 4
				sourceId:  type.int32,
				targetId:  type.int32,
				impactX:   type.float,
				impactY:   type.float,
				impactZ:   type.float,
				unknown12: type.int32
			})
		},
		
		
		
		
		
		//////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////
		//// Updates for WORLD MODEL entities follow.
		
		
		
		
		noUpdate: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x00,	//	0
			fields: type.struct({})
		},
			
		
		
		
		
		playerShip: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x01,	// 1
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(5,{
					weaponsTargetId: type.int32,   // 01
					impulseSpeed:    type.float,   // 02
					rudder:          type.float,   // 04   From -0.5 (left) to +0.5 (right)
					impulseSpeedMax: type.float,   // 08
					turnRateMax:     type.float,   // 10
					autoBeams:       type.bool8,   // 20
					warp:            type.int8,    // 40
					energy:          type.float,   // 80
					
					shieldState:     type.bool16,
					playerShipIndex: type.int32,
					shipType:        type.int32,
					posX:            type.float,
					posY:            type.float,
					posZ:            type.float,
					pitch:           type.float,
					roll:            type.float,
					
					heading:       type.float,	// In radians
					velocity:      type.float,
					unknown19:     type.int16,
					shipName:      type.string,
					forShields:    type.float,
					forShieldsMax: type.float,
					aftShields:    type.float,
					aftShieldsMax: type.float,
					
					dockingId:        type.int32,	// ID of the station being docked with
					redAlert:         type.bool8,
					unknown27:        type.float,
					mainScreen:       type.mainscreen8,	// What is being shown on the main screen
					beamFrequency:    type.beamfrequency8,
					coolantAvailable: type.int32,
					scienceTargetId:  type.int32,
					captainTargetId:  type.int32,
					
					driveType:        type.int16,
					scanningTargetId: type.int32,
					scanningProgress: type.float,
					diveRise:         type.float,	// 1 = rising, 0 = neutral, -1 = diving
					reverse:          type.int8,	// Has a weird -1 -ish value sometimes
					unknown38:        type.int8,
				//	unknown39:        type.null,	// Apparently this exists but is empty on a full mask
				//	unknown40:        type:int32
				})                       
			})
		},
		
		
		
		
		// Status of the torpedoes subsystem in the player ship.
		weapons: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x02,	// 2
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(3,{
					// tubeUsed is 0 if unloaded, 2 if loading, 1 if loaded, 3 if unloading.
					// 0 -> 2 -> 1 -> 3 -> 0 (unloading)
					// 0 -> 2 -> 1 -> 0 (firing)
					
					// Unknown11 seems to depend on the ship being piloted:
					//  41 (00101001) for scout
					//  94 (01011110) for light cruiser
					// 123 (01111011) for dreadnought
					// 232 (11101000) for missile cruiser
					//  95 (01011111) for battlecruiser
					storesHoming: type.int8,
					storesNukes:  type.int8,
					storesMines:  type.int8,
					storesEMPs:   type.int8,
					unknown05:    type.int8,
					unloadTime1:  type.float,
					unloadTime2:  type.float,
					unloadTime3:  type.float,
					unloadTime4:  type.float,

					unloadTime5:  type.float,
					unloadTime6:  type.float,
					tubeUsed1:    type.tubestatus,
					tubeUsed2:    type.tubestatus,
					tubeUsed3:    type.tubestatus,
					tubeUsed4:    type.tubestatus,
					tubeUsed5:    type.tubestatus,

					tubeUsed6:     type.tubestatus,
					tubeContents1: type.ordnance8,
					tubeContents2: type.ordnance8,
					tubeContents3: type.ordnance8,
					tubeContents4: type.ordnance8,
					tubeContents5: type.ordnance8,
					tubeContents6: type.ordnance8,
	// 				unknown23:     type.int8
									
					// Last byte of the bitmapstruct seems to be unused.
				})                       
			})
		},
		
		
		
		
		
		// Engineering status of the ship: coolant, power and heat levels.
		engineering: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x03,	// 3
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(4,{
					heatBeams:       type.float,
					heatTorpedoes:   type.float,
					heatSensors:     type.float,
					heatManeuver:    type.float,
					heatImpulse:     type.float,
					heatWarp:        type.float,
					heatForShields:  type.float,
					heatAftShields:  type.float,
					
					energyBeams:      type.float,
					energyTorpedoes:  type.float,
					energySensors:    type.float,
					energyManeuver:   type.float,
					energyImpulse:    type.float,
					energyWarp:       type.float,
					energyForShields: type.float,
					energyAftShields: type.float,
					
					coolantBeams:      type.int8,
					coolantTorpedoes:  type.int8,
					coolantSensors:    type.int8,
					coolantManeuver:   type.int8,
					coolantImpulse:    type.int8,
					coolantWarp:       type.int8,
					coolantForShields: type.int8,
					coolantAftShields: type.int8
					
					// Last byte of the bitmapstruct seems to be unused.
				})                       
			})
		},
		
		
		
		
		
		
		
		// Upgrades status of the ship: which upgrades are aavailable.
		
		// This is all guesswork, I haven't seen any changing values in this packet.
		
		// The game UI displays 28 possible upgrades.
		// There is a 7-byte bitmask with 56 bits (28*2). 
		// Then there is a 4-byte word with 28 (out of 32) bits set to 1. Maybe upgrades possible for this ship?
		// Then, there are 28 4-byte words, all zeroed out. Are these one 4-byte or 2 2-bytes data fields per upgrade?
		// How does this map to the bitmap??
		upgrades: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x04,	// 4
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(7,{
					mask:      type.int32,
					unknown02: type.int32,
					unknown03: type.int32,
					unknown04: type.int32,
					unknown05: type.int32,
					unknown06: type.int32,
					unknown07: type.int32,
					unknown08: type.int32,
					
					unknown09: type.int32,
					unknown10: type.int32,
					unknown11: type.int32,
					unknown12: type.int32,
					unknown13: type.int32,
					unknown14: type.int32,
					unknown15: type.int32,
					unknown16: type.int32,
					
					unknown17: type.int32,
					unknown18: type.int32,
					unknown19: type.int32,
					unknown20: type.int32,
					unknown21: type.int32,
					unknown22: type.int32,
					unknown23: type.int32,
					unknown24: type.int32,
					
					unknown25: type.int32,
					unknown26: type.int32,
					unknown27: type.int32,
					unknown28: type.int32,
					unknown29: type.int32
	// 				unknown30: type.int32,
	// 				unknown31: type.int32,
	// 				unknown31: type.int32
				})                       
			})
		},
		
		
		
		
		// NPC ships
		// Elite abilitiesas follows:
		//     0x0001: Stealth
		//     0x0002: LowVis
		//     0x0004: Cloak
		//     0x0008: HET
		//     0x0010: Warp
		//     0x0020: Teleport
		//     0x0040: Tractor
		//     0x0080: Drones
		//     0x0100: Anti-Mine
		//     0x0200: Anti-Torp
		//     0x0400: Shield Drain

		npc: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x05,	// 5
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(6,{
					shipName:    type.string,
					unknown02:   type.float,
					rudder:      type.float,
					impulseMax:  type.int32,
					turnRateMax: type.int32,
					isEnemy:     type.bool32,
					shipType:    type.int32,
					posX:        type.float,
					
					posY:        type.float,
					posZ:        type.float,
					pitch:       type.float,
					roll:        type.float,
					heading:     type.float,
					velocity:    type.float,
					surrendered: type.bool8,
					unknown16:   type.int16,	// Maybe surrender chance
					
					forShields:      type.float,
					forShieldsMax:   type.float,
					aftShields:      type.float,
					aftShieldsMax:   type.float,
					unknown21:       type.int16,	// Maybe shieldsActive
					unknown22:       type.int8, 	// Maybe triggersMines
					eliteBits:       type.int32,
					eliteBitsActive: type.int32,
					
					scanned:   type.int32,
					faction:   type.int32,
					unknown27: type.int32,
					unknown28: type.int8,
					unknown29: type.int8,
					unknown30: type.int8,
					unknown31: type.int8,
					unknown32: type.float,	// Observed -10000
	
					unknown33:       type.int32,
					unknown34:       type.int32,
					damageBeams:     type.float,
					damageTorpedoes: type.float,
					damageSensors:   type.float,
					damageManeuver:  type.float,
					damageImpulse:   type.float,
					damageWarp:      type.float,

					damageForShield: type.float,
					damageAftShield: type.float,
					shieldFreqA:     type.float,
					shieldFreqB:     type.float,
					shieldFreqC:     type.float,
					shieldFreqD:     type.float,
					shieldFreqE:     type.float
				})                       
			})
		},
		
		
		
		// Space stations
		station: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x06,	// 6
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(2,{
					shipName:   type.string,
					forShields: type.float,
					aftShields: type.float,
					unknown04:  type.int32,	// Looks like an incremental 0-based station ID
					shipType:   type.int32,
					posX:       type.float,
					posY:       type.float,
					posZ:       type.float,
					
					unknown09: type.int32,
					unknown10: type.int32,
					unknown11: type.int32,
					unknown12: type.int32,
					unknown13: type.int8,
					unknown14: type.int8,
					unknown15: type.int16,
					//unknown16: type.int16
				})                       
			})
		},
		
		
		
		
		
		mine: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x07,	// 7
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(1,{
					posX:      type.float,
					posY:      type.float,
					posZ:      type.float,
					shipName:  type.string,
					unknown05: type.int32,
					unknown06: type.int32,
					unknown07: type.int32,
					unknown08: type.int32
				})                       
			})
		},
		
		

		
		anomaly: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x08,	// 8
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(1,{
					posX:      type.float,
					posY:      type.float,
					posZ:      type.float,
					shipName:  type.string,
					unknown05: type.int32,
					unknown06: type.int32,
					unknown07: type.int32,
					unknown08: type.int32
				})                       
			})
		},
			
		
		//// FIXME: Add subtype 0x09
		
		nebula: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x0a,	// 10
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(1,{
					posX: type.float,
					posY: type.float,
					posZ: type.float,
					colorR: type.float,
					colorG: type.float,
					colorB: type.float
				})
			})
		},
		
		
		
		torpedo: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x0b,	// 11
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(2,{
					posX:         type.float,
					posY:         type.float,
					posZ:         type.float,
					speedX:       type.int32,
					speedY:       type.int32,
					speedZ:       type.int32,
					ordnance:     type.ordnance32,
					unknown08:    type.int32
				})                       
			})
		},
		
		
		
		
		blackHole: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x0c,	// 12
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(1,{
					posX:      type.float,
					posY:      type.float,
					posZ:      type.float,
					shipName:  type.string,
					unknown05: type.int32,
					unknown06: type.int32,
					unknown07: type.int32,
					unknown08: type.int32
				})                       
			})
		},
			
		
		
		
		asteroid: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x0d,	// 13
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(1,{
					posX:      type.float,
					posY:      type.float,
					posZ:      type.float,
					shipName:  type.string,
					unknown05: type.int32,
					unknown06: type.int32,
					unknown07: type.int32,
					unknown08: type.int32
				})                       
			})
		},
		
		
		//// FIXME: Add subtype 0x0e, presumably generic mesh.
		//// Sample packet type+subtype+payload:
		//// fe c8 54 f7 0e 00 00 00 00 00 00 00 94 bb 10 3e

		monster: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x0f,	// 15
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(1,{
					posX:      type.float,
					posY:      type.float,
					posZ:      type.float,
					shipName:  type.string,
					unknown05: type.int32,
					unknown06: type.int32,
					unknown07: type.int32,
					unknown08: type.int32
				})                       
			})
		},
		
		

		
		whale: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x10,	// 16
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(2,{
					shipName:  type.string,
					unknown02: type.int32,
					unknown03: type.int32,
					posX:      type.float,
					posY:      type.float,
					posZ:      type.float,
					pitch:     type.float,
					roll:      type.int32,
					
					heading:   type.float,
					unknown09: type.float,
					unknown10: type.float,
					unknown11: type.float,	// Observed from 0 to 0.855
					unknown12: type.float,	// Observed from 0.5 to 1.36
				})                       
			})
		},
		
			
		
		
		
		drone: {
			type: 0x80803df9,
			subtypeLength: 1,
			subtype: 0x11,	// 17
			fields: type.struct({
				id: type.int32,
				data: type.bitmapstruct(2,{
					damage:    type.int32,
					posX:      type.float,
					unknown03: type.float,	// Maybe speedX?
					posY:      type.float,
					unknown05: type.float,	// Maybe speedY?
					posZ:      type.float,
					unknown07: type.float,	// Maybe speedZ?
					unknown08: type.int32,	// Possibly a flag bitmap?
					
					unknown09: type.float
				})                       
			})
		},
		
		
		
		
		
		
		
		
		/////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////
		// Game-related messages
		
		
		
		// Related to deleting entities from the worldmodel
		unknownGamePacket00: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x00,	// 0
			fields: type.struct({
				unknown01: type.int32,
				unknown02: type.int32
			})
		},
		
		
		unknownGamePacket01: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x01,	// 1
			fields: type.struct({})
		},
		
		
		soundEffect: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x03,	// 3
			fields: type.struct({
				filename: type.string
			})
		},
		
		
		togglePause: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x04,	// 4
			fields: type.struct({
				paused: type.int32
			})
		},
		
		
		// Sent from the server to make screens flicker just after the player
		//   ship has been hit.
		damageShake: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x05,	// 5
			fields: type.struct({
				unknown01: type.int32,
				duration:  type.float
			})
		},
		
		
		gameReset: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x06,	// 6
			fields: type.struct({})
		},
		

		
		// Enemy vessels using special abilities or jumping will trigger a flash, only shown
		//   in the main screen.
		cloakFlash: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x07,	// 7
			fields: type.struct({
				posX: type.float,
				posY: type.float,
				posZ: type.float
			})
		},
		

		unknownGamePacket08: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x08,	// 8
			fields: type.struct({
				unknown: type.int32
			})
		},
		
		
		skybox: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x09,	// 9
			fields: type.struct({
				skyboxID: type.int32
			})
		},
		
		
		
		// Messages sent from the server that will appear in the lower left corner
		//   of the main screen.
		gameMessage: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x0a,	// 10
			fields: type.struct({
				msg: type.string
			})
		},
		
		
		
		
		jumpStart: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x0c,	// 12
			fields: type.struct({})
		},
		
		
		
		
		jumpComplete: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x0d,	// 13
			fields: type.struct({})
		},
		
		
		
		
		
		allPlayerShipsSettings: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x0f,	// 15
			fields: type.staticsizearray(8,{
				driveType: type.int32,
				shipType:  type.int32,
				unknown03: type.int32,
				name:      type.string
			})
		},
		
		
		// DMX messages are only received in main screens of ships other than the first one.
		dmx: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x10,	// 16
			fields: type.struct({
				str: type.string,
				on:  type.int32
			})
		},
		
			
		keyCapture: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x11,	// 17
			fields: type.struct({
				capture: type.bool8
			})
		},


		setPerspective: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x12,	// 18
			fields: type.struct({
				perspective: type.perspective
			})
		},
		
		
		
		gameOverReason: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x14,	// 20
			fields: type.struct({
				title:  type.string,
				reason: type.string
			})
		},
		
		
		gameOverStats: {
			type: 0xf754c8fe,
			subtypeLength: 4,
			subtype: 0x15,	// 21
			fields: type.struct({
				column: type.int8,
				stats:  type.byteboundarray(0xce,{
					unknown01: type.int8,
					count: type.int32,
					label: type.string
				})
			})
		},
		
		

		
		/////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////
		// Client messages, part 1
		
		setWarp: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x00,	// 0
			fields: type.struct({
				warpFactor: type.int32	// From 0 to 4.
			})
		},
		
		
		//     0x00: fore
		//     0x01: port
		//     0x02: starboard
		//     0x03: aft
		//     0x04: tactical
		//     0x05: long range
		//     0x06: status
		setMainScreen: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x01,	// 1
			fields: type.struct({
				view: type.mainscreen32	// From 0 to 6.
			})
		},
		
		
		setWeaponsTarget: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x02,	// 2
			fields: type.struct({
				id: type.int32	// Object ID, or "1" if there is no target.
			})
		},
		
		
		toggleAutoBeams: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x03,	// 3
			fields: type.struct({
				unknown01: type.int32	// 0???
			})
		},
		
		
		toggleShields: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x04,	// 4
			fields: type.struct({
				unknown01: type.int32	// 0???
			})
		},
		
		
		/// FIXME: Is there no action for 0x05 nor 0x06?
		
		
		requestDock: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x07,	// 7
			fields: type.struct({
				unknown01: type.int32	// 0???
			})
		},
		
		
		// Fire a torpedo tube
		fireTube: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x08,	// 8
			fields: type.struct({
				tube: type.int32	// From 0 to 5, depending on ship being piloted
			})
		},
		
		
		// Unload a torpedo tube
		unloadTube: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x09,	// 9
			fields: type.struct({
				tube: type.int32	// From 0 to 5, depending on ship being piloted
			})
		},
		
		
		toggleRedAlert: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x0a,  // 10
			fields: type.struct({
				unknown01: type.int32	// 0???
			})
		},
		
		
		setBeamFrequency: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x0b,	// 11
			fields: type.struct({
				frequency: type.beamfrequency32	// From 0 to 4 = Alpha to Echo
			})
		},
		
		
		// Sets the damage control teams to autonomous or fully controlled.
		setAutoDamCon: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x0c,	// 12
			fields: type.struct({
				auto: type.bool32	// 0 = manual; 1 = autonomous
			})
		},
		
		
		// Used during game setup: which ship this console belongs to
		setPlayerShipIndex: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x0d,	// 13
			fields: type.struct({
				playerShipIndex: type.int32	// From 0 to 7. *Not* from 1 to 8!!!
			})
		},
		
		
		// Used during game setup: which console(s) shall we behave as
		setConsole: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x0e,	// 14
			fields: type.struct({
				console:   type.consoles,
// 				selected:  type.bool32	// 0 = no, 1 = yes
				selected:  type.int32	// 0 = no, 1 = yes
			})
		},
		
		
		// Used during game setup: Are we ready to play?
		setReady: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x0f,	// 15
			fields: type.struct({
				unknown01:  type.int32	// 0???
			})
		},

		
		setScienceTarget: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x10,	// 16
			fields: type.struct({
				id:  type.int32	// Object ID, or "1" if there is no target.
			})
		},

		
		setCaptainTarget: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x11,	// 17
			fields: type.struct({
				id:  type.int32	// Object ID, or "1" if there is no target.
			})
		},
		
		
		setGameMasterTarget: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x12,	// 18
			fields: type.struct({
				id:  type.int32	// Object ID, or "1" if there is no target.
			})
		},
		
		
		// Starts scanning an entity given the ID - apparently doesn't need
		//   to target it first?!
		setScienceScan: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x13,	// 19
			fields: type.struct({
				id:  type.int32	// Object ID
			})
		},
		

		// Sends a keystroke to the server - only useful if keyStroke capture
		//   is set, and only for scripted missions.
		sendKeyStroke: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x14,	// 20
			fields: type.struct({
				// See http://msdn.microsoft.com/en-us/library/aa243025.aspx
				keyCode:  type.int32	// Object ID
			})
		},
		
		/// FIXME: Is there no action for 0x15?

		// Used only during game setup, from helm.
		setShipSettings: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x16,	// 22
			fields: type.struct({
				playerDriveType: type.drive,	// 0 = warp, 1 = jump
				playerShipType:  type.int32,	// From 0 to 4, matching vesselData.xml
				unknown03:       type.int32,	// 1???
				shipName:        type.string
			})
		},
		
		/// FIXME: Is there no action for 0x17?
		
		
		toggleReverseImpulse: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x18,	// 24
			fields: type.struct({
				unknown01: type.int32	// 0???
			})
		},
		
		
		//// FIXME: Don't really know what this packet means.
		setReady2: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x19,	// 25
			fields: type.struct({
				unknown01: type.int32	// 0???
			})
		},
		
		
		// Toggles first- and third-person view in the main screen.
		togglePerspective: {
			type: 0x4c821d3c,
			subtypeLength: 4,
			subtype: 0x1a,	// 26
			fields: type.struct({
				unknown01: type.int32	// 0???
			})
		},
		
		
		/////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////
		// Client messages, parts 2 & 3
		
		
		// Sets the amount of coolant allocated for a ship system. Systems are:
		//     0x00: beams
		//     0x01: torpedoes
		//     0x02: sensors
		//     0x03: maneuvering
		//     0x04: impulse
		//     0x05: warp/jump drive
		//     0x06: fore shields
		//     0x07: aft shields
		setCoolant: {
			type: 0x69cc01d9,
			subtypeLength: 4,
			subtype: 0x00,	// 0
			fields: type.struct({
				system: type.shipsystem,
				amount: type.int32,	// From 0 to 8
				unknown03: type.int32,	// 0???
				unknown04: type.int32,	// 0???
			})
		},
		
		/// FIXME: Is there no action for 0x01?
		
		loadTube: {
			type: 0x69cc01d9,
			subtypeLength: 4,
			subtype: 0x02,	// 2
			fields: type.struct({
				tube: type.int32,	// From 0 to 5, depending on ship being piloted
				ordnance: type.ordnance32,
				unknown03: type.int32,	// 0???
				unknown04: type.int32,	// 0???
			})
		},
		
		
		convertTorpedo: {
			type: 0x69cc01d9,
			subtypeLength: 4,
			subtype: 0x03,	// 3
			fields: type.struct({
				direction: type.int32,	// 0.0 (torp to energy) or 1.0 (energy to torp)
				unknown02: type.int32,	// 0???
				unknown03: type.int32,	// 0???
				unknown04: type.int32,	// 0???
			})
		},
		
		
		// Tell a DamCon team to go somewhere on the ship
		// See DamConInfo packet
		sendDamConTeam: {
			type: 0x69cc01d9,
			subtypeLength: 4,
			subtype: 0x04,	// 4
			fields: type.struct({
				team: type.int32,	// Which team, from 0 to 2
				x: type.int32,
				y: type.int32,
				z: type.int32,
			})
		},
		
		
		setImpulse: {
			type: 0x0351a5ac,
			subtypeLength: 4,
			subtype: 0x00,	// 0
			fields: type.struct({
				throttle: type.float	// From 0.0 to 1.0
			})
		},
		
		
		setRudder: {
			type: 0x0351a5ac,
			subtypeLength: 4,
			subtype: 0x01,	// 1
			fields: type.struct({
				rudder: type.float	// From 0.0 (hard port) through 0.5 (straight) to 1.0 (hard stbd)
			})
		},
		
		/// FIXME: Is there no action for 0x02 nor 0x03?

		// Giving her all she's got, capt'n!
		setEngineeringEnergy: {
			type: 0x0351a5ac,
			subtypeLength: 4,
			subtype: 0x04,	// 4
			fields: type.struct({
				value: type.float,	// From 0.0 to 1.0; 100% is 0.333
				system: type.shipsystem	// As per setCoolant
			})
		},
		
		
		initiateJump: {
			type: 0x0351a5ac,
			subtypeLength: 4,
			subtype: 0x05,	// 5
			fields: type.struct({
				bearing: type.float,	// From 0.0 to 1.0. (Bearing from 0 to 360 divided by 360)
				distance: type.float	// From 0.0 to 1.0. (1.0 means 50K units)
			})
		},



		// Used by the weapons console when firing in manual mode.
		fireBeam: {
			type: 0xc2bee72e,
			subtypeLength: 0,
			subtype: 0x00,
			fields: type.struct({
				target: type.int32,	// ID of the entity being fired at
				impactX: type.float,
				impactY: type.float,
				impactZ: type.float
			})
		},
	};









	// Redo the table, with the int32 types pointing to a structure holding
	//   the subtype lenght and refs to the packet defs.
	// This way we can access packet defs by their int32 type + subtype.

	var packetDefsByType = {};

	for (var name in packetDefsByName) {
		
		var type    = packetDefsByName[name].type;
		var subtype = packetDefsByName[name].subtype;
		var fields  = packetDefsByName[name].fields;
		
		if (!packetDefsByType.hasOwnProperty( type )) {
			packetDefsByType[type] = {
				subtypeLength: packetDefsByName[name].subtypeLength
			}
		}
		
		packetDefsByType[type][subtype] = {name: name, fields: fields};
		
	}

	// console.log(packetDefsByType);



	return {
		packetDefsByType: packetDefsByType,
		packetDefsByName: packetDefsByName
	};

}