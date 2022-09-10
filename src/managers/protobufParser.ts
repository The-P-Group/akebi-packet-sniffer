/** @format */

import protobufjs from 'protobufjs';
import path from 'path';

export class ProtobufParser {
	static parsePacketHeader(data: Buffer) {
		const root = protobufjs.loadSync(path.join(__dirname, '../../', 'data/proto/PacketHead.proto'));
		const tm = root.lookupType('PacketHead');

		return tm.decode(data);
	}

	static parsePacketData(data: Buffer, packetName: string) {
		const root = protobufjs.loadSync(path.join(__dirname, '../../', `data/proto/${packetName}.proto`));
		const tm = root.lookupType(packetName);

		return tm.decode(data);
	}
}
