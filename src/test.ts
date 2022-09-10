/** @format */
import { PacketProcess } from './managers/packetProcess';

const rawPacket = '0100000079c16f26830100000001000000f800000000000000000022000000000000004803721e1a0f0df1392dc4159acb36431d76dfbe446a0515487ba34078a3f5d5fe02';

PacketProcess.process(Buffer.from(rawPacket, 'hex'));
