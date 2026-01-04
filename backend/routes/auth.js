// routes/auth.js (PostgreSQL version)
const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (db, secretKey) => {
  const router = express.Router();

  // -------------------- TOKEN VERIFICATION --------------------
  const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
      req.user = decoded;
      next();
    });
  };
  router.verifyToken = verifyToken;

  // -------------------- REGISTER --------------------
  router.post('/register', async (req, res) => {
    const {
      firstName,
      lastName,
      nationality,
      dateOfBirth,
      phone,
      email,
      password,
      paymentMethod
    } = req.body;

    if (!firstName || !lastName || !password || !email || !nationality || !dateOfBirth) {
      return res.status(400).json({
        message: 'Please provide all required fields: names, date of birth, nationality, email, and password.'
      });
    }

    const sql = `
      INSERT INTO users
      (first_name, last_name, country, dob, phone, email, password, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    try {
      const result = await db.query(sql, [
        firstName,
        lastName,
        nationality,
        dateOfBirth,
        phone,
        email,
        password,
        paymentMethod
      ]);

      res.status(201).json({ message: 'User registered successfully!', user: result.rows[0] });

    } catch (err) {
      console.error('Database Registration Error:', err.message);

      if (err.code === '23505') { // Postgres unique violation
        return res.status(409).json({ message: 'Email already exists.' });
      }

      res.status(500).json({ message: 'Registration failed due to a server error.' });
    }
  });

  // -------------------- LOGIN --------------------
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const sql = 'SELECT * FROM users WHERE email = $1';

    try {
      const result = await db.query(sql, [email]);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const user = result.rows[0];

      // Plain-text password check (same as your original code)
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const payload = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });

      const userData = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        country: user.country,
        paymentMethod: user.payment_method
      };

      res.json({ message: 'Login successful!', user: userData, token });

    } catch (err) {
      console.error('Database Login Error:', err.message);
      res.status(500).json({ message: 'Login failed due to a server error.' });
    }
  });

  // -------------------- VERIFY TOKEN --------------------
  router.get('/verify', verifyToken, (req, res) => {
    res.json({ message: 'Token is valid', user: req.user });
  });

  return router;
};
