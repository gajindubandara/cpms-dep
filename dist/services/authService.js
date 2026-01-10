import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { Unauthorized, BadRequest } from '../errors/customErrors.js';

export const decodeIdToken = (idToken) => {
    const decoded = jwt.decode(idToken);
    if (!decoded) {
        throw new BadRequest('Invalid ID token');
    }
    return decoded;
};