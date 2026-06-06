const ollama = require("ollama").default

async function askLlm(context, question) {
    const response = await ollama.chat({
        model: 'llama3:latest',
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