import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fizi-telecom-admin-secret-key-2026';
const TOKEN_EXPIRY = '24h';

// Admin credentials — change these in production
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Fizitecom@2026';

export const login = (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    // Delay response to prevent brute force timing attacks
    return setTimeout(() => {
      res.status(401).json({ error: 'Invalid credentials' });
    }, 800);
  }

  const token = jwt.sign(
    { username, role: 'admin', iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  res.json({
    token,
    user: { username, role: 'admin' },
    expiresIn: TOKEN_EXPIRY
  });
};

export const verifyToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    return res.status(403).json({ error: 'Invalid token.' });
  }
};
