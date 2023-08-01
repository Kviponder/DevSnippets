const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'defaultSecret';
const expiration = process.env.JWT_EXPIRATION || '2h';

const authMiddleware = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    // If no token is found, there's no logged-in user, so you can simply move on to the next middleware.
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, secret);a
    console.log('Decoded Token:', decodedToken);
    req.user = decodedToken.data; // This sets req.user to the user data stored in the token.
    next();
  } catch (err) {
    console.error('Error verifying token:', err); // Log the error for debugging purposes
    res.status(401).json({ message: 'Invalid token' }); // Respond with 401 Unauthorized
  }
};

const signToken = ({ username, _id }) => {
  const payload = { username, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authMiddleware, signToken };
