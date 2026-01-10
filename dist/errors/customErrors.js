class CustomErrors extends Error {
    constructor(message, statusCode, type = "Error") {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class NotFoundError extends CustomErrors {
    constructor(message = "Resource not found") {
        super(message, 404, "NotFoundError");
    }
}

class BadRequest extends CustomErrors {
    constructor(message = "Bad Request") {
        super(message, 400, "ValidationError");
    }
}

class InternalServerError extends CustomErrors {
    constructor(message = "Internal Server Error") {
        super(message, 500, "InternalServerError");
    }
}

class AlreadyExistsError extends CustomErrors {
    constructor(message = "Already exists") {
        super(message, 409, "AlreadyExistsError");
    }
}

class Unauthorized extends CustomErrors {
    constructor(message = "Unauthorized access") {
        super(message, 401, "Unauthorized");
    }
}

class Forbidden extends CustomErrors {
    constructor(message = "Forbidden access") {
        super(message, 403, "Forbidden");
    }
}

export {
    CustomErrors,
    NotFoundError,
    BadRequest,
    InternalServerError,
    AlreadyExistsError,
    Unauthorized,
    Forbidden
};
