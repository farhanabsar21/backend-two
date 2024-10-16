import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import config from './config/default';
import publicChannel from './sockets/publicChannel';
import privateChannel from './sockets/privateChannel';
import { logger } from './utils/logger';

const server = http.createServer(app);
const io = new Server(server);

// Initialize public and private channels
publicChannel(io);
privateChannel(io);

server.listen(config.PORT, () => {
    logger('info', `Server listening on port ${config.PORT}`);
});
