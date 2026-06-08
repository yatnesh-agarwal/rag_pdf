require("dotenv").config()
const Groq = require("groq-sdk")
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
async function askLlm(context, question) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `answer only from provided context ${context}`,
      },
      {
            role: "user",
            content: question
        }
    ],
  });
  return completion.choices[0].message.content
  
}

module.exports = askLlm

// const ollama = require("ollama").default
// const OpenAI = require("openai")

// const provider = process.env.LLM_PROVIDER || "ollama"
// async function askLlm(context, question) {
//     const response = await ollama.chat({
//         model: process.env.OLLAMA_CHAT_MODEL || 'llama3:latest',
//         messages: [
//             {
//                 role: 'system', 
//                 content: `answer only from provided context ${context}`
//             },
//             {
//                 role: "user",
//                 content: question
//             }
//         ],
//     })
//     return response.message.content

// }

// module.exports = askLlm