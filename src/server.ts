import express from 'express';
import dotenv from 'dotenv';
import ragRoutes from './routes/rag';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Bind API Routing pipelines
app.use('/api/rag', ragRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', architecture: 'pgvector-RAG-engine' });
});

app.listen(PORT, () => {
  console.log(`🚀 Native Vector RAG Engine successfully initialized running on port ${PORT}`);
});
