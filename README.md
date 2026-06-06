# PDF Chat RAG App

This project has:

- `frontend`: React + Vite UI
- `backend`: Express API for PDF upload, chunking, embeddings, vector search, and answers

Each browser session now uses its own Pinecone namespace, so multiple people can use the deployed app without mixing uploaded PDFs.

## Local run

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

If you use Ollama locally, keep:

```env
LLM_PROVIDER=ollama
```

Make sure Ollama is running and the models exist:

```bash
ollama pull llama3:latest
ollama pull nomic-embed-text
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

For local development, keep:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Public deployment

The easiest setup is:

- `frontend` on Vercel
- `backend` on Render or Railway
- `Pinecone` stays hosted in Pinecone
- `OpenAI` for production LLM + embeddings

### Important

Cloud hosts usually do not run your local Ollama setup, so for public deployment use:

```env
LLM_PROVIDER=openai
```

### Deploy backend

1. Push this repo to GitHub.
2. Create a new Web Service on Render or Railway.
3. Set the backend root directory to `backend`.
4. Use:

```bash
npm install
npm start
```

5. Add environment variables:

```env
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
CORS_ORIGIN_REGEX=^https://.*\.vercel\.app$
PINECONE_API=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
OPENAI_CHAT_MODEL=gpt-4.1-mini
OPENAI_EMBED_MODEL=text-embedding-3-small
```

6. After deploy, copy the backend URL, for example:

```txt
https://your-backend.onrender.com
```

`CORS_ORIGIN` is for your main frontend domain. `CORS_ORIGIN_REGEX` is helpful if you also want Vercel preview deployments to work without changing backend env vars every time.

### Deploy frontend

1. Create a new Vercel project from the same GitHub repo.
2. Set the root directory to `frontend`.
3. Add:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

4. Build settings:

```bash
npm install
npm run build
```

5. Deploy and open the Vercel URL.

If you deploy both `frontend` and `backend` together through this repo's `vercel.json`, the frontend can also use the co-deployed backend route:

```env
VITE_API_BASE_URL=
```

In that case the app falls back to `/_/backend` automatically in production.

## Share by link

After both deploy successfully, share the Vercel URL. Other people will use that frontend link, and it will call your deployed backend.

## Recommended architecture

- Frontend link for users: Vercel
- API: Render or Railway
- Vector database: Pinecone
- Model provider in production: OpenAI
