/** @format */

import { createServer, Server, Socket } from 'net';
import { PacketProcess } from './packetProcess';

export class NamedPipeServer {
	private server: Server;
	private readonly pipeName: string;

	constructor(pipeName = 'genshin_packet_pipe') {
		this.server = createServer(this.listener);
		this.pipeName = pipeName;
	}

	private namedPipeBuilder() {
		const PIPE_PATH = '\\\\.\\pipe\\';
		return PIPE_PATH + this.pipeName;
	}

	private listener(stream: Socket) {
		console.log('Connected');

		stream.on('data', (c: Buffer) => {
			// console.log('Server: on data:', c.toString('hex'));
			PacketProcess.process(c);
		});
	}

	start() {
		this.server.on('close', function () {
			console.log('Server: on close');
		});

		this.server.listen(this.namedPipeBuilder(), function () {
			console.log('Server: on listening');
		});
	}
}
