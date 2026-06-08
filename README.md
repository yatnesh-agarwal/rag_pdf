# PDF Chat RAG App

A full-stack Retrieval-Augmented Generation app that lets users upload one or more PDF files, ask questions about them, and receive answers grounded in the uploaded content.

The project is split into:

- `frontend`: React + Vite client
- `backend`: Express API for upload, parsing, chunking, embeddings, vector search, and answer generation

Each browser session uses its own Pinecone namespace through the `x-session-id` header, so different users can use the deployed app without mixing their documents.

## What It Does

- Upload multiple PDF files
- Extract text page by page
- Split content into overlapping chunks
- Generate embeddings for chunks
- Store vectors in Pinecone
- Retrieve the most relevant chunks for a question
- Generate a final answer from retrieved context
- Keep uploaded-document context isolated per browser session

## Current Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS 4
- `lucide-react`

### Backend

- Node.js
- Express
- Multer for PDF uploads
- `pdf-parse` for text extraction
- Pinecone for vector storage
- Google Gemini embeddings via `@google/genai`
- Groq chat completions for answer generation

## How The Flow Works

1. The user uploads one or more PDFs from the frontend.
2. The backend parses each PDF into page-level text.
3. The text is chunked into overlapping sections.
4. Each chunk is embedded with Gemini embeddings.
5. The chunk vectors are stored in Pinecone under the current session namespace.
6. When the user asks a question, the backend embeds the question and searches Pinecone for the top matches.
7. The matched chunk text is passed to the LLM as context.
8. The backend returns the answer plus lightweight references for the UI.

## Project Structure

```text
rag_project/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       └── homePage/
└── vercel.json
```

## Environment Variables

There are no `.env.example` files in the repo right now, so create the files manually.

### Backend `.env`

Create `backend/.env`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
PINECONE_API=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

### Frontend `.env`

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Local Development

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:3000` by default.

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## API Endpoints

All routes are mounted under `/api`.

### `POST /api/uploadPDF`

Uploads one or more PDF files.

- Content type: `multipart/form-data`
- Form field: `pdf`
- Header used for session isolation: `x-session-id`

Example response:

```json
{
  "message": "PDF uploaded successfully!",
  "uploadedFiles": [
    {
      "documentId": "generated-document-id",
      "fileName": "example.pdf"
    }
  ]
}
```

### `POST /api/ask`

Asks a question against the currently uploaded PDFs for that session.

Request body:

```json
{
  "question": "What is the document about?"
}
```

Example response:

```json
{
  "message": "Answer from retrieved context",
  "references": [
    {
      "id": "chunk-id",
      "documentName": "example.pdf",
      "documentId": "generated-document-id",
      "excerpt": "Short excerpt from the chunk...",
      "score": 0.91,
      "section": "Page 2",
      "startPage": 2,
      "endPage": 2
    }
  ]
}
```

### `DELETE /api/clear-chat`

Deletes the current session namespace from Pinecone and clears the working document context for that session.

## Why `x-session-id` Is Used

The frontend generates a session ID and sends it in the `x-session-id` header. The backend uses that value as the Pinecone namespace.

That gives this app a simple isolation model:

- one browser session = one vector namespace
- one user's uploads do not mix with another user's uploads
- clearing a chat only clears that session's vectors

If no session ID is provided, the backend falls back to the base index, so the frontend should always send the header.

## CORS

`CORS_ORIGIN` controls which frontend origins are allowed to call the backend from a browser.

Examples:

- local development: `http://localhost:5173`
- deployed frontend: `https://your-frontend-domain.vercel.app`
- multiple origins: `http://localhost:5173,https://your-frontend-domain.vercel.app`

This matters because the frontend and backend are usually hosted on different domains in production.

## Deployment

### Recommended setup

- `frontend` on Vercel
- `backend` on Render or Railway
- `Pinecone` as the vector database
- `Groq` for answer generation
- `Gemini` for embeddings

### Why split the deployment

This project uses two different hosting roles well:

- Vercel is a good fit for the Vite frontend
- Render or Railway is a simpler fit for a persistent Express backend with file uploads and API routes

That is why deployment is usually split across both.

### Deploy the backend

1. Push the repo to GitHub.
2. Create a new web service on Render or Railway.
3. Set the root directory to `backend`.
4. Use:

```bash
npm install
npm start
```

5. Set backend environment variables:

```env
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
PINECONE_API=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

6. Copy the deployed backend URL, for example:

```text
https://your-backend.onrender.com
```

### Deploy the frontend

1. Create a new Vercel project from the same GitHub repo.
2. Set the root directory to `frontend`.
3. Add:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

4. Build using:

```bash
npm install
npm run build
```

5. Deploy and use the Vercel URL as the public app link.

## Notes

- The codebase includes commented-out alternate provider logic for Ollama and OpenAI, but the current active implementation uses Groq for chat responses and Gemini for embeddings.
- `vercel.json` includes an experimental multi-service setup, but the simplest production path for this repo is still frontend on Vercel and backend on Render or Railway.
- Uploaded files are stored temporarily by Multer in `backend/uploads/` during processing.

## Future Improvements

- Add `.env.example` files
- Validate file size and file type more strictly
- Stream answers to the UI
- Add document deletion by `documentId`
- Add tests for upload, retrieval, and session isolation
- Improve prompting so the model declines when context is missing

