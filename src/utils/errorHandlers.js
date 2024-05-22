const ApiError = require("./ApiError.js");

function catch404(req, res, next) {
    return next(new ApiError("Page not found", 404));
}

function globalErrorHandler(err, req, res, next) {
    const errMsg = err.message || "Internal server error";
    const code = err.statusCode || 500;

    if (process.env.NODE_ENV === "development") {
        res.status(code).json({
            ok: false,
            error: errMsg,
            stack: err.stack,
        });
    } else {
        res.status(code).json({
            ok: false,
            error: errMsg,
        });
    }
}

module.exports = { catch404, globalErrorHandler };
