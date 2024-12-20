require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Dummy in-memory user "database"
const users = [];

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static('public')); // Serve static files from /public


/** 
 * 🛠️ Utility Function: Generate JWT 
 */
function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
}

/**
 * 🛠️ Middleware: Protect routes
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
}

/**
 * 📘 Route: Register a New User
 * Endpoint: POST /register
 */
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add new user to "database"
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully!' });
});

/**
 * 📘 Route: User Login
 * Endpoint: POST /login
 */
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find(user => user.username === username);
  if (!user) return res.status(400).json({ message: 'User not found' });

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) return res.status(401).json({ message: 'Incorrect password' });

  // Generate JWT token
  const token = generateToken(user);
  res.json({ token });
});

/**
 * 📘 Route: Get Profile (Protected Route)
 * Endpoint: GET /profile
 */
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!`, user: req.user });
});

/**
 * 📘 Route: Public Route (No authentication required)
 * Endpoint: GET /public
 */
app.get('/public', (req, res) => {
  res.json({ message: 'This route is public and accessible to anyone!' });
});

/**
 * 📘 Route: Logout
 * Endpoint: POST /logout
 */
app.post('/logout', (req, res) => {
  // Note: Token-based logouts are done client-side (like clearing localStorage)
  res.json({ message: 'Logged out successfully!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
