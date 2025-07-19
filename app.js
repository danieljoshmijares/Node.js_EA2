const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

// Session middleware must come first
app.use(session({
  secret: 'your_secret_key_123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize cart for all requests
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

// Make cart available to all templates
app.use((req, res, next) => {
  res.locals.cart = req.session.cart;
  next();
});

// Sample book data
const books = [
  { id: 1, title: 'The Great Gatsby', price: 12.99 },
  { id: 2, title: 'To Kill a Mockingbird', price: 10.50 },
  { id: 3, title: '1984', price: 8.75 },
  { id: 4, title: 'Pride and Prejudice', price: 9.99 }
];

// Routes
app.get('/', (req, res) => {
  res.render('home', { 
    books: books.slice(0, 3),
    cart: req.session.cart  // Explicitly pass cart
  });
});

app.get('/books', (req, res) => {
  res.render('books', { 
    books,
    cart: req.session.cart  // Explicitly pass cart
  });
});

app.post('/add-to-cart', (req, res) => {
  const bookId = parseInt(req.body.bookId);
  const book = books.find(b => b.id === bookId);
  
  if (book) {
    req.session.cart.push(book);
  }
  res.redirect('/books');
});

app.get('/cart', (req, res) => {
  const total = req.session.cart.reduce((sum, item) => sum + item.price, 0);
  res.render('cart', { 
    cart: req.session.cart,
    total 
  });
});

app.post('/buy', (req, res) => {
  req.session.cart = [];
  res.redirect('/cart');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});