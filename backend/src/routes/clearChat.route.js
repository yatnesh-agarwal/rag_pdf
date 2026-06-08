const express = require("express")
const router = express.Router()
const clearSession = require("../controllers/clearSession.controller")

router.delete("/clear-chat",clearSession)

module.exports = router