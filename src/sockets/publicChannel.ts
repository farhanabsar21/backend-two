import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

export default (io: Server): void => {
    io.on('connection', (socket: Socket) => {
        logger('info', `User connected ${socket.id}`);

        // Join public channel
        socket.on('join-public', () => {
            socket.join('public');
            logger('info', `${socket.id} joined public channel`);
        });

        // Handle public messages
        socket.on('public-message', (msg: string) => {
            logger('info', `User ${socket.id} sent: ${msg}`);
            io.to('public').emit('public-message', msg);
        });

        socket.on('disconnect', () => {
            logger('info', `User disconnected ${socket.id}`);
        });
    });
};
