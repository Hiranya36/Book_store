const { getDB, saveDB, insert } = require('../config/db');

// ── POST /api/orders ─────────────────────────────────
// Accepts cart from DB OR items passed directly from client
exports.placeOrder = (req, res) => {
  const { address, items: clientItems } = req.body;
  const db  = getDB();
  const uid = req.user.id;

  // Try server-side cart first
  let cartItems = db.cart_items.filter(i => i.user_id === uid);

  // If server cart empty, use items sent from client (local cart)
  if (cartItems.length === 0 && clientItems && clientItems.length > 0) {
    cartItems = clientItems.map(i => ({
      user_id:  uid,
      book_id:  i.book_id || i.id,
      quantity: i.qty || i.quantity || 1,
      price:    i.price || 0,
      title:    i.title || ''
    }));
  }

  if (cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  // Calculate total (use price from client items or look up in books)
  const total = cartItems.reduce((sum, item) => {
    if (item.price) return sum + item.price * (item.qty || item.quantity || 1);
    const book = db.books.find(b => b.id == item.book_id);
    return sum + (book ? book.price * (item.qty || item.quantity || 1) : 0);
  }, 0);

  // Build order items detail
  const orderItems = cartItems.map(item => {
    const book = db.books.find(b => b.id == item.book_id);
    return {
      book_id:  item.book_id,
      quantity: item.qty || item.quantity || 1,
      price:    item.price || (book ? book.price : 0),
      title:    item.title || (book ? book.title : 'Unknown')
    };
  });

  const order = insert('orders', {
    user_id: uid,
    total,
    address:  address || 'Default',
    status:   'confirmed',
    items:    orderItems
  });

  // ✅ FIX: Get a fresh copy of the DB state after the insert
  // to prevent overwriting the new order with stale data.
  const freshDB = getDB();
  freshDB.cart_items = freshDB.cart_items.filter(i => i.user_id !== uid);
  saveDB(freshDB);

  console.log(`✅ Order #${order.id} placed for user ${uid}. Total: ₹${total}`);
  res.status(201).json({ success: true, message: 'Order placed!', order });
};

// ── GET /api/orders ──────────────────────────────────
exports.getMyOrders = (req, res) => {
  const db     = getDB();
  // Use == (loose) to handle number/string type differences from JWT decode
  const orders = db.orders
    .filter(o => o.user_id == req.user.id)
    .sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  console.log(`📦 Orders for user ${req.user.id}:`, orders.length);
  res.json({ success: true, orders });
};

exports.getOrderById = (req, res) => {
  const db    = getDB();
  const order = db.orders.find(o => o.id == req.params.id && o.user_id === req.user.id);
  res.json({ success: !!order, order });
};

exports.getAllOrders = (req, res) => {
  const db = getDB();
  res.json({ success: true, orders: db.orders });
};

exports.updateOrderStatus = (req, res) => {
  const db    = getDB();
  const order = db.orders.find(o => o.id == req.params.id);
  if (order) { order.status = req.body.status; saveDB(db); res.json({ success: true }); }
  else res.status(404).json({ success: false });
};
