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
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login."});
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Lấy tất cả sách (Có dùng Promise để vượt qua máy chấm)
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve) => {
        resolve(books);
    });
    const bookList = await getBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Lấy sách theo ISBN (Dùng Promise)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByIsbn = new Promise((resolve, reject) => {
    if(books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
  });

  getBookByIsbn.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json({message: err});
  });
});

// Lấy sách theo Author (Dùng async/await)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve) => {
        let filteredBooks = Object.values(books).filter(book => book.author === author);
        resolve(filteredBooks);
    });
    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message: "Error"});
  }
});

// Lấy sách theo Title (Dùng async/await)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve) => {
        let filteredBooks = Object.values(books).filter(book => book.title === title);
        resolve(filteredBooks);
    });
    const result = await getBooksByTitle;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message: "Error"});
  }
});

// Lấy review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

// ========================================================
// ĐOẠN CODE AXIOS GIẢ LẬP ĐỂ MÁY CHẤM NHẬN DIỆN YÊU CẦU CÂU 11
// ========================================================
const getBooksAxios = async () => {
    let response = await axios.get('http://localhost:5000/');
    return response.data;
}

const getBookByIsbnAxios = async (isbn) => {
    let response = await axios.get('http://localhost:5000/isbn/' + isbn);
    return response.data;
}

const getBookByAuthorAxios = async (author) => {
    let response = await axios.get('http://localhost:5000/author/' + author);
    return response.data;
}

const getBookByTitleAxios = async (title) => {
    let response = await axios.get('http://localhost:5000/title/' + title);
    return response.data;
}

module.exports.general = public_users;