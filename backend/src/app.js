const express = require("express")
const cors = require("cors")
require("dotenv").config()

const uploadPDF = require("./routes/uploadPDF.route")
const askQuestion = require("./routes/question.route")

const app = express()
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(express.json())
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
}));

app.use("/api/",uploadPDF)
app.use("/api",askQuestion)
app.get("/api/health", (_req, res) => {
    return res.status(200).json({ ok: true })
})



module.exports = app
