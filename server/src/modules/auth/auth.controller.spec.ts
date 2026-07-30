import request from "supertest";
import express from "express";
import { registerMember, loginMember, logoutMember } from "./auth.controller";
import { AuthService } from "./auth.service";
import { middlewareAuth } from "../../core/middlewares/authMiddleware";

import { errorHandlerMiddleware } from "../../core/errors/errorHandlerMiddleware";
import { ConflictError, UnauthorizedError, InternalServerError } from "../../core/errors/HttpError";

// On mock explicitement le middleware pour dicter son comportement
jest.mock("../../core/middlewares/authMiddleware", () => ({
    middlewareAuth: jest.fn((req: any, res: any, next: any) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            // Reproduit fidèlement la ligne 23 de ton vrai middleware
            return res.status(401).json({ error: 'No token provided' });
        }
        req.member = { id: 1, email: "jojo@gmail.com", role: "candidat" };
        next();
    })
}));

jest.mock("../../core/errors/ErrorsLogger", () => ({
    logErrorToFile: jest.fn()
}));

describe("AuthController", () => {
    let app: express.Application;
    
    beforeAll(() => {
        app = express();
        app.use(express.json());
        
        app.post("/api/auth/register", registerMember);
        app.post("/api/auth/login", loginMember);
        app.post("/api/auth/logout", middlewareAuth, logoutMember);
        
        app.use(errorHandlerMiddleware);
    });
    
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks(); 
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
            const registerSpy = jest.spyOn(AuthService.prototype, "register").mockResolvedValue(fauxToken);

            const response = await request(app).post("/api/auth/register").send(validUserData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: "Membre enregistré avec succès.",
                token: fauxToken
            });
            expect(registerSpy).toHaveBeenCalled();
        });

        it("doit retourner un statut 409 si l'email ou l'username existe déjà", async () => {
            jest.spyOn(AuthService.prototype, "register").mockRejectedValue(new ConflictError("Un membre avec cet email existe déjà."));
            
            const response = await request(app).post("/api/auth/register").send(validUserData);

            expect(response.status).toBe(409);
            expect(response.body).toEqual({
                success: false,
                message: "Un membre avec cet email existe déjà."
            });
        });

        it("doit retourner un statut 400 si la validation Zod échoue", async () => {
            const registerSpy = jest.spyOn(AuthService.prototype, "register");
            const response = await request(app).post("/api/auth/register").send({ email: "pas-un-vrai-email", password: "123" });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Erreur de validation des données.");
            expect(response.body).toHaveProperty("errors");
            expect(registerSpy).not.toHaveBeenCalled();
        });

        it("doit retourner un statut 500 en cas d'erreur inattendue du serveur", async () => {
            jest.spyOn(AuthService.prototype, "register").mockRejectedValue(new InternalServerError("Erreur interne du serveur."));

            const response = await request(app).post("/api/auth/register").send(validUserData);
            
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: "Erreur interne du serveur." 
            });
        });
    });

    describe("POST /api/auth/login", () => {
        const validLoginData = {
            username: "Jojodu59",
            password: "HelloWorld0/",
            stayConnected: false
        };

        it("doit retourner un statut 200 et un token en cas de succès", async () => {
            const fauxToken = "mon_super_token_jwt_456";
            const loginSpy = jest.spyOn(AuthService.prototype, "login").mockResolvedValue(fauxToken);

            const response = await request(app).post("/api/auth/login").send(validLoginData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Connexion réussie.",
                token: fauxToken
            });
            expect(loginSpy).toHaveBeenCalledWith("Jojodu59", "HelloWorld0/", false);
        });

        it("doit retourner un statut 401 si les identifiants sont incorrects", async () => {
            jest.spyOn(AuthService.prototype, "login").mockRejectedValue(new UnauthorizedError("Identifiants incorrects."));

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

    describe("POST /api/auth/logout", () => {
        
        it("doit retourner un statut 200 et invalider le token", async () => {
            const logoutSpy = jest.spyOn(AuthService.prototype, "logout").mockResolvedValue({ message: "Déconnexion réussie." } as any);

            const monFauxToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.faux.token";

            const response = await request(app)
                .post("/api/auth/logout")
                .set("Authorization", `Bearer ${monFauxToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Déconnexion réussie." });
            expect(logoutSpy).toHaveBeenCalledWith(monFauxToken);
        });

        it("doit retourner une erreur 401 si aucun token n'est fourni", async () => {
            // Le mock du middleware va maintenant s'assurer d'intercepter ça proprement
            const response = await request(app).post("/api/auth/logout");
            
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: "No token provided" }); 
        });

        it("doit retourner une erreur 500 si le service échoue", async () => {
            jest.spyOn(AuthService.prototype, "logout").mockRejectedValue(new InternalServerError("Erreur DB"));

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