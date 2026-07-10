import app from './app';
import './config/database'; 

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// ce fichier est le point d'entrée de l'application. Il importe l'application Express depuis app.ts et la configuration de la base de données depuis database.ts. 
// Ensuite, il démarre le serveur sur le port spécifié dans les variables d'environnement ou sur le port XXXX par défaut.