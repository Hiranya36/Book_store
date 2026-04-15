const express = require('express');
const router  = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const protect = require('../middleware/auth');

// All cart routes are protected
router.use(protect);

// GET    /api/cart          — view cart
router.get('/',         getCart);

// POST   /api/cart          — add item { bookId, quantity }
router.post('/',        addToCart);

// PUT    /api/cart/:bookId  — update quantity { quantity }
router.put('/:bookId',  updateCartItem);

// DELETE /api/cart/:bookId  — remove single item
router.delete('/:bookId', removeFromCart);

// DELETE /api/cart          — clear entire cart
router.delete('/',      clearCart);

module.exports = router;
