import jwt from 'jsonwebtoken';
import { BadRequest } from '../errors/customErrors.js';

export const decodeIdToken = (idToken) => {
    const decoded = jwt.decode(idToken);
    if (!decoded) {
        throw new BadRequest('Invalid ID token');
    }
    return decoded;
};