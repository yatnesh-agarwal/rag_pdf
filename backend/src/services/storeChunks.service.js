const createEmbedding = require("./embedding.service")
const getIndex = require("./pinecone.service")

async function storeChunks(chunks, pdfName, sessionId, documentId) {
    const index = getIndex(sessionId)
    const safePdfName = pdfName.replace(/[^a-zA-Z0-9-_]/g, "_")
    const safeDocumentId = (documentId || safePdfName).replace(/[^a-zA-Z0-9-_]/g, "_")

    for (let i = 0; i < chunks.length; i++){
        const vector = await createEmbedding(chunks[i].text)

        await index.upsert({ records: [{ id: `${safePdfName}-${safeDocumentId}-chunk-${i}`, values: Array.from(vector),metadata:  {
                text: chunks[i].text,
                pdfName: pdfName,
                documentId,
                startPage: chunks[i].startPage,
                endPage: chunks[i].endPage,
                section: `Page ${chunks[i].startPage}`
                } }] })

    }
}

module.exports = storeChunks
