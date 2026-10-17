const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true
    },
    country: {
        type: String
    },
    bio: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Author", authorSchema)
