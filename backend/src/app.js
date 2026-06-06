const express = require("express")
const cors = require("cors")

const uploadPDF = require("./routes/uploadPDF.route")
const askQuestion = require("./routes/question.route")

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
}));

app.use("/api/",uploadPDF)
app.use("/api",askQuestion)



module.exports = app
