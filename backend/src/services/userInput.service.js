const createEmbedding = require("./embedding.service")

const index = require("./pinecone.service")

async function searchChunks(question) {
    const queryVector = await createEmbedding(question)
    const results = await index.query({
        vector: queryVector,
        topK: 3,
        includeMetadata: true
    })
    return results.matches
}

module.exports = searchChunks