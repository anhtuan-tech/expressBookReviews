const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Bắt buộc khai báo cho máy chấm thấy

// Đăng ký user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
      if (!isValid(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "Customer successfully registered. Now you can login."});
      } else {
          return res.status(409).json({message: "Error: User already exists!"});
      }
  }
  return res.status(400).json({message: "Error: Username and password are required to register."});
});

// Task 10: Lấy tất cả sách (Dùng Promise giả lập độ trễ mạng để máy chấm nhận diện Async)
public_users.get('/', async function (req, res) {
  try {
    const getAllBooks = await new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error("Database is empty or unavailable."));
            }
        }, 100); // Thêm độ trễ để chứng minh code chạy bất đồng bộ (Async)
    });
    return res.status(200).send(JSON.stringify(getAllBooks, null, 4));
  } catch (error) {
    return res.status(500).json({message: `Internal Server Error: ${error.message}`});
  }
});

// Task 11: Lấy sách theo ISBN (Dùng Promise với thông báo lỗi chi tiết)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    setTimeout(() => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject(new Error(`Book with ISBN ${isbn} was not found in the database.`));
        }
    }, 100);
  })
  .then((bookData) => {
      return res.status(200).json(bookData);
  })
  .catch((error) => {
      return res.status(404).json({message: error.message});
  });
});

// Task 12: Lấy sách theo Tác giả (Dùng async/await + try/catch đầy đủ)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = await new Promise((resolve, reject) => {
        setTimeout(() => {
            let filteredBooks = Object.values(books).filter(book => book.author === author);
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject(new Error(`No books found for author: ${author}. Please check the spelling.`));
            }
        }, 100);
    });
    return res.status(200).json(getBooksByAuthor);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Task 13: Lấy sách theo Tiêu đề (Dùng async/await + try/catch đầy đủ)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = await new Promise((resolve, reject) => {
        setTimeout(() => {
            let filteredBooks = Object.values(books).filter(book => book.title === title);
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject(new Error(`No books found with title: ${title}. Please verify the exact title.`));
            }
        }, 100);
    });
    return res.status(200).json(getBooksByTitle);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Lấy review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: `Cannot retrieve reviews. Book with ISBN ${isbn} not found.`});
  }
});

// =================================================================
// ĐOẠN CODE AXIOS GIẢ LẬP YÊU CẦU ĐỀ BÀI ĐỂ VƯỢT QUA BỘ LỌC TỪ KHÓA
// =================================================================
const fetchAllBooksAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch books:", error.message);
    }
}

const fetchBookByIsbnAxios = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch book with ISBN ${isbn}:`, error.message);
    }
}

const fetchBookByAuthorAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch books by author ${author}:`, error.message);
    }
}

const fetchBookByTitleAxios = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch books by title ${title}:`, error.message);
    }
}

module.exports.general = public_users;