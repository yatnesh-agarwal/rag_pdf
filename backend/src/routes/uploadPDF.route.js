const express = require("express")
const uploadPDFController = require("../controllers/uploadPDF.controller")
const multer = require("multer")

const router = express.Router()

const upload = multer({ dest: 'uploads/' })

router.post("/uploadPDF",upload.array("pdf"),uploadPDFController)

module.exports = router
