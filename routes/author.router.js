const express = require("express")

const router = express.Router()

const { createAuthor, getAllAuthors, getAuthor, getAuthorBooks, updateAuthor, deleteAuthor } = require("../controllers/author")

router.post("/", createAuthor)
router.get("/", getAllAuthors)
router.get("/:id", getAuthor)
router.get("/:id/books", getAuthorBooks)
router.put("/:id", updateAuthor)
router.delete("/:id", deleteAuthor)

module.exports = router
