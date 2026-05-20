# Context-Aware Native Vector Embeddings & RAG Engine

A production-ready, backend-focused architecture implementing a Retrieval-Augmented Generation (RAG) platform. The application reads custom knowledge documents, chunks data payloads, vectors them via Google Gen AI models, and uses native `pgvector` operators inside PostgreSQL to perform real-time semantic query processing.

---

## 🛠️ Core Capabilities

- **Native Database Search Calculations:** Sidesteps heavy, external abstract layers to perform mathematical vector search models utilizing the native `pgvector` cosine similarity operator (`<=>`).
- **Scalable Context Ingestion:** Automatically maps structural text segment blocks, generates high-density arrays (`text-embedding-004`), and maps precise application payloads.
- **Hierarchical Index Configuration:** Employs an HNSW vector database mapping structure allowing consistent sub-millisecond retrieval benchmarks across production volumes.
- **Secure Synthesis Pipelines:** Feeds context injections safely to modern LLM APIs to eliminate typical structural hallucinations completely.

---

## 🧪 API Verification & Interaction

### 1. Document Context Ingestion
**Endpoint:** `POST /api/rag/ingest`
```json
{
  "content": "PropelAI utilizes an advanced real-time geofencing logic system designed to run on structural PostgreSQL backends. Its architecture handles low-latency multi-tenant location telemetry arrays via specific Row Level Security (RLS) policies.",
  "metadata": { "category": "architecture-specs" }
}
