const express = require('express');
const router  = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} = require('../controllers/booksController');
const protect = require('../middleware/auth');

// GET  /api/books          — list (supports ?genre=&sort=&search=&page=&limit=)
router.get('/',         getAllBooks);

// GET  /api/books/search   — search books
router.get('/search',   searchBooks);

// GET  /api/books/:id      — single book
router.get('/:id',      getBookById);

// POST /api/books          — create (admin / protected)
router.post('/',        protect, createBook);

// PUT  /api/books/:id      — update (admin / protected)
router.put('/:id',      protect, updateBook);

// DELETE /api/books/:id    — delete (admin / protected)
router.delete('/:id',   protect, deleteBook);

module.exports = router;
