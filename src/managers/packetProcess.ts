/** @format */
import { Packet } from './packet';
import { PacketType } from '../types/enum';

export class PacketProcess {
	static process(data: Buffer) {
		try {
			const packet = new Packet(data);

			if (packet.packetType == PacketType.PACKET_DATA || packet.packetType == PacketType.MODIFY_DATA) {
				console.log(packet.contentData);
			}
		} catch (e) {
			// console.error(e);
		}
	}
}
