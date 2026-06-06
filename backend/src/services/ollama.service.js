require("dotenv").config()
const ollama = require("ollama").default
const OpenAI = require("openai")

const provider = process.env.LLM_PROVIDER || "ollama"
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null

async function askLlm(context, question) {
    if (provider === "openai") {
        if (!openai) {
            throw new Error("OPENAI_API_KEY is required when LLM_PROVIDER=openai")
        }

        const response = await openai.responses.create({
            model: process.env.OPENAI_CHAT_MODEL || "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: `Answer only from the provided context. If the answer is not in the context, say that clearly.\n\nContext:\n${context}`
                },
                {
                    role: "user",
                    content: question
                }
            ]
        })

        return response.output_text
    }

    const response = await ollama.chat({
        model: process.env.OLLAMA_CHAT_MODEL || 'llama3:latest',
        messages: [
            {
                role: 'system', 
                content: `answer only from provided context ${context}`
            },
            {
                role: "user",
                content: question
            }
        ],
    })
    return response.message.content

}

module.exports = askLlm
