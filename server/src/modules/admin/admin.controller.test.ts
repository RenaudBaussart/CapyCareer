import request from "supertest";
import express from "express";
import { getMembers } from "./admin.controller";
import { middlewareAuthAdmin } from "../../core/middlewares/adminMiddleware";
import jwtTool from "jsonwebtoken";
import { AdminService } from "./admin.service";

import { errorHandlerMiddleware } from "../../core/errors/errorHandlerMiddleware";
import { NotFoundError, InternalServerError, BadRequestError } from "../../core/errors/HttpError";

jest.mock("./admin.service");
jest.mock('jsonwebtoken');

jest.mock("../../core/errors/ErrorsLogger", () => ({
    logErrorToFile: jest.fn()
}));

jest.mock("../../config/database", () => ({
    pool: { execute: jest.fn().mockResolvedValue([[]]) } 
}));

describe("AdminController - getMembers", () => {
    let app: express.Application;
    
    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.get("/api/admin/members", middlewareAuthAdmin, getMembers);
        
        app.use(errorHandlerMiddleware);
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/admin/members", () => {
        
        const fauxMembres = [
            { id: 1, email: "admin@example.com", role: "admin", firstname: "John", lastname: "Doe", username: "johndoe", biography: "I am Admin", profil_pic_link: "https://example.com/johndoe.jpg" },
            { id: 2, email: "candidat@example.com", role: "candidat", firstname: "Jane", lastname: "Doe", username: "janedoe", biography: "I am Candidat", profil_pic_link: "https://example.com/janedoe.jpg" }
        ];

        it("doit retourner tous les membres si aucun filtre n'est appliqué", async () => {
            (AdminService.prototype.getAllMembers as jest.Mock).mockResolvedValue([fauxMembres[1]]);
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/admin/members").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(200);
            expect(AdminService.prototype.getAllMembers).toHaveBeenCalledWith(1);
            expect(res.body).toEqual({
                message: "Tous les profils récupérés.",
                members: [fauxMembres[1]]
            });
        });

        it("doit retourner les membres filtrés si le query parameter '?role=' est valide", async () => {
            (AdminService.prototype.getMemberByRoleName as jest.Mock).mockResolvedValue([fauxMembres[1]]);
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/admin/members?role=candidat").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(200);
            expect(AdminService.prototype.getMemberByRoleName).toHaveBeenCalledWith("candidat", 1);
            expect(res.body).toEqual({
                message: "Liste des candidats récupérée avec succès.",
                members: [fauxMembres[1]]
            });
        });

        it("doit retourner un statut 400 si le rôle demandé n'existe pas", async () => {
            (AdminService.prototype.getMemberByRoleName as jest.Mock).mockRejectedValue(new BadRequestError("Rôle invalide. Utilisez 'admin', 'candidat' ou 'entreprise'."));
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/admin/members?role=pirate").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: "Rôle invalide. Utilisez 'admin', 'candidat' ou 'entreprise'."
            });
        });

        it("doit retourner un statut 500 en cas d'erreur interne du serveur", async () => {
            (AdminService.prototype.getAllMembers as jest.Mock).mockRejectedValue(new InternalServerError("Erreur interne du serveur."));
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/admin/members").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ 
                success: false, 
                message: "Erreur interne du serveur." 
            });
        });

        it("doit retourner un statut 403 si l'utilisateur n'est pas admin", async () => {
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'candidat' }));

            const res = await request(app).get("/api/admin/members").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(403);
            expect(res.body).toEqual({ error: "Access refusé, vous devez être un administrateur." });
        });

        it("doit retourner un statut 401 si aucun token n'est fourni", async () => {
            const res = await request(app).get("/api/admin/members");

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: "No token provided" });
        });

        it("doit retourner un statut 500 si le service échoue", async () => {
            (AdminService.prototype.getAllMembers as jest.Mock).mockRejectedValue(new InternalServerError("Erreur DB"));
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/admin/members").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ 
                success: false, 
                message: "Erreur DB" 
            });
        });

        it("doit retourner un statut 500 si le service échoue lors de la récupération par rôle", async () => {
            (AdminService.prototype.getMemberByRoleName as jest.Mock).mockRejectedValue(new InternalServerError("Erreur DB"));
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/admin/members?role=candidat").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ 
                success: false, 
                message: "Erreur DB" 
            });
        });
      it("doit retourner un statut 401 si le token est révoqué", async () => {
 
      (require("../../config/database").pool.execute as jest.Mock).mockResolvedValueOnce([[{ 1: 1 }]]);

      (jwtTool.verify as jest.Mock).mockImplementation((token, secret, cb) => cb(null, { id: 1, role: 'admin' }));

    const res = await request(app)
        .get("/api/admin/members")
        .set("Authorization", "Bearer token-revoked");

 
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Token révoqué. Veuillez vous reconnecter." });
    });

        it("doit retourner un statut 404 si aucun membre n'est trouvé pour le rôle spécifié", async () => {
            (AdminService.prototype.getMemberByRoleName as jest.Mock).mockRejectedValue(new NotFoundError("Aucun membre trouvé pour le rôle spécifié."));
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/admin/members?role=candidat").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ 
                success: false, 
                message: "Aucun membre trouvé pour le rôle spécifié." 
            });
        });

        it("doit retourner un statut 404 si aucun membre n'est trouvé", async () => {
            (AdminService.prototype.getAllMembers as jest.Mock).mockRejectedValue(new NotFoundError("Aucun membre trouvé."));
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/admin/members").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ 
                success: false, 
                message: "Aucun membre trouvé." 
            });
        });
    });
});