const { getDB, saveDB, insert } = require('../config/db');

exports.getWishlist = (req, res) => {
  const db = getDB();
  const items = db.wishlist.filter(w => w.user_id === req.user.id).map(w => {
    return db.books.find(b => b.id === w.book_id);
  });
  res.json({ success: true, items });
};

exports.addToWishlist = (req, res) => {
  const { bookId } = req.body;
  const db = getDB();
  if (!db.wishlist.find(w => w.user_id === req.user.id && w.book_id === bookId)) {
    db.wishlist.push({ user_id: req.user.id, book_id: bookId });
    saveDB(db);
  }
  res.json({ success: true });
};

exports.removeFromWishlist = (req, res) => {
  const db = getDB();
  db.wishlist = db.wishlist.filter(w => !(w.user_id === req.user.id && w.book_id == req.params.bookId));
  saveDB(db);
  res.json({ success: true });
};
