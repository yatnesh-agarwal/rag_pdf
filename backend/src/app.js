require("dotenv").config()
const express = require("express")
const cors = require("cors")

const uploadPDF = require("./routes/uploadPDF.route")
const askQuestion = require("./routes/question.route")
const clearChat = require("./routes/clearChat.route")

const app = express()
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(express.json())
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "x-session-id"],
}));

app.use("/api",uploadPDF)
app.use("/api",askQuestion)
app.use("/api",clearChat)



module.exports = app
