const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    // console.log("Authorization Header:", token);

    if (token && token.startsWith("Bearer ")) {
        try {
            token = token.split(" ")[1];

            // console.log("Token:", token);
            // console.log("JWT_SECRET:", process.env.JWT_SECRET);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // console.log("Decoded:", decoded);

            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    message: "User not found",
                });
            }

            next();
        } catch (err) {
            console.log("JWT ERROR:", err);

            return res.status(401).json({
                message: "Not authorized",
                error: err.message,
            });
        }
    } else {
        return res.status(401).json({
            message: "No token found",
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
