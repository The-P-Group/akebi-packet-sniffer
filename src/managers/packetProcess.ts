/** @format */
import {Packet} from "./packet";

export class PacketProcess {
	static process(data: Buffer) {
		const packet = new Packet(data)

		console.log(packet.cmdId)
	}
}
