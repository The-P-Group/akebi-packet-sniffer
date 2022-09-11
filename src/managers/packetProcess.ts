/** @format */
import { Packet } from './packet';
import { PacketDirection, PacketType } from '../types/enum';
import { AkebiWebSocket } from './webSocket';

export class PacketProcess {
	static process(data: Buffer) {
		try {
			const packet = new Packet(data);

			if (packet.packetType == PacketType.PACKET_DATA || packet.packetType == PacketType.MODIFY_DATA) {
				// console.log(packet.contentData);
				console.log(packet.direction === PacketDirection.SEND ? 'SEND: ' : 'RECV: ', packet.packetName);
				AkebiWebSocket.addToQueue(packet);
			}
		} catch (e: any) {
			console.error(e?.message);
		}
	}
}
