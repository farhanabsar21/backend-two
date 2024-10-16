import { Request, Response } from 'express';

export const sendPublicMessage = (req: Request, res: Response): void => {
    const { message } = req.body;
    if (!message) {
        res.status(400).send('Message is required');
        return;
    }

    // Emit the public message to the WebSocket channel
    req.app.get('io')?.to('public').emit('public-message', message);
    res.send('Message sent to public channel');
};

export const sendPrivateMessage = (req: Request, res: Response): void => {
    const { message, userId } = req.body;
    const connectedUsers = req.app.get('connectedUsers');

    const targetSocket = connectedUsers?.[userId];
    if (targetSocket) {
        req.app.get('io')?.to(targetSocket).emit('private-message', message);
        res.send('Private message sent');
    } else {
        res.status(404).send('User not found');
    }
};
