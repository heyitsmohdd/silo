import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to sanitize input against XSS attacks
 */

const sanitizeString = (str: string): string => {
  if (typeof str !== 'string') return str;

  return str
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
};

export const sanitizeQuery = (req: Request, _res: Response, next: NextFunction) => {
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key] as string);
      }
    }
  }
  next();
};
