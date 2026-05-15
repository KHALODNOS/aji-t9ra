const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        // Check if user exists (should be set by authMiddleware)
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if user's role is in the allowed roles
        // Note: We use req.user.Role (Capital R) to match the database schema
        const userRole = (req.user.Role || '').toLowerCase();
        const allowedRoles = roles.flat().map(r => r.toLowerCase());

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: `Forbidden: Access denied for role ${req.user.Role}`,
            });
        }

        next();
    };
};

module.exports = roleMiddleware;
