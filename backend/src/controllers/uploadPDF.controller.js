const chunkText = require("../services/chunkText.service")
const parsePDF = require("../services/parsePDF.service")
const storeChunks = require("../services/storeChunks.service")
const { getSessionId } = require("../utils/session.util")

async function uploadPDFController(req,res) {
    try{
        const sessionId = getSessionId(req)
        const files = req.files?.length ? req.files : req.file ? [req.file] : []

        if (!files.length) {
            return res.status(400).json({
                message: "No PDF files were uploaded."
            })
        }

        for (const file of files) {
            const pages = await parsePDF(file.path)
            const chunks = chunkText(pages)

            console.log(`Total Chunks for ${file.originalname}:`, chunks.length)
            await storeChunks(chunks, file.originalname, sessionId)
        }

        return res.status(200).json({
            message: "PDF uploaded successfully!"
        })
    }
    catch(err){
        console.log("Error while uploading PDF",err)
        return res.status(500).json({
            message: "Unable to upload PDF files."
        })
    }
}

module.exports = uploadPDFController
