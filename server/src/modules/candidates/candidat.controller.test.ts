import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { redirectToSite } from "./candidat.controller";
import { CandidatService } from "./candidat.service";
import { middlewareAuth } from "../../core/middlewares/authMiddleware";

jest.mock("./candidat.service");

jest.mock("../../core/errors/ErrorsLogger", () => ({
    logErrorToFile: jest.fn()
}));

jest.mock("../../config/database", () => ({
    pool: { execute: jest.fn().mockResolvedValue([[]]) } 
}));

jest.mock("../../core/middlewares/authMiddleware", () => ({
    middlewareAuth: (req: any, res: any, next: any) => {
        req.member = { id: 123, role: "candidat" };
        next();
    }
}));

describe("Candidat Controller", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        
        app.get("/redirect/:jobId", middlewareAuth, redirectToSite);

        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ message: err.message });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should redirect to the job site when valid jobId and candidateId are provided", async () => {
        const mockUrl = "http://example.com/job";
        (CandidatService.prototype.redirectToSite as jest.Mock).mockResolvedValue(mockUrl);

        const response = await request(app).get("/redirect/1");

        expect(response.status).toBe(302);
        expect(response.header.location).toBe(mockUrl);
        expect(CandidatService.prototype.redirectToSite).toHaveBeenCalledWith(1, 123);
    });

    it("should return 400 if jobId is not a number", async () => {
        const response = await request(app).get("/redirect/invalid");

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Erreur de validation des données.");
    });

    it("should handle errors thrown by the service", async () => {
        (CandidatService.prototype.redirectToSite as jest.Mock).mockImplementation(() => {
            throw new Error("Service error");
        });

        const response = await request(app).get("/redirect/1");

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("message", "Service error");
    });
});