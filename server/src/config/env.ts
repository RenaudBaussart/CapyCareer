import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// cible le dossier courant
const localEnvPath = path.resolve(process.cwd(), '.env');
// cible a la racine
const projectRootEnvPath = path.resolve(__dirname, '../../../.env');

// cible dynamiquement le path
// SI fichier dans dossier courant il est ciblé sinon cible a la racine
const envPath = fs.existsSync(localEnvPath) ? localEnvPath : projectRootEnvPath;

let envConfig = {};
try {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envConfig = envFile.split('\n').reduce((acc: { [key: string]: string }, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
} catch (error) {
  console.error("Could not read .env file:", error);
}

// zod schema pour valider les variables d'environnement
const envSchema = z.object({
  OVH_DB_HOST: z.string(),
  OVH_DB_USER: z.string(),
  OVH_DB_PASSWORD: z.string(),
  OVH_DB_NAME: z.string(),
  OVH_DB_PORT: z.string().transform(Number),


  ATTACK_DB_HOST: z.string(),
  ATTACK_DB_USER: z.string(),
  ATTACK_DB_PASSWORD: z.string(),
  ATTACK_DB_NAME: z.string(),
  ATTACK_DB_PORT: z.string().transform(Number),

  
  SERVER_PORT: z.string().transform(Number).optional().default(5000),

  // pour que zod accepte les url n8n
  N8N_REFRESH_JOB_OFFERS_WEBHOOK_URL: z.string().url(),

});

// Parse et valider les variables d'environnement
export const env = envSchema.parse(envConfig);