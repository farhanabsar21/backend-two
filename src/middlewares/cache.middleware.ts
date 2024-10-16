import { Request, Response, NextFunction } from 'express';

// Cache control middleware
const cacheControl = (cacheType: 'public' | 'private', maxAge: number, additionalDirectives?: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        let cacheHeader = `${cacheType}, max-age=${maxAge}`;
        if (additionalDirectives) {
            cacheHeader += `, ${additionalDirectives}`;
        }

        // Set the Cache-Control header
        res.set('Cache-Control', cacheHeader);
        next();
    };
};

export default cacheControl;
