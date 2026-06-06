const createEmbedding = require("./embedding.service")

const getIndex = require("./pinecone.service")

async function searchChunks(question, sessionId) {
    const queryVector = await createEmbedding(question)
    const index = getIndex(sessionId)
    const results = await index.query({
        vector: queryVector,
        topK: 3,
        includeMetadata: true
    })
    return results.matches
}

module.exports = searchChunks
