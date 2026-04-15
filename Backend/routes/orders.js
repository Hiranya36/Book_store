const express = require('express');
const router  = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/ordersController');
const protect = require('../middleware/auth');

// All order routes are protected
router.use(protect);

// POST /api/orders           — place order (from cart)
router.post('/',          placeOrder);

// GET  /api/orders           — my orders
router.get('/',           getMyOrders);

// GET  /api/orders/all       — admin: all orders
router.get('/all',        getAllOrders);

// GET  /api/orders/:id       — single order detail
router.get('/:id',        getOrderById);

// PUT  /api/orders/:id/status — admin: update status
router.put('/:id/status', updateOrderStatus);

module.exports = router;
