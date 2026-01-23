/**
 * Extended Express Request with Batch Context
 */

import { Request } from 'express';
import { JWTPayload } from './auth.types.js';

export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
    context?: {
        year: number;
        branch: string;
    };
}
