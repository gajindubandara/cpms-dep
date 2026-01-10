import axios from "axios";
import qs from "qs";

export async function requestCognitoToken(params) {
    const authHeader =
        "Basic " +
        Buffer.from(`${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`).toString("base64");

    const data = qs.stringify(params);

    const response = await axios.post(`${process.env.COGNITO_DOMAIN}/oauth2/token`, data, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: authHeader,
        },
    });

    return response.data;
}