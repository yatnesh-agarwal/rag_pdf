const searchChunks = require("../services/userInput.service")
const askLlm = require("../services/ollama.service")
const { getSessionId } = require("../utils/session.util")

async function askController(req,res) {
    try{
        const {question} = req.body
        const sessionId = getSessionId(req)
        const matches = await searchChunks(question, sessionId)
        const context = matches
        .map(match => match.metadata.text)
        .join("\n\n")
        
        const answer = await askLlm(context, question)
        return res.status(200).json({
            message: answer,
            references: matches.map(match => ({
                id: match.id,
                documentName: match.metadata?.pdfName || "Unknown document",
                excerpt: match.metadata?.text?.slice(0, 180) || "",
                score: match.score,
                section: match.metadata?.section || null,
                startPage: match.metadata?.startPage || null,
                endPage: match.metadata?.endPage || null,
            }))
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

module.exports = askController
