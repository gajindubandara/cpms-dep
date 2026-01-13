import { createRemoteJWKSet, jwtVerify } from "jose";

//middleware to
export const verifyAccessToken = async (req, res, next) => {
  try {
    //get the token
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    //check bearer token
    const parts = authHeader.trim().split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res.status(401).json({
        error: "Invalid Authorization header format. Expected: Bearer <token>",
      });
    }
    const token = parts[1];

    const jwks = createRemoteJWKSet(
      new URL(
        `https://cognito-idp.${process.env.AWS_REGION_NAME}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
      )
    );

    //verify token
    const verified = await jwtVerify(token, jwks, {
      issuer: `https://cognito-idp.${process.env.AWS_REGION_NAME}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
    });

    //check whether it is an access token
    if (verified.payload.token_use !== "access") {
      return res.status(401).json({ error: "Invalid token type" });
    }

    //check token is for my client
    if (verified.payload.client_id !== process.env.COGNITO_CLIENT_ID) {
      return res.status(401).json({ error: "Client id mismatch" });
    }

    //userinfo to request
    req.user = verified.payload;

    next();
  } catch (error) {
    console.error("Token verification failed", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};