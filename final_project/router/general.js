const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Đăng ký user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
      if (!isValid(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "Customer successfully registered. Now you can login."});
      } else {
          return res.status(409).json({message: "User already exists!"});
      }
  }
  return res.status(400).json({message: "Username and password are required to register."});
});

// TASK 10: Lấy tất cả sách dùng Promise callbacks
public_users.get('/', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    resolve(books);
  });
  
  myPromise.then((result) => {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching books"});
  });
});

// TASK 11: Lấy sách theo ISBN dùng Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve, reject) => {
    if (books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
  });

  myPromise.then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});

// TASK 12: Lấy sách theo Tác giả dùng Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let myPromise = new Promise((resolve, reject) => {
    let filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
        resolve(filteredBooks);
    } else {
        reject("Author not found");
    }
  });

  myPromise.then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});

// TASK 13: Lấy sách theo Tiêu đề dùng Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let myPromise = new Promise((resolve, reject) => {
    let filteredBooks = Object.values(books).filter(book => book.title === title);
    if (filteredBooks.length > 0) {
        resolve(filteredBooks);
    } else {
        reject("Title not found");
    }
  });

  myPromise.then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});

// TASK 5: Lấy review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;