const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || '123456789';

const isAdmin = (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        // Verify token and check role
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Log for debugging
            console.log('Decoded token:', decoded);
            
            // Check if user is admin (assuming your token includes a role or username)
            if (decoded.username === 'admin') { // Adjust this condition based on your token structure
                req.user = decoded;
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Admin only.' });
            }
        });
    } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ message: 'Server error in admin check' });
    }
};

module.exports = isAdmin;