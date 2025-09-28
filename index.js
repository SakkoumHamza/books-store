import express from 'express';
import 'dotenv/config';
import DAO from './dao.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- Middleware --------------------
app.use(cors({ origin: 'http://localhost:4200' })); // restrict to Angular dev server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- Initialize DB --------------------
DAO.init().catch(err => {
  console.error("Failed to initialize DB:", err);
  process.exit(1);
});

// -------------------- Routes --------------------

// Health check
app.get('/', (req, res) => {
  res.send({ version: '1.0.0' });
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await DAO.Book.find();
    if (!books || books.length === 0) return res.status(404).send("No books found");
    res.send(books);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get book by name or ID
app.get('/books/:query', async (req, res) => {
  try {
    const query = req.params.query;

    // Try to find by exact ID first
    let book = await DAO.Book.findOne({ id: query });

    // If not found by ID, try title search (case-insensitive)
    if (!book) {
      book = await DAO.Book.findOne({ title: new RegExp(query, "i") });
    }

    if (!book) return res.status(404).send("Book not found");
    res.send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Add a favorite
app.post('/favorites', async (req, res) => {
  try {
    const favorite = new DAO.Favorite(req.body);
    await favorite.save();
    res.send({ message: 'Favorite added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add favorite");
  }
});

// Get all favorites
app.get('/favorites', async (req, res) => {
  try {
    const favorites = await DAO.Favorite.find();
    if (!favorites || favorites.length === 0) return res.status(404).send("No favorites found");
    res.send(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// -------------------- Start server --------------------
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
