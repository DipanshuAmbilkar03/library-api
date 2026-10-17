require("dotenv").config()

const express = require("express")
const connectDB = require("./config/db")
const authorRouter = require("./routes/author.router")
const bookRouter = require("./routes/book.router")

const app = express()

app.use(express.json())

app.use("/api/authors", authorRouter)
app.use("/api/books", bookRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("Server is running on PORT " + PORT)
    connectDB()
})
