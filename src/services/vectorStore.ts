import { supabase } from '../config/supabase';
import { AIService } from './ai';

export class VectorStoreService {
  /**
   * Chunks documentation text blocks, creates embeddings, and saves to pgvector
   */
  static async ingestDocument(content: string, metadata: object = {}) {
    // Basic structural chunking strategy (by paragraphs or structural boundaries)
    const chunks = content.split('\n\n').filter(c => c.trim().length > 10);

    for (const chunk of chunks) {
      const embedding = await AIService.generateEmbedding(chunk);

      const { error } = await supabase.from('documents').insert({
        content: chunk,
        embedding,
        metadata
      });

      if (error) throw error;
    }
    return chunks.length;
  }

  /**
   * Queries the database using the cosine vector similarity math function
   */
  static async retrieveRelevantContexts(query: string, limit = 3): Promise<string[]> {
    const queryEmbedding = await AIService.generateEmbedding(query);

    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.3, // Filters out mathematically irrelevant segments
      match_count: limit
    });

    if (error) throw error;
    return (data || []).map((doc: any) => doc.content);
  }
}
