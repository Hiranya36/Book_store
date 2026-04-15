const express = require('express');
const router  = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const protect = require('../middleware/auth');

// All wishlist routes are protected
router.use(protect);

// GET    /api/wishlist          — view wishlist
router.get('/',        getWishlist);

// POST   /api/wishlist          — add book { bookId }
router.post('/',       addToWishlist);

// DELETE /api/wishlist/:bookId  — remove book
router.delete('/:bookId', removeFromWishlist);

module.exports = router;
