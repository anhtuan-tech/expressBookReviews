const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Thêm dòng này

// Đăng ký user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login."});
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Lấy tất cả sách
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Lấy sách theo ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Lấy sách theo Author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filteredBooks = Object.values(books).filter(book => book.author === author);
  return res.status(200).json(filteredBooks);
});

// Lấy sách theo Title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = Object.values(books).filter(book => book.title === title);
  return res.status(200).json(filteredBooks);
});

// Lấy review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;