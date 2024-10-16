import { Server, Socket } from 'socket.io';
import { ConnectedUsers } from '../@types/default';
import { logger } from '../utils/logger';

const connectedUsers: ConnectedUsers = {};

export default (io: Server): void => {
    io.on('connection', (socket: Socket) => {
        // Join private channel
        socket.on('join-private', (userId: string) => {
            connectedUsers[userId] = socket.id;
            socket.join('private');
            logger('info', `${socket.id} joined private channel`);
        });

        // Handle private messages
        socket.on('private-message', (msg: string, userId: string) => {
            const targetSocket = connectedUsers[userId];
            if (targetSocket) {
                io.to(targetSocket).emit('private-message', msg);
            } else {
                socket.emit('error', 'User not found');
            }
        });

        socket.on('disconnect', () => {
            logger('info', `User disconnected ${socket.id}`);
            // Clean up connected users when they disconnect
            Object.keys(connectedUsers).forEach((key) => {
                if (connectedUsers[key] === socket.id) {
                    delete connectedUsers[key];
                }
            });
        });
    });
};
