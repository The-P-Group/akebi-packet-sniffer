/** @format */
import { Packet } from './packet';
import { PacketType } from '../types/enum';
import { AkebiWebSocket } from './webSocket';

export class PacketProcess {
	static process(data: Buffer) {
		try {
			const packet = new Packet(data);

			if (packet.packetType == PacketType.PACKET_DATA || packet.packetType == PacketType.MODIFY_DATA) {
				// console.log(packet.contentData);
				console.log('RECEIVE: ', packet.packetName);
				AkebiWebSocket.addToQueue(packet);
			}
		} catch (e) {
			// console.error(e);
		}
	}
}
