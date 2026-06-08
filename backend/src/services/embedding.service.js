require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function createEmbedding(text) {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001", // or gemini-embedding-2 if available in your account
      contents: text,
    });

    return response.embeddings[0].values;
  } catch (err) {
    console.error("Error while embedding chunks:", err);
    throw err;
  }
}

module.exports = createEmbedding;






















// require("dotenv").config()
// const Groq = require("groq-sdk")
// // const ollama = require("ollama").default
// // const OpenAI = require("openai")

// // const provider = process.env.LLM_PROVIDER || "ollama"
// // const openai = process.env.OPENAI_API_KEY
// //   ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
// //   : null
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });
// async function createEmbedding(text) {
//   try{
//     if (provider === "openai") {
//       if (!openai) {
//         throw new Error("OPENAI_API_KEY is required when LLM_PROVIDER=openai")
//       }

//       const response = await openai.embeddings.create({
//         model: process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small",
//         input: text,
//       })

//       return response.data[0].embedding
//     }

//     const single = await ollama.embed({
//       model: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',
//       input: text
//     })
//     return (single.embeddings[0])
//   }
//   catch(err){
//     console.log("Error while embedding chunks",err)
//   }
// }

// module.exports = createEmbedding
