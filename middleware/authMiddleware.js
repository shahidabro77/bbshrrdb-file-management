// const jwt = require('jsonwebtoken');

// function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Invalid token' });
//   }
// }

// function authorizeRoles(...allowedRoles) {
//   return (req, res, next) => {
//     if (!req.user || !allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access Denied' });
//     }
//     next();
//   };
// }

// module.exports = {
//   authMiddleware,
//   authorizeRoles
// };

const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.user_id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = {
      id: user.user_id,
      role: user.role,
      email: user.email
    };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};


// module.exports = { authMiddleware };
