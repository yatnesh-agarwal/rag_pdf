const ollama = require("ollama").default
const chunkText = require("./chunkText.service")

async function createEmbedding(text) {
  try{
    const single = await ollama.embed({
      model: 'nomic-embed-text',
      input: text
    })
    return (single.embeddings[0])
  }
  catch(err){
    console.log("Error while embedding chunks",err)
  }
}

module.exports = createEmbedding