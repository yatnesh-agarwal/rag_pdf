const express = require("express")
const router = express.Router()
const question = require("../controllers/question.controller")

router.use("/ask",question)
router.delete("/clear-chat", (_req, res) => {
    return res.status(200).json({ message: "Chat cleared." })
})

module.exports = router
