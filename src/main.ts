/** @format */

import { NamedPipeServer } from './managers/namedPipeServer';
import { AkebiWebSocket } from './managers/webSocket';

const server = new NamedPipeServer();
server.start();

AkebiWebSocket.start();
AkebiWebSocket.loop();
