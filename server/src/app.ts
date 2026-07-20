import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './modules/auth/auth.route';
import jobOfferRouter from './modules/job_offers/job.offers.route';
import swaggerUi from "swagger-ui-express";
import { generateOpenAPI } from "./swagger";
import { errorHandlerMiddleware } from './core/errors/errorHandlerMiddleware';
const app = express();

const openApiDocument = generateOpenAPI();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route de test pour vérifier que l'API fonctionne correctement
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'API Job Aggregator fonctionnelle' });
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobOfferRouter); // Enregistrement des routes pour les offres d'emploi

app.use(errorHandlerMiddleware);

export default app;