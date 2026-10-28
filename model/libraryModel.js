const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is mandatory'],
      trim: true
    },
    author: {
      type: String,
      default: 'Unknown Author',
      trim: true
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    availability: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'lastModified'
    }
  }
);

const Book = mongoose.model('Book', librarySchema);

module.exports = Book;