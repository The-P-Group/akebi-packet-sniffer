/** @format */
import { PacketDirection, PacketType } from '../types/enum';

export class Packet {
	private _rawPacketContent: Buffer;
	private _packetType: PacketType = 0;
	private _timestamp: string = '';
	private _manipulationEnabled: boolean = false;
	private _direction: PacketDirection = 0;
	private _cmdId: number = 0;
	private _headerData: Buffer | undefined;
	private _contentData: Buffer = Buffer.alloc(0);

	constructor(data: Buffer) {
		this._rawPacketContent = data;

		this.parsePacket();
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

	get headerData(): Buffer | undefined {
		return this._headerData;
	}

	get contentData(): Buffer {
		return this._contentData;
	}

	private parsePacket() {
		this._packetType = this._rawPacketContent.readUInt32LE(); // 4 bytes

		this._timestamp = this._rawPacketContent.readBigUint64LE(4).toString(); // 8 bytes

		this._manipulationEnabled = Boolean(this._rawPacketContent.readInt8(12)); // 1 bytes | 4 + 8

		this._direction = this._rawPacketContent.readUint32LE(13); // 4 bytes | 4 + 8 + 1

		this._cmdId = this._rawPacketContent.readUInt16LE(17); // 2 bytes | 4 + 8 + 1 + 4

		// Kinda hack. But I swear it will never over int
		const headerLength = parseInt(this._rawPacketContent.readBigUInt64LE(19).toString()) || 0; // 8 byte | 4 + 8 + 1 + 4 + 2

		if (headerLength > 0) {
			this._headerData = this._rawPacketContent.subarray(27, 27 + headerLength); // Length depend on previous value | 4 + 8 + 1 + 4 + 2 + 8;
		}

		console.log('LENGTH', 27 + headerLength);
		console.log(this._rawPacketContent.toString('hex'))
		const contentLength = parseInt(this._rawPacketContent.readBigUInt64LE(27 + headerLength).toString());

		this._contentData = this._rawPacketContent.subarray(35 + headerLength, 35 + headerLength + contentLength); // 27 + 8 + header length
	}
}
