const mongoose = require("mongoose")
const Author = require("../models/author")
const Book = require("../models/book")

const genres = ["Fiction", "Non-Fiction", "Science", "History", "Technology"]

const createBook = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body is empty"
            })
        }

        const { title, author, isbn, genre, publishedYear, available } = req.body

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Book title is required"
            })
        }

        if (!author) {
            return res.status(400).json({
                success: false,
                message: "Author is required"
            })
        }

        if (!mongoose.isValidObjectId(author)) {
            return res.status(400).json({
                success: false,
                message: "Author ID format is not valid"
            })
        }

        if (!isbn || !isbn.trim()) {
            return res.status(400).json({
                success: false,
                message: "ISBN is required"
            })
        }

        if (genre !== undefined && !genres.includes(genre)) {
            return res.status(400).json({
                success: false,
                message: "Genre is not valid"
            })
        }

        if (publishedYear !== undefined && (typeof publishedYear !== "number" || publishedYear < 1000 || publishedYear > new Date().getFullYear())) {
            return res.status(400).json({
                success: false,
                message: "Published year is not valid"
            })
        }

        const found = await Author.findById(author)

        if (!found) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            })
        }

        const book = await Book.create({
            title: title.trim(),
            author,
            isbn: isbn.trim(),
            genre,
            publishedYear,
            available
        })

        const data = await Book.findById(book._id).populate("author")

        return res.status(201).json({
            success: true,
            message: "Book created successfully",
            book: data
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "ISBN already exists"
            })
        }

        console.log(err)

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getAllBooks = async (req, res) => {
    try {
        const { genre, author, available, search } = req.query
        const filter = {}

        if (genre) filter.genre = genre
        if (author) filter.author = author
        if (available !== undefined) filter.available = available === "true"

        if (search && search.trim()) {
            filter.title = { $regex: search.trim(), $options: "i" }
        }

        const books = await Book.find(filter).populate("author")

        return res.status(200).json({
            success: true,
            books
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getBook = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Book ID format is not valid"
            })
        }

        const book = await Book.findById(req.params.id).populate("author")

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            })
        }

        return res.status(200).json({
            success: true,
            book
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateBook = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Book ID format is not valid"
            })
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body is empty"
            })
        }

        const { title, author, isbn, genre, publishedYear, available } = req.body

        if (title !== undefined && !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Book title cannot be empty"
            })
        }

        if (isbn !== undefined && !isbn.trim()) {
            return res.status(400).json({
                success: false,
                message: "ISBN cannot be empty"
            })
        }

        if (genre !== undefined && !genres.includes(genre)) {
            return res.status(400).json({
                success: false,
                message: "Genre is not valid"
            })
        }

        if (publishedYear !== undefined && (typeof publishedYear !== "number" || publishedYear < 1000 || publishedYear > new Date().getFullYear())) {
            return res.status(400).json({
                success: false,
                message: "Published year is not valid"
            })
        }

        if (author !== undefined) {
            if (!mongoose.isValidObjectId(author)) {
                return res.status(400).json({
                    success: false,
                    message: "Author ID format is not valid"
                })
            }

            const found = await Author.findById(author)

            if (!found) {
                return res.status(404).json({
                    success: false,
                    message: "Author not found"
                })
            }
        }

        const data = {}
        if (title !== undefined) data.title = title.trim()
        if (author !== undefined) data.author = author
        if (isbn !== undefined) data.isbn = isbn.trim()
        if (genre !== undefined) data.genre = genre
        if (publishedYear !== undefined) data.publishedYear = publishedYear
        if (available !== undefined) data.available = available

        const book = await Book.findByIdAndUpdate(req.params.id, data, { new: true }).populate("author")

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            book
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "ISBN already exists"
            })
        }

        console.log(err)

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const deleteBook = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Book ID format is not valid"
            })
        }

        const book = await Book.findByIdAndDelete(req.params.id)

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getBook,
    updateBook,
    deleteBook
}
