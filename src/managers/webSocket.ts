/** @format */

import WebSocket, { WebSocketServer } from 'ws';
import { Packet } from './packet';
import { PacketDirection } from '../types/enum';

export class AkebiWebSocket {
	private static _wss: WebSocket.Server;
	static shareWss: WebSocket.Server;
	private static packetToSend: Packet[] = [];

	static get wss(): WebSocket.Server {
		return this._wss;
	}

	private static handleConnectReq() {
		return JSON.stringify({
			sessionStarted: true,
		});
	}

	static start() {
		this._wss = new WebSocketServer({
			port: 40510,
		});

		this._wss.on('connection', (ws) => {
			ws.on('message', (data) => {
				const parsedData = JSON.parse(data.toString());

				if (parsedData.cmd === 'ConnectReq') {
					ws.send(this.handleConnectReq());
					return;
				}
			});

			ws.send(
				JSON.stringify({
					cmd: 'PacketNotify',
					data: [
						{
							source: 0,
							packetID: 'HND',
							protoName: 'Handshake',
							object: 'Hello',
						},
					],
				}),
			);
		});
	}

	static addToQueue(packet: Packet) {
		this.packetToSend.push(packet);
	}

	static loop() {
		setInterval(() => {
			if (this.packetToSend.length > 0) {
				this.wss.clients.forEach((ws) => {
					ws.send(
						JSON.stringify({
							cmd: 'PacketNotify',
							data: this.packetToSend.map((packet) => {
								return {
									source: packet.direction === PacketDirection.RECEIVE ? 1 : 0,
									packetID: packet.cmdId,
									protoName: packet.packetName,
									object: packet.contentData,
									packet: packet.rawContentData.toString('base64')
								};
							}),
						}),
					);
				});

				this.packetToSend = [];
			}
		}, 500);
	}

	static send(data: any) {
		this.shareWss.clients.forEach((ws) => {
			ws.send(data);
		});
	}
}
