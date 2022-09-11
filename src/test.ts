/** @format */
import { PacketProcess } from './managers/packetProcess';
import { AkebiWebSocket } from './managers/webSocket';

// const rawPacket = '0100000079c16f26830100000001000000f800000000000000000022000000000000004803721e1a0f0df1392dc4159acb36431d76dfbe446a0515487ba34078a3f5d5fe02';
const rawPacket = '01000000f8ae6f2683010000000000000005000c0000000000000018af08280130f8ddbeb3b2303d000000000000000a3b40bf027236723450025807622e08ab848010121e0a0f0d4ccd24c4157a7161431d1c27b744120515e1cc6d421a002025320018c0ee7d20c8012801';
AkebiWebSocket.start();
AkebiWebSocket.loop();

PacketProcess.process(Buffer.from(rawPacket, 'hex'));
