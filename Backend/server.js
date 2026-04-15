require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { initDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes     = require('./routes/auth');
const bookRoutes     = require('./routes/books');
const cartRoutes     = require('./routes/cart');
const orderRoutes    = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// ── Routes ──────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/books',    bookRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/wishlist', wishlistRoutes);

// ── Health check ────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'PageTurn API is running 🚀', timestamp: new Date() });
});

// ── 404 ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error handler ────────────────────────────────────
app.use(errorHandler);

// ── Start ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
initDB();
app.listen(PORT, () => {
  console.log(`\n📖  PageTurn API listening on http://localhost:${PORT}`);
  console.log(`📋  Health → http://localhost:${PORT}/api/health\n`);
});
