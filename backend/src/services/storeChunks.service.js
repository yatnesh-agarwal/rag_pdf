const createEmbedding = require("./embedding.service")
const getIndex = require("./pinecone.service")

async function storeChunks(chunks, pdfName, sessionId) {
    const index = getIndex(sessionId)

    for (let i = 0; i < chunks.length; i++){
        const vector = await createEmbedding(chunks[i].text)
        const safePdfName = pdfName.replace(/[^a-zA-Z0-9-_]/g, "_")

        await index.upsert({ records: [{ id: `${safePdfName}-chunk-${i}`, values: Array.from(vector),metadata:  {
                text: chunks[i].text,
                pdfName: pdfName,
                startPage: chunks[i].startPage,
                endPage: chunks[i].endPage,
                section: `Page ${chunks[i].startPage}`
                } }] })

    }
}

module.exports = storeChunks
