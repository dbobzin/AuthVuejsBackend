const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
//v1
const requireAuth = async (req, res, next) => {
    // Verify user is authenticated
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id, role } = jwt.verify(token, process.env.SECRET);

        // Retrieve user including roles
        const user = await User.findOne({ _id });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Attach user information (including roles) to the request object
        req.user = { _id, role: user.role };
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Request is not authorized" });
    }
};

const isAdmin = (req, res, next) => {
    // Check if user is authenticated and has the admin role
    if (req.user.role !== 'ADMIN') {
        next(); // User is an admin, proceed to the next middleware or route handler
    } else {
        res.status(403).json({ error: 'Permission denied. Only admin users can perform this operation.' });
    }
};


module.exports = { requireAuth, isAdmin };
// v2 with admin
// const requireAuth = async (req, res, next) => {
//     // Verify user is authenticated
//     const { authorization } = req.headers;
//
//     if (!authorization) {
//         return res.status(401).json({ error: "Authorization token required" });
//     }
//
//     const token = authorization.split(" ")[1];
//
//     try {
//         const { _id, role } = jwt.verify(token, process.env.SECRET);
//
//         // Skip role check for GET requests
//         if (req.method === 'GET') {
//             const user = await User.findOne({ _id });
//
//             if (!user) {
//                 return res.status(401).json({ error: 'User not found' });
//             }
//
//             req.user = { _id, role: user.role };
//         } else {
//             // For non-GET requests, check for 'ADMIN' role
//             if (role !== 'ADMIN') {
//                 return res.status(403).json({ error: 'Permission denied. Only admins can access this resource.' });
//             }
//
//             // Retrieve user information and attach it to the request
//             const user = await User.findOne({ _id });
//
//             if (!user) {
//                 return res.status(401).json({ error: 'User not found' });
//             }
//
//             req.user = { _id, role: user.role };
//         }
//
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(401).json({ error: 'Request is not authorized' });
//     }
// };

// authMiddleware.js (assuming you have a middleware file for authentication)




