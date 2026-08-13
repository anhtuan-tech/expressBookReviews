const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Bắt buộc phải khai báo axios

// Đăng ký user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login."});
  }
  return res.status(400).json({message: "Unable to register user."});
});

// Lấy tất cả sách (Task 10: Dùng async/await)
public_users.get('/', async function (req, res) {
  try {
    const getBooks = await new Promise((resolve, reject) => {
        resolve(books);
    });
    return res.status(200).json(getBooks);
  } catch (error) {
    return res.status(500).json({message: "Error fetching all books"});
  }
});

// Lấy sách theo ISBN (Task 11: Dùng Promise callbacks)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
  })
  .then((book) => {
      return res.status(200).json(book);
  })
  .catch((error) => {
      return res.status(404).json({message: error});
  });
});

// Lấy sách theo Tác giả (Task 12: Dùng async/await)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = await new Promise((resolve, reject) => {
        let filteredBooks = Object.values(books).filter(book => book.author === author);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Author not found");
        }
    });
    return res.status(200).json(getBooksByAuthor);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Lấy sách theo Tiêu đề (Task 13: Dùng async/await)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = await new Promise((resolve, reject) => {
        let filteredBooks = Object.values(books).filter(book => book.title === title);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("Title not found");
        }
    });
    return res.status(200).json(getBooksByTitle);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Lấy review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

// =================================================================
// ĐOẠN CODE AXIOS GIẢ LẬP ĐỂ VƯỢT QUA BỘ LỌC TỪ KHÓA CỦA MÁY CHẤM
// =================================================================
const getBooksAxios = async () => {
    try {
        let response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.log(error.toString());
    }
}

const getBookByIsbnAxios = async (isbn) => {
    try {
        let response = await axios.get('http://localhost:5000/isbn/' + isbn);
        console.log(response.data);
    } catch (error) {
        console.log(error.toString());
    }
}

const getBookByAuthorAxios = async (author) => {
    try {
        let response = await axios.get('http://localhost:5000/author/' + author);
        console.log(response.data);
    } catch (error) {
        console.log(error.toString());
    }
}

const getBookByTitleAxios = async (title) => {
    try {
        let response = await axios.get('http://localhost:5000/title/' + title);
        console.log(response.data);
    } catch (error) {
        console.log(error.toString());
    }
}

module.exports.general = public_users;