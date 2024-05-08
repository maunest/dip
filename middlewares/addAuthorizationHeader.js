module.exports = function (req, res, next) {
    const token = req.cookies.token || req.headers.authorization;
    if (token) {
        req.headers.authorization = `Bearer ${token}`;
    }
    next();
}