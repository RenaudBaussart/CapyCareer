import request from "supertest";
import express from "express";
import { getJobOffers, getJobOfferById, createJobOffer, updateJobOffer, deleteJobOffer, totalJobOffersCount, refreshJobOffers, getLastSyncDate } from "./job.offers.controller";
import { pool } from "../../config/database";
import { env } from "../../config/env";

const app = express();
app.use(express.json());
app.get("/api/jobs", getJobOffers);
app.get("/api/jobs/count", totalJobOffersCount);
app.post("/api/jobs/refresh", refreshJobOffers);
app.get("/api/jobs/last-sync", getLastSyncDate);
app.get("/api/jobs/:id", getJobOfferById);
app.post("/api/jobs", createJobOffer);
app.put("/api/jobs/:id", updateJobOffer);
app.delete("/api/jobs/:id", deleteJobOffer);

jest.mock("../../config/database", () => ({
    pool: {
        query: jest.fn(),
        execute: jest.fn()
    }
}));

// mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Job Offers API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/jobs", () => {
        it("should return is_the_end=true when less than 51 offers are returned", async () => {
            const fakeRows = [
                { PK_content_hash: "hash1", name: "Développeur Fullstack" },
                { PK_content_hash: "hash2", name: "Développeur Laravel" }
            ];
            (pool.query as jest.Mock).mockResolvedValueOnce([fakeRows, []]);

            const response = await request(app).get("/api/jobs?page=1");

            expect(response.status).toBe(200);
            expect(response.body.is_the_end).toBe(true);
            expect(response.body.job_offers).toHaveLength(2);
        });

        it("should return is_the_end=false and remove the 51st offer when there is a next page", async () => {
            const fakeRows = Array(51).fill({
                PK_content_hash: "hash_test",
                name: "Développeur Node.js"
            });
            (pool.query as jest.Mock).mockResolvedValueOnce([fakeRows, []]);

            const response = await request(app).get("/api/jobs?page=1");

            expect(response.status).toBe(200);
            expect(response.body.is_the_end).toBe(false);
            expect(response.body.job_offers).toHaveLength(50);
        });

        it("should correctly parse the 'tag' field into an array of strings", async () => {
            const fakeRows = [
                { PK_content_hash: "hash1", name: "Développeur Fullstack", tag: "VueJS, TypeScript, API NestJS" },
                { PK_content_hash: "hash2", name: "Développeur Backend", tag: "PHP, Symfony" },
                { PK_content_hash: "hash3", name: "DevOps", tag: null },
            ];
            (pool.query as jest.Mock).mockResolvedValueOnce([fakeRows, []]);

            const response = await request(app).get("/api/jobs?page=1");

            expect(response.status).toBe(200);
            expect(response.body.job_offers[0].tag).toEqual(["VueJS", "TypeScript", "API NestJS"]);
            expect(response.body.job_offers[1].tag).toEqual(["PHP", "Symfony"]);
            expect(response.body.job_offers[2].tag).toEqual([]);
        });
    });

    describe("GET /api/jobs/:id", () => {
        it("should return a single job offer when a valid ID is provided", async () => {
            const fakeOffer = { PK_id: 1, title: "Test Job", tag: "NodeJS, Express" };
            (pool.execute as jest.Mock).mockResolvedValueOnce([[fakeOffer], []]);

            const response = await request(app).get("/api/jobs/1");

            expect(response.status).toBe(200);
            expect(response.body.title).toBe("Test Job");
            expect(response.body.tag).toEqual(["NodeJS", "Express"]);
        });

        it("should return 404 if the job offer is not found", async () => {
            (pool.execute as jest.Mock).mockResolvedValueOnce([[], []]);

            const response = await request(app).get("/api/jobs/999");

            expect(response.status).toBe(404);
        });

        it("should return 400 for an invalid ID", async () => {
            const response = await request(app).get("/api/jobs/invalid-id");
            expect(response.status).toBe(400);
        });
    });

    describe("POST /api/jobs", () => {
        it("should create a new job offer and return 201", async () => {
            const newJob = { 
                title: "Développeur Fullstack",
                description: "Nous recherchons un développeur passionné pour rejoindre notre équipe.",
                url: "http://new.co/apply",
                contract_type: "CDI",
                city: "Lyon",
                country: "France",
                company: "NewCo",
                is_remote_job: false,
                is_hybride_job: true,
                publish_date: new Date().toISOString(),
                salary_max: 55000,
                salary_min: 45000,
                currency: "EUR",
                user_id: 1
            };
            // utilisation de pool.query car le controleur execute pool.query
            (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 123 }, []]);

            const response = await request(app).post("/api/jobs").send(newJob);

            expect(response.status).toBe(201);
            expect(response.body.id).toBe(123);
        });

        it("should return 400 on validation error", async () => {
            const badJob = { title: 12345 }; // mauvais type pour declencher l'erreur zod

            const response = await request(app).post("/api/jobs").send(badJob);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("errors");
        });
    });

    describe("PUT /api/jobs/:id", () => {
        it("should update a job offer and return 200", async () => {
            const updatedJob = { 
                title: "Updated Job", 
                company: "UpdatedCo", 
                url: "http://updated.co",
                description: "An updated description",
                contract_type: "CDD",
                city: "Bordeaux",
                country: "France",
                is_remote_job: true, 
                is_hybride_job: false, 
                publish_date: new Date().toISOString(),
                salary_max: 65000,
                salary_min: 50000,
                currency: "EUR",
                user_id: 1
            };
            // utilisation de pool.query car le controleur execute pool.query
            (pool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }, []]);

            const response = await request(app).put("/api/jobs/1").send(updatedJob);

            expect(response.status).toBe(200);
            expect(response.body.message).toContain("mise à jour avec succès");
        });

        it("should return 404 if the job to update is not found", async () => {
            const updatedJob = { 
                title: "Non-existent Job", 
                company: "GhostCo"
            };
            // utilisation de pool.query car le controleur execute pool.query
            (pool.query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 0 }, []]);

            const response = await request(app).put("/api/jobs/999").send(updatedJob);

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /api/jobs/:id", () => {
        it("should soft delete a job offer and return 200", async () => {
            (pool.execute as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }, []]);

            const response = await request(app).delete("/api/jobs/1");

            expect(response.status).toBe(200);
            expect(response.body.message).toContain("supprimée avec succès");
        });

        it("should return 404 if the job to delete is not found", async () => {
            (pool.execute as jest.Mock).mockResolvedValueOnce([{ affectedRows: 0 }, []]);

            const response = await request(app).delete("/api/jobs/999");

            expect(response.status).toBe(404);
        });
    });

    describe("GET /api/jobs/count", () => {
        it("should return the total number of active job offers", async () => {
            (pool.execute as jest.Mock).mockResolvedValueOnce([[{ total: 150 }], []]);

            const response = await request(app).get("/api/jobs/count");

            expect(response.status).toBe(200);
            expect(response.body.total).toBe(150);
        });
    });

    describe("POST /api/jobs/refresh", () => {
        it("should trigger the refresh webhook and return 200", async () => {
            env.N8N_REFRESH_JOB_OFFERS_WEBHOOK_URL = "http://fake-webhook.com";
            mockFetch.mockResolvedValueOnce({ ok: true });

            const response = await request(app).post("/api/jobs/refresh");

            expect(response.status).toBe(200);
            expect(mockFetch).toHaveBeenCalledWith("http://fake-webhook.com", expect.any(Object));
        });

        it("should return 500 if the webhook URL is not configured", async () => {
            delete (env as any).N8N_REFRESH_JOB_OFFERS_WEBHOOK_URL;

            const response = await request(app).post("/api/jobs/refresh");

            expect(response.status).toBe(500);
        });
    });

    describe("GET /api/jobs/last-sync", () => {
        it("should return the last sync date", async () => {
            const syncDate = new Date().toISOString();
            (pool.execute as jest.Mock).mockResolvedValueOnce([[{ last_sync: syncDate }], []]);

            const response = await request(app).get("/api/jobs/last-sync");

            expect(response.status).toBe(200);
            expect(response.body.last_sync).toBe(syncDate);
        });
    });
});