//fichier de configuration pour la connexion à la base de données MySQL OVH
import mysql from 'mysql2/promise';
import { env } from './env';

// Crée un pool de connexions MySQL OVH
export const pool = mysql.createPool({
  host: env.OVH_DB_HOST,
  user: env.OVH_DB_USER,
  password: env.OVH_DB_PASSWORD,
  database: env.OVH_DB_NAME,
  port: env.OVH_DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste la connexion à la base de données MySQL OVH au démarrage du serveur
pool.getConnection()
    .then(connection => {
        console.log('Connexion à la base de données MySQL OVH réussie');
        connection.release();
    })
    .catch(err => {
        console.error('Échec de la connexion MySQL:', err.message);
        process.exit(1);
    });
