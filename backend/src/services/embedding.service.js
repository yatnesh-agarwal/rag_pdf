require("dotenv").config()
const ollama = require("ollama").default
const OpenAI = require("openai")

const provider = process.env.LLM_PROVIDER || "ollama"
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

async function createEmbedding(text) {
  try{
    if (provider === "openai") {
      if (!openai) {
        throw new Error("OPENAI_API_KEY is required when LLM_PROVIDER=openai")
      }

      const response = await openai.embeddings.create({
        model: process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small",
        input: text,
      })

      return response.data[0].embedding
    }

    const single = await ollama.embed({
      model: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',
      input: text
    })
    return (single.embeddings[0])
  }
  catch(err){
    console.log("Error while embedding chunks",err)
  }
}

module.exports = createEmbedding
