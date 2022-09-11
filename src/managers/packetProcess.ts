/** @format */
import { Packet } from './packet';
import { PacketDirection, PacketType } from '../types/enum';
import { AkebiWebSocket } from './webSocket';
import config from '../constants/config.json';
import chalk from 'chalk';

export class PacketProcess {
	static process(data: Buffer) {
		try {
			const packet = new Packet(data);

			if (packet.packetType === PacketType.PACKET_DATA || packet.packetType === PacketType.MODIFY_DATA) {
				if (!config.ignorePacket.includes(packet.packetName)) {
					console.log(packet.direction === PacketDirection.SEND ? chalk.yellow('SEND: ' + packet.packetName) : chalk.magenta('RECV: ' + packet.packetName));
					AkebiWebSocket.addToQueue(packet);
				}
			}
		} catch (e: any) {
			console.error(e?.message);
		}
	}
}
