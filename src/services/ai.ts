import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initializing the official, stable Google Gen AI Client SDK instance
const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export class AIService {
  /**
   * Generates a 768-dimensional vector matrix array from a text block
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    const response = await aiClient.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });
    
    if (!response.embedding?.values) {
      throw new Error('Failed to generate context vectors.');
    }
    return response.embedding.values;
  }

  /**
   * Synthesizes an answer using retrieved document contexts
   */
  static async generateAnswer(query: string, contexts: string[]): Promise<string> {
    const formattedContext = contexts.join('\n\n---\n\n');
    
    const prompt = `You are an expert AI system architect. Answer the user query using ONLY the provided document context fragments. If the answer cannot be confidently derived, state that explicitly.

Context:
${formattedContext}

User Query: ${query}
Answer:`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'No generation produced.';
  }
}
