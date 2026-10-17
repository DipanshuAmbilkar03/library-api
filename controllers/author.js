const mongoose = require("mongoose")
const Author = require("../models/author")
const Book = require("../models/book")

const isEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const createAuthor = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body is empty"
            })
        }

        const { name, email, country, bio } = req.body

        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Author name is required and must be at least 2 characters"
            })
        }

        if (email && !isEmail(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Email format is not valid"
            })
        }

        const author = await Author.create({
            name: name.trim(),
            email: email ? email.trim().toLowerCase() : undefined,
            country,
            bio
        })

        return res.status(201).json({
            success: true,
            message: "Author created successfully",
            author
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            })
        }

        console.log(err)

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find()
        return res.status(200).json({
            success: true,
            authors
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getAuthor = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Author ID format is not valid"
            })
        }

        const author = await Author.findById(req.params.id)

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            })
        }

        return res.status(200).json({
            success: true,
            author
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getAuthorBooks = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Author ID format is not valid"
            })
        }

        const author = await Author.findById(req.params.id)

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            })
        }

        const books = await Book.find({ author: req.params.id }).populate("author")

        return res.status(200).json({
            success: true,
            author,
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

const updateAuthor = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Author ID format is not valid"
            })
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body is empty"
            })
        }

        const { name, email, country, bio } = req.body

        if (name !== undefined && name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Author name must be at least 2 characters"
            })
        }

        if (email !== undefined && email && !isEmail(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Email format is not valid"
            })
        }

        const data = {}
        if (name !== undefined) data.name = name.trim()
        if (email !== undefined) data.email = email ? email.trim().toLowerCase() : undefined
        if (country !== undefined) data.country = country
        if (bio !== undefined) data.bio = bio

        const author = await Author.findByIdAndUpdate(req.params.id, data, { new: true })

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Author updated successfully",
            author
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            })
        }

        console.log(err)

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const deleteAuthor = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Author ID format is not valid"
            })
        }

        const author = await Author.findById(req.params.id)

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            })
        }

        const books = await Book.countDocuments({ author: req.params.id })

        if (books > 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete this author because they still have books"
            })
        }

        await Author.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            success: true,
            message: "Author deleted successfully"
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
    createAuthor,
    getAllAuthors,
    getAuthor,
    getAuthorBooks,
    updateAuthor,
    deleteAuthor
}
