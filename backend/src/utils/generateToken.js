const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = require('../config/env');

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === 'production', // set true on production (HTTPS)
    sameSite: 'lax',
    maxAge: (() => {
      if (typeof JWT_EXPIRES_IN === 'string' && JWT_EXPIRES_IN.endsWith('d')) {
        const days = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10) || 7;
        return days * 24 * 60 * 60 * 1000;
      }
      return 7 * 24 * 60 * 60 * 1000; // fallback 7 days
    })()
  };

  res.cookie('token', token, cookieOptions);
};

module.exports = generateToken;
