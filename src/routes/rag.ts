import { Router, Request, Response } from 'express';
import { VectorStoreService } from '../services/vectorStore';
import { AIService } from '../services/ai';

const router = Router();

// Endpoint to ingest raw knowledge data dumps into pgvector
router.post('/ingest', async (req: Request, res: Response): Promise<any> => {
  try {
    const { content, metadata } = req.body;
    if (!content) return res.status(400).json({ error: 'Missing content body payload.' });

    const totalChunks = await VectorStoreService.ingestDocument(content, metadata);
    return res.status(201).json({ message: 'Document ingested successfully.', chunks: totalChunks });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Primary RAG query execution pipeline endpoint
router.post('/query', async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing user inquiry string.' });

    // Step 1: Semantic Context Retrieval from database
    const contextFragments = await VectorStoreService.retrieveRelevantContexts(query);
    
    if (contextFragments.length === 0) {
      return res.status(200).json({ answer: 'No relevant domain-specific knowledge fragments were found.' });
    }

    // Step 2: Synthesis generation utilizing context vectors
    const answer = await AIService.generateAnswer(query, contextFragments);

    return res.status(200).json({ answer, retrievedContexts: contextFragments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
