require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Book = require('./model/libraryModel.js');

const server = express();

server.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Library database connected'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });

server.post('/api/books', async (req, res) => {
  try {
    const { title, author, category } = req.body;

    if (!title) {
      return res.status(400).json({
        message: 'Please provide a book title'
      });
    }

    const book = new Book({
      title,
      author,
      category
    });

    await book.save();

    return res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
});

server.get('/api/books', async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 5;
    const offset = (pageNumber - 1) * pageSize;

    const [results, count] = await Promise.all([
      Book.find().skip(offset).limit(pageSize),
      Book.countDocuments()
    ]);

    return res.status(200).json({
      currentPage: pageNumber,
      totalRecords: count,
      books: results
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
});

server.patch('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    const result = await Book.findByIdAndUpdate(
      id,
      { availability },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      message: 'Book availability changed successfully',
      book: result
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});