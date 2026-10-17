const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    genre: {
        type: String,
        enum: ["Fiction", "Non-Fiction", "Science", "History", "Technology"]
    },
    publishedYear: {
        type: Number,
        min: 1000,
        max: new Date().getFullYear()
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Book", bookSchema)
