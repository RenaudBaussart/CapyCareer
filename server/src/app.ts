import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// route de test pour vérifier que l'API fonctionne correctement
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'API Job Aggregator fonctionnelle' });
});

export default app;