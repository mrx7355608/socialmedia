function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        ok: false,
        error: "Not authenticated",
    });
}

module.exports = isAuthenticated;
