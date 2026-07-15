import request from "supertest";
import express from "express";
import { getAllMembersProfile } from "./member.controller";
import { middlewareAuthAdmin } from "../../core/middlewares/authMiddleware";
import jwtTool from "jsonwebtoken";
import { MemberService } from "./member.service";

jest.mock("./member.service");
jest.mock('jsonwebtoken');

jest.mock("../../config/database", () => ({
    pool: {} 
}));

describe("MemberController - getAllMembersProfile", () => {
    let app: express.Application;
    // nettoie mocks avant chaque test
    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.get("/api/members", middlewareAuthAdmin, getAllMembersProfile);
    });
    // nettoie mocks après chaque test
    afterEach(() => {
        jest.clearAllMocks();
    });
    // getAllMembersProfile tests
    describe("GET /api/members", () => {
        
        // en cas de succes
        it("doit retourner un statut 200 et la liste des membres en cas de succès", async () => {
            const fauxMembres = [
                { id: 1, email: "user1@example.com", role: 1, firstname: "John", lastname: "Doe", username: "johndoe", biography: "I am John Doe", profil_pic_link: "https://example.com/johndoe.jpg" },
                { id: 2, email: "user2@example.com", role: 1, firstname: "Jane", lastname: "Doe", username: "janedoe", biography: "I am Jane Doe", profil_pic_link: "https://example.com/janedoe.jpg" }
            ];

            (MemberService.prototype.getAllMembers as jest.Mock).mockResolvedValue([fauxMembres[1]]);

            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/members").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(200);
            expect(MemberService.prototype.getAllMembers).toHaveBeenCalledWith(1);
            expect(res.body).toEqual({
                message: "Profils des membres récupérés avec succès.",
                members: [fauxMembres[1]]
            });
        });
        it("doit retourner un statut 500 en cas d'erreur interne du serveur", async () => {
            (MemberService.prototype.getAllMembers as jest.Mock).mockRejectedValue(new Error("Erreur interne du serveur"));

            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/members").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: "Erreur interne du serveur." });
        });
        it("doit retourner un statut 401 si le token est invalide", async () => {
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(new Error("Token invalide")));

            const res = await request(app).get("/api/members").set("Authorization", "Bearer invalid-token");

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: "Invalid token" });
        });

        it("doit retourner un statut 403 si l'utilisateur n'est pas admin", async () => {
            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'user' }));

            const res = await request(app).get("/api/members").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(403);
            expect(res.body).toEqual({ error: "Access denied. Admins only." });
        });
        it("doit retourner un statut 404 si aucun membre n'est trouvé", async () => {
            (MemberService.prototype.getAllMembers as jest.Mock).mockRejectedValue(new Error("NO_MEMBERS_FOUND"));

            (jwtTool.verify as jest.Mock).mockImplementation((token: any, secret: any, cb: any) => cb(null, { id: 1, role: 'admin' }));

            const res = await request(app).get("/api/members").set("Authorization", "Bearer fake-jwt-token");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: "Aucun membre trouvé." });
        });
    });
});