import request from "supertest";
import express from "express";
import { registerMember, loginMember, logoutMember } from "./auth.controller";
import { AuthService } from "./auth.service";
import { middlewareAuth } from "../../core/middlewares/authMiddleware";
import jwtTool from "jsonwebtoken";

import { errorHandlerMiddleware } from "../../core/errors/errorHandlerMiddleware";
import { ConflictError, UnauthorizedError, InternalServerError } from "../../core/errors/HttpError";

jest.mock("./auth.service");
jest.mock("jsonwebtoken");

jest.mock('../../core/middlewares/authMiddleware', () => ({
    middlewareAuth: jest.fn((req: any, res: any, next: any) => {
        // j'injecte un faux profil utilisateur dans la requête
        req.user = { id: 1, role: 'member' };
        req.token = 'fake-token';
        next();
    })
}));

jest.mock("../../core/errors/ErrorsLogger", () => ({
    logErrorToFile: jest.fn()
}));

jest.mock("../../config/database", () => ({
    pool: { execute: jest.fn().mockResolvedValue([[]]) } 
}));

describe("AuthController - registerMember", () => {
    let app: express.Application;
    
    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post("/api/auth/register", registerMember);
        app.use(errorHandlerMiddleware);
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/auth/register", () => {
        const validUserData = {
            email: "jojo@gmail.com",
            password: "HelloWorld0/",
            role: "candidat",
            firstname: "Jojo",
            lastname: "Bernard",
            username: "Jojodu59"
        };

        it("doit retourner un statut 201 et un token en cas de succès", async () => {
            const fauxToken = "mon_super_token_jwt_123";
            AuthService.prototype.register = jest.fn().mockResolvedValue(fauxToken);

            const response = await request(app).post("/api/auth/register").send(validUserData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: "Membre enregistré avec succès.",
                token: fauxToken
            });
        });

        it("doit retourner un statut 409 si l'email ou l'username existe déjà", async () => {
            AuthService.prototype.register = jest.fn().mockRejectedValue(new ConflictError("Un membre avec cet email existe déjà."));
            
            const response = await request(app).post("/api/auth/register").send(validUserData);

            expect(response.status).toBe(409);
            expect(response.body).toEqual({
                success: false,
                message: "Un membre avec cet email existe déjà."
            });
        });

        it("doit retourner un statut 400 si la validation Zod échoue", async () => {
            const response = await request(app).post("/api/auth/register").send({ email: "pas-un-vrai-email", password: "123" });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Erreur de validation des données.");
            expect(response.body).toHaveProperty("errors");
            expect(AuthService.prototype.register).not.toHaveBeenCalled();
        });

        it("doit retourner un statut 500 en cas d'erreur inattendue du serveur", async () => {
            AuthService.prototype.register = jest.fn().mockRejectedValue(new InternalServerError("Erreur interne du serveur."));

            const response = await request(app).post("/api/auth/register").send(validUserData);
            
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: "Erreur interne du serveur." 
            });
        });
    });
});

describe("AuthController - loginMember", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post("/api/auth/login", loginMember);
        app.use(errorHandlerMiddleware); 
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/auth/login", () => {
        // Ajout de stayConnected pour respecter la validation Zod du loginSchema
        const validLoginData = {
            username: "Jojodu59",
            password: "HelloWorld0/",
            stayConnected: false
        };

        it("doit retourner un statut 200 et un token en cas de succès", async () => {
            const fauxToken = "mon_super_token_jwt_456";
            AuthService.prototype.login = jest.fn().mockResolvedValue(fauxToken);

            const response = await request(app).post("/api/auth/login").send(validLoginData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Connexion réussie.",
                token: fauxToken
            });
            expect(AuthService.prototype.login).toHaveBeenCalledWith("Jojodu59", "HelloWorld0/", false);
        });

        it("doit retourner un statut 401 si les identifiants sont incorrects", async () => {
            AuthService.prototype.login = jest.fn().mockRejectedValue(new UnauthorizedError("Identifiants incorrects."));

            const response = await request(app).post("/api/auth/login").send(validLoginData);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: "Identifiants incorrects."
            });
        });

        it("doit retourner un statut 400 si la validation Zod échoue", async () => {
            const response = await request(app).post("/api/auth/login").send({ username: "", password: "" });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Erreur de validation des données.");
        });
    });
});

describe("AuthController - logoutMember", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post("/api/auth/logout", middlewareAuth, logoutMember);
        app.use(errorHandlerMiddleware);
    });
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        (jwtTool.verify as jest.Mock).mockImplementation(() => {
            return { id: 1, role: "candidat" }; 
        });
    });

    describe("POST /api/auth/logout", () => {
        
        it("doit retourner un statut 200 et invalider le token", async () => {
            AuthService.prototype.logout = jest.fn().mockResolvedValue({ message: "Déconnexion réussie." });

            const monFauxToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.faux.token";

            const response = await request(app)
                .post("/api/auth/logout")
                .set("Authorization", `Bearer ${monFauxToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Déconnexion réussie." });
            expect(AuthService.prototype.logout).toHaveBeenCalledWith(monFauxToken);
        });

        it("doit retourner une erreur 401 si aucun token n'est fourni", async () => {
            const response = await request(app).post("/api/auth/logout");
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: "No token provided" }); 
        });

        it("doit retourner une erreur 500 si le service échoue", async () => {
            AuthService.prototype.logout = jest.fn().mockRejectedValue(new InternalServerError("Erreur DB"));

            const response = await request(app)
                .post("/api/auth/logout")
                .set("Authorization", "Bearer fake-token");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: "Erreur DB"
            });
        });
    });
});