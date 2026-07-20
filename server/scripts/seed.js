// fichier script pour executer seed.sql sur bdd

// import
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// fonction qui execute le seeding
async function runSeed() {
    console.log("Démarrage du script de seeding...");

    // connexion bdd ovh
    const connection = await mysql.createConnection({
        host: process.env.OVH_DB_HOST,
        user: process.env.OVH_DB_USER,
        password: process.env.OVH_DB_PASSWORD,
        database: process.env.OVH_DB_NAME,
        port: process.env.OVH_DB_PORT,
        multipleStatements: true
    });

    try {
        // recupere le chemin du fichier sql
        const sqlFilePath = path.join(__dirname, '../src/core/seed.sql');
        
        console.log(`Lecture du fichier SQL : ${sqlFilePath}`);
        // lit le contenu du fichier
        const sqlQuery = fs.readFileSync(sqlFilePath, 'utf-8');

        // envoie la requete a la bdd
        console.log("Envoi des données vers la base OVH...");
        await connection.query(sqlQuery);

        console.log("Seeding terminé avec succès");

    } catch (error) {
        console.error("Erreur pendant le seeding :", error);
    } finally {
        // ferme la co
        await connection.end();
    }
}

runSeed();