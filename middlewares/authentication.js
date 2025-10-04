const { verifyToken } = require('../services/authentication');

function checkforAuthentication(cookiename = 'token') {
     return function (req, res, next) {
        const tokenCookieValue = req.cookies[cookiename]; 
        if (!tokenCookieValue) {
            req.user = null;
            return next();
        }
        try {
            const userPayload = verifyToken(tokenCookieValue);
            if (!userPayload) {
                req.user = null;
                return next();
            }
            req.user = userPayload;
        } catch (error) {
            req.user = null;
        } 
        return next();
    }
} 

module.exports = { checkforAuthentication };
