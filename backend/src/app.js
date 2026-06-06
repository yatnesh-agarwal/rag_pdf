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
const allowedOriginRegexes = (process.env.CORS_ORIGIN_REGEX || "")
    .split(",")
    .map((pattern) => pattern.trim())
    .filter(Boolean)
    .map((pattern) => new RegExp(pattern))

const isOriginAllowed = (origin) => {
    if (!origin) {
        return true
    }

    if (allowedOrigins.includes(origin)) {
        return true
    }

    return allowedOriginRegexes.some((pattern) => pattern.test(origin))
}

app.use(express.json())
app.use(cors({
    origin(origin, callback) {
        if (isOriginAllowed(origin)) {
            return callback(null, true)
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS`))
    },
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
}));

app.use("/api/",uploadPDF)
app.use("/api",askQuestion)
app.get("/api/health", (_req, res) => {
    return res.status(200).json({ ok: true })
})



module.exports = app
