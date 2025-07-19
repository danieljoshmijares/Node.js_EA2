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
  { id: 1, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', price: 24.99 },
  { id: 2, title: 'You Don\'t Know JS', author: 'Kyle Simpson', price: 29.99 },
  { id: 3, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', price: 19.95 },
  { id: 4, title: 'Designing Web APIs', author: 'Brenda Jin', price: 34.99 },
  { id: 5, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 27.50 },
  { id: 6, title: 'Clean Code', author: 'Robert C. Martin', price: 32.75 },
  { id: 7, title: 'Node.js Design Patterns', author: 'Mario Casciaro', price: 39.99 },
  { id: 8, title: 'CSS Secrets', author: 'Lea Verou', price: 28.95 }
]; 

// Routes
app.get('/', (req, res) => {
  res.render('home', { 
    books: books,
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