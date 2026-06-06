const express = require("express")
const router = express.Router()
const question = require("../controllers/question.controller")

router.use("/ask",question)

module.exports = router