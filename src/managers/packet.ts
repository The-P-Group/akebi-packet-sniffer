/** @format */
import { PacketDirection, PacketType } from '../types/enum';

// @ts-ignore
import pIds from '../../data/cmdId.json';
import { ProtobufParser } from './protobufParser';

const packetIds = pIds as { [packetIds: string]: number };

const switchedPacketIds = (function () {
	const obj: { [key: string]: any } = {};

	Object.keys(pIds).forEach((name) => {
		obj[packetIds[name]] = name;
	});

	return obj;
})();

export class Packet {
	private _rawPacketContent: Buffer;
	private _packetType: PacketType = 0;
	private _timestamp: string = '';
	private _manipulationEnabled: boolean = false;
	private _direction: PacketDirection = 0;
	private _cmdId: number = 0;
	private _packetName: string = '';
	private _rawHeaderData: Buffer | undefined;
	private _rawContentData: Buffer = Buffer.alloc(0);
	private _headerData: Record<string, any> = {};
	private _contentData: Record<string, any> = {};

	constructor(data: Buffer) {
		this._rawPacketContent = data;

		this.parsePacket();
	}

	static getPacketNameFromCmdId(id: number) {
		return switchedPacketIds[id];
	}

	get packetType(): PacketType {
		return this._packetType;
	}

	get timestamp(): string {
		return this._timestamp;
	}

	get manipulationEnabled(): boolean {
		return this._manipulationEnabled;
	}

	get direction(): PacketDirection {
		return this._direction;
	}

	get cmdId(): number {
		return this._cmdId;
	}

	get rawHeaderData(): Buffer | undefined {
		return this._rawHeaderData;
	}

	get rawContentData(): Buffer {
		return this._rawContentData;
	}

	get packetName(): string {
		return this._packetName;
	}

	get headerData(): Record<string, any> {
		return this._headerData;
	}

	get contentData(): Record<string, any> {
		return this._contentData;
	}

	private parsePacket() {
		this._packetType = this._rawPacketContent.readUInt32LE(); // 4 bytes

		if (this._packetType == PacketType.PACKET_DATA || this._packetType != PacketType.MODIFY_DATA) {
			this._timestamp = this._rawPacketContent.readBigUint64LE(4).toString(); // 8 bytes

			this._manipulationEnabled = Boolean(this._rawPacketContent.readInt8(12)); // 1 bytes | 4 + 8

			this._direction = this._rawPacketContent.readUint32LE(13); // 4 bytes | 4 + 8 + 1

			this._cmdId = this._rawPacketContent.readUInt16LE(17); // 2 bytes | 4 + 8 + 1 + 4

			// Kinda hack. But I swear it will never over int
			const headerLength = parseInt(this._rawPacketContent.readBigUInt64LE(19).toString()) || 0; // 8 byte | 4 + 8 + 1 + 4 + 2

			if (headerLength > 0) {
				this._rawHeaderData = this._rawPacketContent.subarray(27, 27 + headerLength); // Length depend on previous value | 4 + 8 + 1 + 4 + 2 + 8;

				this._headerData = ProtobufParser.parsePacketHeader(this._rawHeaderData);
			}

			// console.log('LENGTH', 27 + headerLength);
			// console.log(this._rawPacketContent.toString('hex'));
			const contentLength = parseInt(this._rawPacketContent.readBigUInt64LE(27 + headerLength).toString());

			this._rawContentData = this._rawPacketContent.subarray(35 + headerLength, 35 + headerLength + contentLength); // 27 + 8 + header length

			this._packetName = Packet.getPacketNameFromCmdId(this._cmdId);

			this._contentData = ProtobufParser.parsePacketData(this._rawContentData, this._packetName);
		}
	}
}
