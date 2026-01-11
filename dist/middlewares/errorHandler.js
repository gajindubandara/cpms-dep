import { CustomErrors } from "../errors/customErrors.js";

export const errorHandler = (err, req, res, next) => {
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        'body' in err
    ) {
        return res.status(400).json({
            error: {
                code: 400,
                details: "Invalid JSON format in request body",
            },
        });
    }

    if (err instanceof CustomErrors) {
        return res.status(err.statusCode).json({
            error: {
                code: err.statusCode,
                details: err.message,
            }
        });
    }

    // Handle unexpected errors
    console.error("Unexpected Error:", err);
    return res.status(500).json({
        error: {
            code: 500,
            details: "Something went wrong, please try again later."
        }
    });
};
export default errorHandler;