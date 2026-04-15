const { getDB, saveDB, insert } = require('../config/db');

exports.getCart = (req, res) => {
  const db = getDB();
  const items = db.cart_items.filter(i => i.user_id === req.user.id).map(item => {
    const book = db.books.find(b => b.id === item.book_id);
    return { ...item, ...book };
  });
  res.json({ success: true, items });
};

exports.addToCart = (req, res) => {
  const { bookId, quantity = 1 } = req.body;
  const db = getDB();
  
  let item = db.cart_items.find(i => i.user_id === req.user.id && i.book_id === bookId);
  if (item) {
    item.quantity += quantity;
  } else {
    db.cart_items.push({ user_id: req.user.id, book_id: bookId, quantity });
  }
  
  saveDB(db);
  res.json({ success: true, message: 'Added to cart' });
};

exports.updateCartItem = (req, res) => {
  const { quantity } = req.body;
  const db = getDB();
  const item = db.cart_items.find(i => i.user_id === req.user.id && i.book_id == req.params.bookId);
  if (item) {
    item.quantity = quantity;
    saveDB(db);
    res.json({ success: true });
  } else res.status(404).json({ success: false });
};

exports.removeFromCart = (req, res) => {
  const db = getDB();
  db.cart_items = db.cart_items.filter(i => !(i.user_id === req.user.id && i.book_id == req.params.bookId));
  saveDB(db);
  res.json({ success: true });
};

exports.clearCart = (req, res) => {
  const db = getDB();
  db.cart_items = db.cart_items.filter(i => i.user_id !== req.user.id);
  saveDB(db);
  res.json({ success: true });
};
