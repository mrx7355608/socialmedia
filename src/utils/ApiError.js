class ApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

module.exports = ApiError;
