import { generators } from 'openid-client';
import { jwtVerify, createRemoteJWKSet } from 'jose';

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

// Login controller
const login = (client) => (req, res) => {
    const nonce = generators.nonce();
    const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = client.authorizationUrl({
        scope: 'email openid phone',
        state: state,
        nonce: nonce,
    });

    res.redirect(authUrl);
};

// Logout controller
const logout = (req, res) => {
    req.session.destroy();
    const logoutUrl = `https://ap-southeast-1a1gxbefeq.auth.ap-southeast-1.amazoncognito.com/logout?client_id=597emlaf5j454prkdg6g7ea15c&logout_uri=<logout uri>`;
    res.redirect(logoutUrl);
};

// Callback controller
const callback = (client) => async (req, res) => {
    try {
        // Get authorization code from request body
        const { code } = req.body;

        if (!code) {
            console.error('Authorization code is missing.');
            return res.status(400).json({ error: 'Authorization code is missing.' });
        }

        // Prepare token exchange request
        const authHeader = 'Basic ' + Buffer.from(
            `${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`
        ).toString('base64');

        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.COGNITO_CLIENT_ID,
            code: code,
            redirect_uri: process.env.COGNITO_REDIRECT_URI,
        });

        console.log('Token exchange request:', params.toString());

        // Exchange code for tokens
        const tokenResponse = await fetch(`${process.env.COGNITO_DOMAIN}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': authHeader,
            },
            body: params.toString(),
        });

        const tokenData = await tokenResponse.json();
        console.log('Token response:', tokenData);

        // Validate token response
        const requiredFields = ['id_token', 'access_token', 'refresh_token', 'expires_in', 'token_type'];
        const isValid = requiredFields.every(field => tokenData[field]);

        if (!isValid) {
            console.error('Invalid token response:', tokenData);
            return res.status(400).json({ 
                error: tokenData.error || 'Invalid token response',
                details: tokenData.error_description 
            });
        }

        // Get user info using access token
        const userInfo = await client.userinfo(tokenData.access_token);
        
        // Save tokens and user info in session
        req.session.tokens = {
            id_token: tokenData.id_token,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
            token_type: tokenData.token_type,
        };
        req.session.userInfo = userInfo;

        console.log('User logged in:', userInfo);
        
        // Return tokens to frontend
        res.status(200).json({
            tokens: req.session.tokens,
            userInfo: userInfo
        });
    } catch (err) {
        console.error('Callback error:', err);
        res.status(500).json({ 
            error: 'Authentication failed.',
            details: err.message 
        });
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

        console.log('Token verified:', verified.payload);

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
    login,
    logout,
    callback,
    verifyToken,
    refreshToken
};
