const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { getDB, saveDB, insert } = require('../config/db');

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

exports.register = (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const db = getDB();

    if (db.users.find(u => u.email === email)) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const newUser = insert('users', {
      name, email, 
      password: bcrypt.hashSync(password, 10),
      role: 'customer'
    });

    const token = signToken(newUser);
    res.status(201).json({ success: true, token, user: newUser });
  } catch (err) { next(err); }
};

exports.login = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = getDB();
    const user = db.users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user);
    res.json({ success: true, token, user });
  } catch (err) { next(err); }
};

exports.getMe = (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id);
  res.json({ success: true, user });
};
