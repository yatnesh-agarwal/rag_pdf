require("dotenv").config()
const {Pinecone} = require("@pinecone-database/pinecone")

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API
})

const baseIndex = pc.index(process.env.PINECONE_INDEX_NAME)

function getIndex(sessionId) {
    if (!sessionId) {
        return baseIndex
    }

    return baseIndex.namespace(sessionId)
}

module.exports = getIndex
