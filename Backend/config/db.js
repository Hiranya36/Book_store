const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database.json');

// ── Full 16-Book Catalog ─────────────────────────────
const INITIAL_DATA = {
  users: [],
  books: [
    { id:1,  title:'Dune',                    author:'Frank Herbert',        genre:'sci-fi',      price:399, original_price:549, rating:4.9, reviews:18420, badge:'bestseller', color:'linear-gradient(135deg,#667eea,#764ba2)', icon:'🪐', description:'A stunning blend of adventure and mysticism, environmentalism and politics. Dune won the first Nebula Award and shared the Hugo Award.', pages:688, publisher:'Chilton Books', year:1965, stock:50 },
    { id:2,  title:'1984',                    author:'George Orwell',        genre:'fiction',     price:299, original_price:399, rating:4.8, reviews:24601, badge:'bestseller', color:'linear-gradient(135deg,#1a1a2e,#e94560)', icon:'👁️', description:'Among the seminal texts of the 20th century, 1984 is a rare work that grows more haunting as its futuristic vision becomes mirrored in modern reality.', pages:328, publisher:'Secker & Warburg', year:1949, stock:80 },
    { id:3,  title:'Atomic Habits',           author:'James Clear',          genre:'self-help',   price:449, original_price:599, rating:4.9, reviews:31250, badge:'bestseller', color:'linear-gradient(135deg,#f7971e,#ffd200)', icon:'⚛️', description:'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies to form good habits, break bad ones.', pages:320, publisher:'Avery', year:2018, stock:60 },
    { id:4,  title:'The Alchemist',           author:'Paulo Coelho',         genre:'fiction',     price:249, original_price:349, rating:4.7, reviews:28900, badge:null,          color:'linear-gradient(135deg,#43e97b,#38f9d7)', icon:'✨', description:'The magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure as extravagant as any ever found.', pages:208, publisher:'HarperOne', year:1988, stock:90 },
    { id:5,  title:'Rich Dad Poor Dad',       author:'Robert Kiyosaki',      genre:'non-fiction', price:349, original_price:499, rating:4.6, reviews:19800, badge:'sale',         color:'linear-gradient(135deg,#fa709a,#fee140)', icon:'💰', description:"Rich Dad Poor Dad is Robert's story of growing up with two dads and the ways in which both men shaped his thoughts about money and investing.", pages:336, publisher:'Warner Books', year:1997, stock:70 },
    { id:6,  title:'The Silent Patient',      author:'Alex Michaelides',     genre:'mystery',     price:379, original_price:499, rating:4.7, reviews:14320, badge:'new',          color:'linear-gradient(135deg,#4facfe,#00f2fe)', icon:'🔍', description:"Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house. Then one day she shoots her husband.", pages:368, publisher:'Celadon Books', year:2019, stock:45 },
    { id:7,  title:'Pride and Prejudice',     author:'Jane Austen',          genre:'romance',     price:199, original_price:299, rating:4.8, reviews:32100, badge:null,          color:'linear-gradient(135deg,#f093fb,#f5576c)', icon:'💕', description:"Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this her 'own darling child'.", pages:432, publisher:'T. Egerton', year:1813, stock:100 },
    { id:8,  title:'Sapiens',                 author:'Yuval Noah Harari',    genre:'non-fiction', price:499, original_price:699, rating:4.8, reviews:27450, badge:'bestseller', color:'linear-gradient(135deg,#30cfd0,#667eea)', icon:'🌍', description:'A groundbreaking narrative of humanity\'s creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us.', pages:443, publisher:'Harper', year:2011, stock:55 },
    { id:9,  title:'The Midnight Library',    author:'Matt Haig',            genre:'fiction',     price:329, original_price:429, rating:4.6, reviews:11230, badge:'new',          color:'linear-gradient(135deg,#0f3460,#e94560)', icon:'📚', description:'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.', pages:304, publisher:'Canongate', year:2020, stock:40 },
    { id:10, title:'Steve Jobs',              author:'Walter Isaacson',      genre:'biography',   price:549, original_price:749, rating:4.7, reviews:22100, badge:null,          color:'linear-gradient(135deg,#a8edea,#fed6e3)', icon:'🍎', description:'Based on more than forty interviews with Jobs conducted over two years—as well as interviews with more than 100 family members, friends, adversaries, and colleagues.', pages:656, publisher:'Simon & Schuster', year:2011, stock:35 },
    { id:11, title:'The Hunger Games',        author:'Suzanne Collins',      genre:'fiction',     price:279, original_price:399, rating:4.7, reviews:29800, badge:null,          color:'linear-gradient(135deg,#f7971e,#f5576c)', icon:'🏹', description:'In the ruins of a place once known as North America lies the nation of Panem. In punishment for a past rebellion, each district must provide one boy and one girl to compete.', pages:374, publisher:'Scholastic Press', year:2008, stock:65 },
    { id:12, title:'Thinking, Fast and Slow', author:'Daniel Kahneman',      genre:'non-fiction', price:429, original_price:599, rating:4.7, reviews:16540, badge:'sale',         color:'linear-gradient(135deg,#5f72bd,#9b23ea)', icon:'🧠', description:'Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower.', pages:499, publisher:'Farrar, Straus and Giroux', year:2011, stock:50 },
    { id:13, title:'The Great Gatsby',        author:'F. Scott Fitzgerald',  genre:'fiction',     price:179, original_price:249, rating:4.5, reviews:19200, badge:null,          color:'linear-gradient(135deg,#fccb90,#d57eeb)', icon:'🥂', description:"The Great Gatsby stands as the supreme achievement of Fitzgerald's career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers.", pages:180, publisher:'Scribner', year:1925, stock:80 },
    { id:14, title:'Gone Girl',               author:'Gillian Flynn',        genre:'mystery',     price:349, original_price:449, rating:4.6, reviews:13700, badge:null,          color:'linear-gradient(135deg,#1a1a2e,#f5576c)', icon:'🕵️', description:"On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne's fifth wedding anniversary when Nick's clever and beautiful wife disappears.", pages:422, publisher:'Crown Publishing', year:2012, stock:45 },
    { id:15, title:'Educated',                author:'Tara Westover',        genre:'biography',   price:389, original_price:529, rating:4.8, reviews:18910, badge:'new',          color:'linear-gradient(135deg,#cc2b5e,#753a88)', icon:'🎓', description:'Tara Westover was 17 the first time she set foot in a classroom. Born to survivalists in the mountains of Idaho, she prepared for the end of the world by stockpiling home-canned peaches.', pages:352, publisher:'Random House', year:2018, stock:55 },
    { id:16, title:'The Body',                author:'Bill Bryson',          genre:'non-fiction', price:459, original_price:599, rating:4.7, reviews:9820,  badge:'new',          color:'linear-gradient(135deg,#11998e,#38ef7d)', icon:'🫀', description:'Bill Bryson takes us on a grand tour of the most complex and miraculous thing in creation — the human body. Bryson shows us how it works and its remarkable ability to heal itself.', pages:464, publisher:'Doubleday', year:2019, stock:40 }
  ],
  cart_items: [],
  orders:     [],
  wishlist:   []
};

// ── DB Methods ───────────────────────────────────────
function getDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  // Auto-migrate: if books table is missing or has fewer than 16 books, re-seed
  if (!db.books || db.books.length < 16) {
    db.books = INITIAL_DATA.books;
    if (!db.cart_items) db.cart_items = [];
    if (!db.orders)     db.orders     = [];
    if (!db.wishlist)   db.wishlist   = [];
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log(`📚 Seeded ${INITIAL_DATA.books.length} books into database.`);
  }
  return db;
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function all(table, query = {}) {
  const db = getDB();
  let results = db[table] || [];
  Object.keys(query).forEach(key => {
    if (query[key] !== undefined && query[key] !== null)
      results = results.filter(item => item[key] == query[key]);
  });
  return results;
}

function get(table, id) {
  return (getDB()[table] || []).find(item => item.id == id);
}

function insert(table, data) {
  const db = getDB();
  const rows = db[table] || [];
  const id   = rows.length > 0 ? Math.max(...rows.map(i => i.id || 0)) + 1 : 1;
  const newItem = { id, ...data, created_at: new Date().toISOString() };
  rows.push(newItem);
  db[table] = rows;
  saveDB(db);
  return newItem;
}

function initDB() {
  getDB(); // triggers auto-seed
  console.log('🗄️  JSON database ready at database.json');
}

module.exports = { getDB, saveDB, all, get, insert, initDB };
