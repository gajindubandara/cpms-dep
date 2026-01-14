import { jwtVerify, createRemoteJWKSet } from 'jose';
import { BadRequest, InternalServerError, Unauthorized } from "../errors/customErrors.js";
import { requestCognitoToken } from "../helpers/RequestCognitoToken.js";
import * as authService from "../services/authService.js";

// Middleware to check authentication
const checkAuth = (req, res, next) => {
    if (!req.session) {
        req.session = {};
    }
    req.isAuthenticated = !!req.session.userInfo;
    next();
};

// Home controller
const renderHome = (req, res) => {
    res.render('home', {
        isAuthenticated: req.isAuthenticated,
        userInfo: req.session.userInfo || null
    });
};

// Logout controller
const logout = (req, res) => {
    req.session.destroy();
    const logoutUrl = `https://ap-southeast-1a1gxbefeq.auth.ap-southeast-1.amazoncognito.com/logout?client_id=597emlaf5j454prkdg6g7ea15c&logout_uri=<logout uri>`;
    res.redirect(logoutUrl);
};

// Callback controller
const callback = async (req, res, next) => {
     const code = req.query.code;

    if (!code) {
        return next(new BadRequest("Missing authorization code"));
    }

    try {
        const tokenData = await requestCognitoToken({
            grant_type: "authorization_code",
            client_id: process.env.COGNITO_CLIENT_ID,
            code,
            redirect_uri: process.env.COGNITO_REDIRECT_URI,
        });

        const userData = authService.decodeIdToken(tokenData.id_token);

        return res.json({
            name: userData.name,
            email: userData.email,
            image: userData.profile,
            role: userData["custom:role"],
            tokens: tokenData,
        });
    } catch (err) {
        console.error(err.response?.data || err.message);
        return next(new BadRequest(`Failed to fetch token: ${err.response?.data?.error || err.message}`));
    }
};

// VerifyToken function
const verifyToken = async (req, res) => {
    console.log('Received verify request:', JSON.stringify(req.headers, null, 2));

    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const parts = authHeader.trim().split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        return res.status(401).json({ 
            error: 'Invalid Authorization header format. Expected: Bearer <token>' 
        });
    }

    const token = parts[1];

    try {
        const jwks = createRemoteJWKSet(
            new URL(`https://cognito-idp.${process.env.AWS_REGION_NAME}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`)
        );

        const verified = await jwtVerify(token, jwks, {
            issuer: `https://cognito-idp.${process.env.AWS_REGION_NAME}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
        });

        if (verified.payload.client_id !== process.env.COGNITO_CLIENT_ID) {
            throw new Error('Client ID mismatch');
        }

        if (verified.payload.token_use !== 'access') {
            throw new Error('Expected access token');
        }


        return res.status(200).json(verified.payload);
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Refresh token controller
const refreshToken = async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token || typeof refresh_token !== 'string' || refresh_token.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid or missing refresh token.' });
    }

    try {
        const authHeader = 'Basic ' + Buffer.from(
            `${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`
        ).toString('base64');

        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.COGNITO_CLIENT_ID,
            refresh_token,
        });

        const tokenResponse = await fetch(`${process.env.COGNITO_DOMAIN}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': authHeader,
            },
            body: params.toString(),
        });

        const json = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Cognito token exchange failed:', json);
            return res.status(400).json({
                error: json.error || 'Token refresh failed',
                details: json.error_description || 'Bad request'
            });
        }

        const requiredFields = ['access_token', 'expires_in', 'token_type'];
        const valid = requiredFields.every((key) => json[key]);
        if (!valid) {
            return res.status(500).json({ error: 'Invalid token response from Cognito' });
        }

        return res.status(200).json(json);
    } catch (error) {
        console.error('Error during token refresh:', error);
        return res.status(500).json({
            error: 'Token refresh failed.',
            details: error.message,
        });
    }
};


export {
    checkAuth,
    renderHome,
    logout,
    callback,
    verifyToken,
    refreshToken
};
