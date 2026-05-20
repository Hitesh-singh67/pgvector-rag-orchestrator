-- 1. Enable the pgvector extension to store high-dimensional math arrays
create extension if not exists vector;

-- 2. Create a table to house document chunks and their generated math coordinates
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(768), -- text-embedding-004 creates 768-dimensional output vectors
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create a matching function to perform low-latency semantic similarity search
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order habits documents.embedding <=> query_embedding asc
  limit match_count;
$$;

-- 4. Set an HNSW vector index for blistering fast database retrieval operations
create index on documents using hnsw (embedding vector_cosine_ops);
