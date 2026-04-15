/* ===================================================
   PageTurn — Full Stack App Logic (Premium Version)
   =================================================== */
'use strict';

const API_URL = 'http://localhost:5000/api';


// ── State ──────────────────────────────────────────
let ALL_BOOKS = [];
let currentFilter = 'all';
let currentSearch = '';

let user  = JSON.parse(localStorage.getItem('pt_user')  || 'null');
let token = localStorage.getItem('pt_token') || null;

// Local cart/wishlist (used when logged out OR as optimistic UI)
let localCart     = JSON.parse(localStorage.getItem('pt_cart')     || '[]');
let localWishlist = JSON.parse(localStorage.getItem('pt_wishlist') || '[]');

// ── Fallback book data (if backend is offline) ─────
const FALLBACK_BOOKS = [
  { id:1, title:'Dune', author:'Frank Herbert', genre:'sci-fi', price:399, original_price:549, rating:4.9, reviews:18420, badge:'bestseller', color:'linear-gradient(135deg,#667eea,#764ba2)', icon:'🪐', description:'A stunning blend of adventure and mysticism, environmentalism and politics.', pages:688, publisher:'Chilton Books', year:1965 },
  { id:2, title:'1984', author:'George Orwell', genre:'fiction', price:299, original_price:399, rating:4.8, reviews:24601, badge:'bestseller', color:'linear-gradient(135deg,#1a1a2e,#e94560)', icon:'👁️', description:'Among the seminal texts of the 20th century, a rare work that grows more haunting.', pages:328, publisher:'Secker & Warburg', year:1949 },
  { id:3, title:'Atomic Habits', author:'James Clear', genre:'self-help', price:449, original_price:599, rating:4.9, reviews:31250, badge:'bestseller', color:'linear-gradient(135deg,#f7971e,#ffd200)', icon:'⚛️', description:'A proven framework for improving every day.', pages:320, publisher:'Avery', year:2018 },
  { id:4, title:'The Alchemist', author:'Paulo Coelho', genre:'fiction', price:249, original_price:349, rating:4.7, reviews:28900, badge:null, color:'linear-gradient(135deg,#43e97b,#38f9d7)', icon:'✨', description:'The magical story of Santiago, an Andalusian shepherd boy.', pages:208, publisher:'HarperOne', year:1988 },
  { id:5, title:'Rich Dad Poor Dad', author:'Robert Kiyosaki', genre:'non-fiction', price:349, original_price:499, rating:4.6, reviews:19800, badge:'sale', color:'linear-gradient(135deg,#fa709a,#fee140)', icon:'💰', description:"Robert's story of growing up with two dads and money lessons.", pages:336, publisher:'Warner Books', year:1997 },
  { id:6, title:'The Silent Patient', author:'Alex Michaelides', genre:'mystery', price:379, original_price:499, rating:4.7, reviews:14320, badge:'new', color:'linear-gradient(135deg,#4facfe,#00f2fe)', icon:'🔍', description:"Alicia Berenson's life is seemingly perfect until she shoots her husband.", pages:368, publisher:'Celadon Books', year:2019 },
  { id:7, title:'Pride and Prejudice', author:'Jane Austen', genre:'romance', price:199, original_price:299, rating:4.8, reviews:32100, badge:null, color:'linear-gradient(135deg,#f093fb,#f5576c)', icon:'💕', description:"One of the most popular novels in the English language.", pages:432, publisher:'T. Egerton', year:1813 },
  { id:8, title:'Sapiens', author:'Yuval Noah Harari', genre:'non-fiction', price:499, original_price:699, rating:4.8, reviews:27450, badge:'bestseller', color:'linear-gradient(135deg,#30cfd0,#667eea)', icon:'🌍', description:"A groundbreaking narrative of humanity's creation and evolution.", pages:443, publisher:'Harper', year:2011 },
  { id:9, title:'The Midnight Library', author:'Matt Haig', genre:'fiction', price:329, original_price:429, rating:4.6, reviews:11230, badge:'new', color:'linear-gradient(135deg,#0f3460,#e94560)', icon:'📚', description:"Between life and death there is a library where shelves go on forever.", pages:304, publisher:'Canongate', year:2020 },
  { id:10, title:'Steve Jobs', author:'Walter Isaacson', genre:'biography', price:549, original_price:749, rating:4.7, reviews:22100, badge:null, color:'linear-gradient(135deg,#a8edea,#fed6e3)', icon:'🍎', description:"Based on forty interviews with Jobs over two years.", pages:656, publisher:'Simon & Schuster', year:2011 },
  { id:11, title:'The Hunger Games', author:'Suzanne Collins', genre:'fiction', price:279, original_price:399, rating:4.7, reviews:29800, badge:null, color:'linear-gradient(135deg,#f7971e,#f5576c)', icon:'🏹', description:"In the ruins of North America lies the nation of Panem.", pages:374, publisher:'Scholastic Press', year:2008 },
  { id:12, title:'Thinking, Fast and Slow', author:'Daniel Kahneman', genre:'non-fiction', price:429, original_price:599, rating:4.7, reviews:16540, badge:'sale', color:'linear-gradient(135deg,#5f72bd,#9b23ea)', icon:'🧠', description:"A groundbreaking tour of the two systems that drive the way we think.", pages:499, publisher:'Farrar, Straus and Giroux', year:2011 },
  { id:13, title:'The Great Gatsby', author:'F. Scott Fitzgerald', genre:'fiction', price:179, original_price:249, rating:4.5, reviews:19200, badge:null, color:'linear-gradient(135deg,#fccb90,#d57eeb)', icon:'🥂', description:"The supreme achievement of Fitzgerald's career.", pages:180, publisher:'Scribner', year:1925 },
  { id:14, title:'Gone Girl', author:'Gillian Flynn', genre:'mystery', price:349, original_price:449, rating:4.6, reviews:13700, badge:null, color:'linear-gradient(135deg,#1a1a2e,#f5576c)', icon:'🕵️', description:"On a warm summer morning, Nick Dunne's wife disappears.", pages:422, publisher:'Crown Publishing', year:2012 },
  { id:15, title:'Educated', author:'Tara Westover', genre:'biography', price:389, original_price:529, rating:4.8, reviews:18910, badge:'new', color:'linear-gradient(135deg,#cc2b5e,#753a88)', icon:'🎓', description:"Tara Westover was 17 the first time she set foot in a classroom.", pages:352, publisher:'Random House', year:2018 },
  { id:16, title:'The Body', author:'Bill Bryson', genre:'non-fiction', price:459, original_price:599, rating:4.7, reviews:9820, badge:'new', color:'linear-gradient(135deg,#11998e,#38ef7d)', icon:'🫀', description:"A grand tour of the most complex and miraculous thing in creation.", pages:464, publisher:'Doubleday', year:2019 },
];

// ══════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  fetchBooks();
  spawnParticles();
  initScrollEffects();
  initSearch();
  updateBadges();

  // Nav buttons
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('userBtn').addEventListener('click', () => user ? openAccount() : openAuth());
  document.getElementById('wishlistBtn').addEventListener('click', openWishlistDrawer);

  // Close on overlay click
  document.getElementById('cartOverlay').addEventListener('click', closeAll);

  // Update user UI
  if (user) updateUserUI();
});

// ══════════════════════════════════════════════════
//  FETCH BOOKS FROM API
// ══════════════════════════════════════════════════
async function fetchBooks() {
  try {
    const sort  = document.getElementById('sortSelect')?.value || 'popular';
    const url   = new URL(`${API_URL}/books`);
    if (currentFilter !== 'all') url.searchParams.set('genre', currentFilter);
    url.searchParams.set('sort', sort);

    const res  = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    ALL_BOOKS  = data.books || [];
    renderBooks();
  } catch {
    ALL_BOOKS = [...FALLBACK_BOOKS];
    if (currentFilter !== 'all') ALL_BOOKS = ALL_BOOKS.filter(b => b.genre === currentFilter);
    renderBooks();
  }
}

// ══════════════════════════════════════════════════
//  RENDER BOOKS
// ══════════════════════════════════════════════════
function renderBooks() {
  const grid       = document.getElementById('booksGrid');
  const noResults  = document.getElementById('noResults');
  const countEl    = document.getElementById('resultsCount');

  // Apply local search filter (Comprehensive: title, author, genre, description)
  let books = currentSearch
    ? ALL_BOOKS.filter(b =>
        b.title?.toLowerCase().includes(currentSearch) ||
        b.author?.toLowerCase().includes(currentSearch) ||
        b.genre?.toLowerCase().includes(currentSearch) ||
        b.description?.toLowerCase().includes(currentSearch))
    : ALL_BOOKS;

  countEl.textContent = `Showing ${books.length} books`;

  if (books.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  grid.innerHTML = books.map(b => buildCard(b)).join('');

  // Staggered animation
  grid.querySelectorAll('.book-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 50);
  });
}

function buildCard(b) {
  const inWl   = localWishlist.includes(b.id);
  const disc   = Math.round((1 - b.price / (b.original_price || b.originalPrice || b.price + 1)) * 100);
  const badge  = b.badge ? `<div class="badge-${b.badge}">${
    b.badge === 'bestseller' ? '🔥 Bestseller'
    : b.badge === 'new'  ? '✨ New' : '🏷️ Sale'
  }</div>` : '';

  return `
  <div class="book-card" id="book-${b.id}">
    <div class="book-card-img">
      <div class="book-cover-art" style="background:${b.color}">
        <div class="book-spine"></div>
        <span class="book-cover-title">${b.title}</span>
        <span class="book-cover-author">${b.author}</span>
        <span class="book-cover-deco">${b.icon || '📚'}</span>
      </div>
      ${badge}
      <button class="wishlist-heart ${inWl ? 'liked' : ''}" onclick="toggleWishlist(${b.id}, event)">${inWl ? '❤️' : '🤍'}</button>
      <div class="book-card-overlay">
        <button class="overlay-btn primary" onclick="addToCart(${b.id})">🛒 Add to Cart</button>
        <button class="overlay-btn secondary" onclick="openModal(${b.id})">👁 Quick View</button>
      </div>
    </div>
    <div class="book-card-info">
      <div class="book-card-title">${b.title}</div>
      <div class="book-card-author">${b.author}</div>
      <div class="book-card-bottom">
        <div class="book-card-rating">★ ${b.rating} <span>(${fmtNum(b.reviews)})</span></div>
        <div class="book-card-price">
          <span class="price-current">₹${b.price}</span>
          <span class="price-original">₹${b.original_price || b.originalPrice || ''}</span>
        </div>
      </div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════════
//  FILTER & SEARCH
// ══════════════════════════════════════════════════
function filterBooks(cat, el) {
  currentFilter = cat;
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  fetchBooks();
}

function initSearch() {
  const input = document.getElementById('searchInput');
  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { currentSearch = input.value.trim().toLowerCase(); renderBooks(); }, 300);
  });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { currentSearch = input.value.trim().toLowerCase(); renderBooks(); } });
}

// ══════════════════════════════════════════════════
//  CART  (local + API)
// ══════════════════════════════════════════════════
function addToCart(bookId) {
  if (!user) {
    showToast('Please sign in to add items to cart 👆', 'warning');
    openAuth();
    return;
  }

  const book = ALL_BOOKS.find(b => b.id === bookId);
  if (!book) return;

  const existing = localCart.find(c => c.id === bookId);
  if (existing) existing.qty++;
  else localCart.push({ id: bookId, qty: 1 });
  saveLocalCart();
  updateBadges();
  showToast(`📚 "${book.title}" added to cart!`, 'success');
  openCart();

  // Also sync to backend
  fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ bookId })
  }).catch(() => {/* offline — local cart is enough */});
}

function removeFromCart(bookId) {
  localCart = localCart.filter(c => c.id !== bookId);
  saveLocalCart();
  updateBadges();
  renderCartDrawer();
  fetch(`${API_URL}/cart/${bookId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }).catch(() => {});
}

function changeQty(bookId, delta) {
  const item = localCart.find(c => c.id === bookId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveLocalCart();
  updateBadges();
  renderCartDrawer();
  fetch(`${API_URL}/cart/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ quantity: item.qty })
  }).catch(() => {});
}

function saveLocalCart() { localStorage.setItem('pt_cart', JSON.stringify(localCart)); }

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartDrawer();
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const items    = localCart;
  const itemsEl  = document.getElementById('cartItems');
  const emptyEl  = document.getElementById('emptyCart');
  const footerEl = document.getElementById('cartFooter');
  const countEl  = document.getElementById('cartItemCount');
  const totalEl  = document.getElementById('cartTotal');

  const total = items.reduce((sum, c) => {
    const b = ALL_BOOKS.find(x => x.id === c.id);
    return sum + (b ? b.price * c.qty : 0);
  }, 0);

  countEl.textContent = `(${items.reduce((s,c)=>s+c.qty,0)} items)`;

  if (items.length === 0) {
    emptyEl.style.display = 'flex';
    itemsEl.innerHTML = '';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';

  itemsEl.innerHTML = items.map(c => {
    const b = ALL_BOOKS.find(x => x.id === c.id);
    if (!b) return '';
    return `
    <div class="cart-item">
      <div class="cart-item-cover" style="background:${b.color}">${b.icon || '📚'}</div>
      <div class="cart-item-info">
        <div class="cart-item-title">${b.title}</div>
        <div class="cart-item-author">${b.author}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${b.id},-1)">−</button>
          <span class="qty-num">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${b.id},1)">+</button>
          <button class="cart-item-remove" onclick="removeFromCart(${b.id})">Remove</button>
        </div>
      </div>
      <div class="cart-item-price">₹${b.price * c.qty}</div>
    </div>`;
  }).join('');

  totalEl.textContent = `₹${total}`;
}

function checkout() {
  if (!user) { openAuth(); return; }
  if (localCart.length === 0) { showToast('Your cart is empty!', 'warning'); return; }

  // Build items array from local cart to send to backend
  const orderItems = localCart.map(c => {
    const b = ALL_BOOKS.find(x => x.id === c.id);
    return { book_id: c.id, qty: c.qty, quantity: c.qty, price: b ? b.price : 0, title: b ? b.title : '' };
  });

  const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ address: 'Default address', items: orderItems })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      showToast(`🎉 Order of ₹${total} placed successfully!`, 'success');
      localCart = [];
      saveLocalCart();
      updateBadges();
      renderCartDrawer();
      closeCart();
    } else {
      showToast(data.message || 'Order failed', 'error');
    }
  })
  .catch(() => {
    showToast('🎉 Order placed! (Demo mode)', 'success');
    localCart = [];
    saveLocalCart();
    updateBadges();
    closeCart();
  });
}

// ══════════════════════════════════════════════════
//  WISHLIST DRAWER
// ══════════════════════════════════════════════════
function openWishlistDrawer() {
  // Reuse the account drawer style — build a wishlist view inside cart drawer
  const drawer  = document.getElementById('cartDrawer');
  const header  = drawer.querySelector('.cart-header h3');
  const body    = document.getElementById('cartBody');
  const footer  = document.getElementById('cartFooter');

  header.innerHTML = 'My Wishlist <span id="cartItemCount">('+localWishlist.length+' books)</span>';
  footer.style.display = 'none';

  if (localWishlist.length === 0) {
    document.getElementById('emptyCart').style.display = 'flex';
    document.getElementById('emptyCart').querySelector('p').textContent = 'Your wishlist is empty';
    document.getElementById('cartItems').innerHTML = '';
  } else {
    document.getElementById('emptyCart').style.display = 'none';
    document.getElementById('cartItems').innerHTML = localWishlist.map(id => {
      const b = ALL_BOOKS.find(x => x.id === id);
      if (!b) return '';
      return `
      <div class="cart-item">
        <div class="cart-item-cover" style="background:${b.color}">${b.icon || '📚'}</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${b.title}</div>
          <div class="cart-item-author">${b.author}</div>
          <div class="cart-item-controls">
            <button class="overlay-btn primary" style="padding:6px 14px;font-size:.78rem" onclick="addToCart(${b.id})">🛒 Add to Cart</button>
            <button class="cart-item-remove" onclick="removeWishlistItem(${b.id})">Remove</button>
          </div>
        </div>
        <div class="cart-item-price">₹${b.price}</div>
      </div>`;
    }).join('');
  }

  drawer.classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function removeWishlistItem(bookId) {
  localWishlist = localWishlist.filter(id => id !== bookId);
  localStorage.setItem('pt_wishlist', JSON.stringify(localWishlist));
  updateBadges();
  openWishlistDrawer(); // re-render
}

// ══════════════════════════════════════════════════
//  WISHLIST TOGGLE (on book cards)
// ══════════════════════════════════════════════════
function toggleWishlist(bookId, e) {
  e.stopPropagation();
  if (!user) { showToast('Please sign in to use wishlist 👆', 'warning'); openAuth(); return; }

  const book = ALL_BOOKS.find(b => b.id === bookId);
  const inWl = localWishlist.includes(bookId);

  if (inWl) {
    localWishlist = localWishlist.filter(id => id !== bookId);
    showToast(`💔 Removed from wishlist`, 'warning');
    fetch(`${API_URL}/wishlist/${bookId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }).catch(()=>{});
  } else {
    localWishlist.push(bookId);
    showToast(`❤️ "${book?.title}" wishlisted!`, 'success');
    fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ bookId })
    }).catch(()=>{});
  }

  localStorage.setItem('pt_wishlist', JSON.stringify(localWishlist));
  updateBadges();

  const card = document.getElementById(`book-${bookId}`);
  if (card) {
    const heart = card.querySelector('.wishlist-heart');
    const liked = localWishlist.includes(bookId);
    heart.classList.toggle('liked', liked);
    heart.textContent = liked ? '❤️' : '🤍';
  }
}

// ══════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════
function openAuth() {
  document.getElementById('authModal').classList.add('open');
  document.getElementById('authOverlay').classList.add('open');
}

function closeAuth() {
  document.getElementById('authModal').classList.remove('open');
  document.getElementById('authOverlay').classList.remove('open');
}

function switchAuth(type) {
  if (type === 'login') {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('regSection').classList.add('hidden');
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabReg').classList.remove('active');
  } else {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('regSection').classList.remove('hidden');
    document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('tabReg').classList.add('active');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.textContent = 'Signing in...';
  btn.disabled = true;
  try {
    const res  = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: document.getElementById('lEmail').value, password: document.getElementById('lPass').value })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('pt_token', data.token);
      localStorage.setItem('pt_user', JSON.stringify(data.user));
      showToast(`Welcome back, ${data.user.name}! 👋`, 'success');
      setTimeout(() => location.reload(), 800);
    } else {
      showToast(data.message || 'Login failed', 'error');
      btn.textContent = 'Sign In'; btn.disabled = false;
    }
  } catch {
    showToast('Server error — make sure backend is running', 'error');
    btn.textContent = 'Sign In'; btn.disabled = false;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById('regBtn');
  btn.textContent = 'Creating account...'; btn.disabled = true;
  try {
    const res  = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('rName').value,
        email: document.getElementById('rEmail').value,
        password: document.getElementById('rPass').value
      })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('pt_token', data.token);
      localStorage.setItem('pt_user', JSON.stringify(data.user));
      showToast(`Welcome to PageTurn, ${data.user.name}! 🎉`, 'success');
      setTimeout(() => location.reload(), 800);
    } else {
      showToast(data.message || 'Registration failed', 'error');
      btn.textContent = 'Create Account'; btn.disabled = false;
    }
  } catch {
    showToast('Server error — make sure backend is running', 'error');
    btn.textContent = 'Create Account'; btn.disabled = false;
  }
}

// ══════════════════════════════════════════════════
//  ACCOUNT DRAWER
// ══════════════════════════════════════════════════
function openAccount() {
  document.getElementById('accountDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  updateUserUI();
  loadOrders(); // Auto-load orders every time drawer opens
}

function closeAccount() {
  document.getElementById('accountDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function updateUserUI() {
  if (!user) return;
  document.getElementById('uName').textContent  = user.name;
  document.getElementById('uEmail').textContent = user.email;
  document.getElementById('uAvatar').textContent = user.name[0].toUpperCase();

  // Turn user button purple with initial
  const btn = document.getElementById('userBtn');
  btn.style.background = 'var(--accent)';
  btn.style.borderColor = 'var(--accent)';

  // Show Admin Link if applicable
  if(user.role === 'admin') {
    document.getElementById('adminLink')?.classList.remove('hidden');
  }
}

async function loadOrders() {
  const container = document.getElementById('ordersContainer');
  container.innerHTML = '<p style="padding:10px;color:var(--text-muted);font-size:.85rem">⏳ Loading your orders...</p>';
  try {
    const res  = await fetch(`${API_URL}/orders`, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();

    if (!data.orders || data.orders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:30px 10px;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:12px">📦</div>
          <p style="margin-bottom:16px">No orders yet</p>
          <button class="btn btn-primary" onclick="closeAccount()" style="font-size:.85rem;padding:10px 20px">Start Shopping</button>
        </div>`;
      return;
    }

    container.innerHTML = `
      <h4 style="margin:16px 0 10px;font-size:.85rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">Order Tracking</h4>
      ${data.orders.map(o => {
        const statusSteps = ['confirmed', 'shipped', 'delivered'];
        const currentStep = statusSteps.indexOf(o.status.toLowerCase());
        
        return `
        <div class="order-card">
          <div class="order-card-header">
            <strong>Order #${o.id}</strong>
            <span class="order-status status-${o.status.toLowerCase()}">${o.status}</span>
          </div>
          <div style="color:var(--text-muted);font-size:.72rem;margin-bottom:12px">${new Date(o.created_at).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</div>
          
          <!-- Tracking Progress Bar -->
          <div class="tracking-track">
            <div class="tracking-progress" style="width: ${((currentStep + 1) / statusSteps.length) * 100}%"></div>
            <div class="tracking-node ${currentStep >= 0 ? 'active' : ''}" title="Confirmed"></div>
            <div class="tracking-node ${currentStep >= 1 ? 'active' : ''}" title="Shipped"></div>
            <div class="tracking-node ${currentStep >= 2 ? 'active' : ''}" title="Delivered"></div>
          </div>
          <div class="tracking-labels">
            <span>Placed</span>
            <span>Shipped</span>
            <span>Delivered</span>
          </div>

          <div style="font-size:.78rem;color:var(--text-secondary);margin:12px 0 8px">${o.items ? o.items.map(i => i.title).join(', ') : 'Processing...'}</div>
          <div style="font-weight:700;color:var(--accent);font-size:.9rem">Total: ₹${o.total}</div>
        </div>`;
      }).join('')}`;
  } catch (err) {
    container.innerHTML = '<p style="padding:10px;color:#f5576c;font-size:.85rem">⚠️ Could not load orders. Is the server running?</p>';
  }
}

function logout() {
  localStorage.removeItem('pt_token');
  localStorage.removeItem('pt_user');
  localStorage.removeItem('pt_cart');
  localStorage.removeItem('pt_wishlist');
  showToast('Signed out successfully 👋', 'success');
  setTimeout(() => location.reload(), 600);
}

// ══════════════════════════════════════════════════
//  BOOK QUICK VIEW MODAL
// ══════════════════════════════════════════════════
function openModal(bookId) {
  const b = ALL_BOOKS.find(x => x.id === bookId);
  if (!b) return;
  const disc = Math.round((1 - b.price / (b.original_price || b.originalPrice || b.price)) * 100);
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-book">
      <div class="modal-cover">
        <div class="modal-cover-art" style="background:${b.color}">
          <div class="book-spine"></div>
          <span class="book-cover-title">${b.title}</span>
          <span class="book-cover-author">${b.author}</span>
          <span class="book-cover-deco">${b.icon || '📚'}</span>
        </div>
      </div>
      <div class="modal-info">
        <h2 class="modal-title">${b.title}</h2>
        <p class="modal-author">by ${b.author}</p>
        <div class="modal-meta">
          <div class="modal-meta-item"><strong>${b.pages || '—'}</strong>Pages</div>
          <div class="modal-meta-item"><strong>${b.year || '—'}</strong>Year</div>
          <div class="modal-meta-item"><strong>${fmtNum(b.reviews)}</strong>Reviews</div>
        </div>
        <div class="modal-rating">${'★'.repeat(Math.floor(b.rating))}${'☆'.repeat(5-Math.floor(b.rating))} <span style="color:var(--text-muted);font-size:.85rem">${b.rating}/5</span></div>
        <p class="modal-desc">${b.description || b.desc || ''}</p>
        <div class="modal-price">
          <span class="modal-price-current">₹${b.price}</span>
          <span class="modal-price-original">₹${b.original_price || b.originalPrice || ''}</span>
          ${disc > 0 ? `<span class="modal-price-disc">${disc}% OFF</span>` : ''}
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" onclick="addToCart(${b.id}); closeModal()">🛒 Add to Cart</button>
          <button class="btn btn-ghost" onclick="toggleWishlist(${b.id}, event)">🤍 Wishlist</button>
        </div>
      </div>
    </div>`;
  document.getElementById('bookModal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('bookModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ══════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════
function closeAll() { closeCart(); closeAuth(); closeModal(); closeAccount(); }

function updateBadges() {
  document.getElementById('cartBadge').textContent     = localCart.reduce((s,c)=>s+c.qty, 0);
  document.getElementById('wishlistBadge').textContent = localWishlist.length;
}

function showToast(msg, type = 'default') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; setTimeout(()=>t.remove(),300); }, 3000);
}

function subscribePromo() {
  const email = document.getElementById('promoEmail').value.trim();
  if (!email || !email.includes('@')) { showToast('⚠️ Please enter a valid email', 'warning'); return; }
  showToast(`🎉 20% discount code sent to ${email}!`, 'success');
  document.getElementById('promoEmail').value = '';
}

function fmtNum(n) { return n >= 1000 ? (n/1000).toFixed(1)+'K' : String(n); }

function spawnParticles() {
  const c = document.getElementById('heroParticles');
  if (!c) return;
  const colors = ['#7c6aff','#b47fff','#f5c842','#f5576c','#4facfe'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `left:${Math.random()*100}%;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${10+Math.random()*15}s;animation-delay:${Math.random()*10}s;`;
    c.appendChild(p);
  }
}

function initScrollEffects() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Close with Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
