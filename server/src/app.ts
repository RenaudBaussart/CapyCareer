import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './modules/auth/auth.route';
const app = express();




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route de test pour vérifier que l'API fonctionne correctement
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'API Job Aggregator fonctionnelle' });
});

app.use('/api/auth', authRouter);

export default app;