const getIndex = require("../services/pinecone.service")
const { getSessionId } = require("../utils/session.util")

async function clearSession(req,res) {
    try{
        const sessionId = getSessionId(req)
        const idx = getIndex(sessionId)

        await idx.deleteAll()
        return res.status(200).json({
            message: "Session Deleted Succesfully"
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            message: "Error while deleting session"
        })
    }
}
module.exports = clearSession
