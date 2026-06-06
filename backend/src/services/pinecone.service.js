require("dotenv").config()
const {Pinecone} = require("@pinecone-database/pinecone")

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API
})

const index = pc.index(process.env.PINECONE_INDEX_NAME)

module.exports = index