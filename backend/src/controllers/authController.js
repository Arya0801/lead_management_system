const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Register user
 * POST /auth/register
 * body: { name, email, password }
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const user = await User.create({ name, email, password });
    generateToken(res, user._id);
    const userSafe = { id: user._id, name: user.name, email: user.email };
    res.status(201).json({ user: userSafe });
  } catch (err) {
    next(err);
  }
};

/**
 * Login
 * POST /auth/login
 * body: { email, password }
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    generateToken(res, user._id);
    const userSafe = { id: user._id, name: user.name, email: user.email };
    res.status(200).json({ user: userSafe });
  } catch (err) {
    next(err);
  }
};

/**
 * Logout
 * POST /auth/logout
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user
 * GET /auth/me
 */
const me = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, me };
