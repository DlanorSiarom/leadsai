import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Inicialização segura do SDK Gemini com telemetria
const geminiApiKey = process.env.GEMINI_API_KEY || '';
import placesHandler from './api/places/search.ts';

// Rota de busca oficial compatível tanto com Vercel Serverless Functions quanto com Express
app.all('/api/places/search', (req, res) => {
  return placesHandler(req, res);
});

// Em desenvolvimento, montar os middlewares do Vite
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve('dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LeadMaps Pro Server rodando na porta ${PORT}`);
});
