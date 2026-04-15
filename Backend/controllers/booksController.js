const { getDB, saveDB, all, get, insert } = require('../config/db');

// ── GET /api/books ───────────────────────────────────
exports.getAllBooks = (req, res, next) => {
  try {
    const { genre, sort = 'popular' } = req.query;
    let books = all('books');

    if (genre && genre !== 'all') {
      books = books.filter(b => b.genre === genre);
    }

    // Basic Sorting
    if (sort === 'price-low') books.sort((a,b) => a.price - b.price);
    else if (sort === 'price-high') books.sort((a,b) => b.price - a.price);

    res.json({ success: true, count: books.length, books });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/books/:id ───────────────────────────────
exports.getBookById = (req, res, next) => {
  try {
    const book = get('books', req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, book });
  } catch (err) {
    next(err);
  }
};

exports.searchBooks = (req, res) => {
  const { q = '' } = req.query;
  const books = all('books').filter(b => 
    b.title.toLowerCase().includes(q.toLowerCase()) || 
    b.author.toLowerCase().includes(q.toLowerCase())
  );
  res.json({ success: true, books });
};

// ── ADMIN METHODS ────────────────────────────────────

exports.createBook = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });
  
  const newBook = insert('books', {
    ...req.body,
    rating: req.body.rating || 4.5,
    reviews: req.body.reviews || 0,
    created_at: new Date().toISOString()
  });
  
  res.status(201).json({ success: true, book: newBook });
};

exports.updateBook = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });
  
  const db = getDB();
  const index = db.books.findIndex(b => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ success: false });
  
  db.books[index] = { ...db.books[index], ...req.body };
  saveDB(db);
  res.json({ success: true, book: db.books[index] });
};

exports.deleteBook = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });
  
  const db = getDB();
  db.books = db.books.filter(b => b.id != req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Book deleted' });
};
