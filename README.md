# 📖 PageTurn — Premium AI-Driven Bookstore

![PageTurn Banner](https://img.shields.io/badge/Status-Premium-7c6aff?style=for-the-badge&logoColor=white) 
![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Vanilla%20JS%20%7C%20CSS-blue?style=for-the-badge)
![AI](https://img.shields.io/badge/Powered%20By-AI%20Muse-cyan?style=for-the-badge)

PageTurn is a high-end, full-stack online bookstore featuring a **Glassmorphism design system**, integrated **Machine Learning recommendations**, and a powerful **Admin Dashboard**.

---

## Cutting-Edge Features

### 1. PageTurn Muse (AI Assistant)
Experience a "smart" shopping journey. Our floating AI Chatbot uses **Natural Language processing (NLP)** to understand user moods and intent.
- Ask for "gripping mysteries" or "feel-good stories".
- Context-aware recommendations directly in the chat.

### 2. ML Recommendation Engine
The store thinks ahead. Every book modal features a **Similarity Algorithm** (Jaccard Diversity) that calculates mathematical overlap between titles.
- Recommends "Similar Reads" based on genre, author, and description content.
- Dynamic data density mapping for precision discovery.

### 3. Live Order Tracking
Transparency at its best. Customers can track their packages in real-time through their account.
- **Visual Progress Tracker**: From "Confirmed" to "Delivered".
- Instant synchronization with Admin actions.

### 4. Admin Command Center
A dedicated workspace for store owners to manage the entire ecosystem.
- **Inventory Management**: Add new books with **AI Suggest** (auto-generates blurbs and cover gradients).
- **Order Control**: Update statuses and view global sales data.
- **Premium UI**: Clean, data-rich tables and custom-styled controls.

---

## Design Aesthetic: Glassmorphism

PageTurn is built with a focus on **visual excellence**:
- **Dynamic Book Stack**: Five-layered hero animation with staggered floating effects.
- **Layered Transparency**: 25px blur filters with subtle border-glow effects.
- **Responsive Stacking**: Seamlessly shifts from desktop elegance to mobile-first efficiency.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Vanilla JavaScript (ES6+), Modern Vanilla CSS, HTML5 |
| **Backend** | Node.js, Express.js |
| **Security** | JWT (JSON Web Tokens), Bcrypt Hashing |
| **Database** | Lightweight JSON Persistence |
| **AI/ML** | Keyword-based NLP, Content-based Filtering Algorithm |

---

## Getting Started

### 1. Prerequisite
Ensure you have **Node.js** installed on your system.

### 2. Setup the Backend
```bash
cd Backend
npm install
npm start
```
*The server will run on `http://localhost:5000`.*

### 3. Setup the Frontend
Simply open `Frontend/index.html` using a local server (like VS Code **Live Server**) or just double-click the file!

---

## Default Admin Account
To test the Admin features, use the following credentials:
- **Email**: `hiranyaindrakanti@gmail.com`
- **Role**: Admin (Already configured in the database)

---

## Project Architecture

```
Book_store/
├── Backend/            # Node.js/Express API
│   ├── config/         # Database & seeding logic
│   ├── controllers/    # AI & Business Logic
│   ├── middleware/     # Auth & Protection
│   └── database.json   # Flat JSON DB
└── Frontend/           # UI & Client Logic
    ├── admin.html      # Management Console
    ├── app.js          # AI & State Management
    └── styles.css      # Design System (Glassmorphic)
```

---

<div align="center">
  <sub>Built with ❤️ for the future of digital book retail.</sub>
</div>
