import request from "supertest";
import express from "express";
import { getJobOffers } from "./job.offers.controller";
import { pool } from "../../config/database";

// je crée une application express dédiée uniquement à exécuter notre route pour le test
const app = express();
app.get("/api/jobs", getJobOffers);

// je mock le module de base de données pour éviter de toucher à la vraie base MySQL
jest.mock("../../config/database", () => ({
    pool: {
        query: jest.fn()
    }
}));

describe("GET /api/jobs (Tests avec Mock)", () => {
    
    beforeEach(() => {
        // je nettoie les mocks entre chaque test pour éviter les effets de bord
        jest.clearAllMocks();
    });

    it("je dois renvoyer is_the_end à true quand la base renvoie moins de 51 offres", async () => {
        // je simule un retour de base avec 2 offres d'emploi
        const fakeRows = [
            { PK_content_hash: "hash1", name: "Développeur Fullstack" },
            { PK_content_hash: "hash2", name: "Développeur Laravel" }
        ];
        
        // je force le mock de pool.query à renvoyer mes fausses données
        (pool.query as jest.Mock).mockResolvedValueOnce([fakeRows, []]);

        const response = await request(app).get("/api/jobs?page=1");

        expect(response.status).toBe(200);
        expect(response.body.is_the_end).toBe(true);
        expect(response.body.job_offers).toHaveLength(2);
        expect(response.body.job_offers[0].name).toBe("Développeur Fullstack");
    });

    it("je devez renvoyer is_the_end à false et retirer la 51ème offre quand il y a une page suivante", async () => {
        // je génère un faux tableau de 51 offres identiques pour le test
        const fakeRows = Array(51).fill({
            PK_content_hash: "hash_test",
            name: "Développeur Node.js"
        });

        (pool.query as jest.Mock).mockResolvedValueOnce([fakeRows, []]);

        const response = await request(app).get("/api/jobs?page=1");

        expect(response.status).toBe(200);
        // je vérifie que le controller détecte qu'il y a une suite
        expect(response.body.is_the_end).toBe(false);
        // je m'assure que la 51ème offre bonus a bien été retirée de la réponse
        expect(response.body.job_offers).toHaveLength(50);
    });
});