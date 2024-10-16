import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
    const { token } = req.body;
    if (token === 'valid-token') {
        next();
    } else {
        res.status(403).send('Unauthorized');
    }
};
