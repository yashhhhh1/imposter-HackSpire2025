const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Secret key for JWT (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || '35bf686306f732234f7e628c2cb6eb8395fe7fa442aa703e0465a044fa95b7dd568e879299defa17323dfb95d438be3b26937633d0ea975b23fe5ef33957109cc0214a40a96b78af43c6fbf39cccac21a56f216e92d6768021a30e8998164d7d';

// JWT token generation endpoint
app.post('/jwt', (req, res) => {
  try {
    const email = req.body.email;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const token = jwt.sign(
      { email }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    res.json({ token });
  } catch (error) {
    console.error('JWT Error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Middleware to verify token
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden access' });
    }
    req.decoded = decoded;
    next();
  });
};

// Protected route example
app.get('/protected-data', verifyJWT, (req, res) => {
  res.json({ message: 'Protected data accessed successfully', user: req.decoded });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});