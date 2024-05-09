const jwt =  require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.user.id);

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            console.log("Sending 401 due to token error");
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Invalid or expired token. Please log in again.'
            });
        }
        console.error('Unexpected error in authMiddleware:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.'
        });    
    }
};

const requireRole = (role) => async (req, res, next) => {
    await authMiddleware(req, res, async () => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).send({ error: 'Access denied, insufficient permissions' });
        }
    });
};

module.exports = { authMiddleware, requireRole};