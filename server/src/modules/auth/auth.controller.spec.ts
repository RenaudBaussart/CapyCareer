import request from "supertest";
import express from "express";
import { registerMember, loginMember, logoutMember } from "./auth.controller";
import { AuthService } from "./auth.service";
import { middlewareAuth } from "../../core/middlewares/authMiddleware";
import jwtTool from "jsonwebtoken";

jest.mock("./auth.service");
jest.mock('jsonwebtoken');

jest.mock("../../config/database", () => ({
    pool: {} 
}));

describe("AuthController - registerMember", () => {
    let app: express.Application;
    // nettoie mocks avant chaque test
    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.post("/api/auth/register", registerMember);
    });
    // nettoie mocks après chaque test
    afterEach(() => {
        jest.clearAllMocks();
    });
    // register tests
    describe("POST /api/auth/register", () => {
        
        // datas valides pour l'inscription
        const validUserData = {
            email: "jojo@gmail.com",
            password: "HelloWorld0/",
            role: "candidat",
            firstname: "Jojo",
            lastname: "Bernard",
            username: "Jojodu59"
        };
        // en cas de succes
        it("doit retourner un statut 201 et un token en cas de succès", async () => {
            const fauxToken = "mon_super_token_jwt_123";
            AuthService.prototype.register = jest.fn().mockResolvedValue(fauxToken);

            const response = await request(app)
                .post("/api/auth/register")
                .send(validUserData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: "Membre enregistré avec succès.",
                token: fauxToken
            });
            expect(AuthService.prototype.register).toHaveBeenCalledWith(validUserData);
        });
        // erreur mail déjà existant
        it("doit retourner un statut 409 si l'email existe déjà", async () => {
            AuthService.prototype.register = jest.fn().mockRejectedValue(new Error("EMAIL_EXISTS"));

            
            const response = await request(app)
                .post("/api/auth/register")
                .send(validUserData);

            expect(response.status).toBe(409);
            expect(response.body).toEqual({
                message: "Un membre avec cet email existe déjà."
            });
        });
        // en cas du non respect de zod
        it("doit retourner un statut 400 si la validation Zod échoue", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "pas-un-vrai-email",
                    password: "123"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Erreur de validation des données.");
            
            expect(response.body).toHaveProperty("errors");
            
            expect(AuthService.prototype.register).not.toHaveBeenCalled();
        });
        // en cas d'erreur inattendue du serveur
        it("doit retourner un statut 500 en cas d'erreur inattendue du serveur", async () => {
            AuthService.prototype.register = jest.fn().mockRejectedValue(new Error("Erreur SQL critique"));

        
            const response = await request(app)
                .post("/api/auth/register")
                .send(validUserData);

            
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
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
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/auth/login", () => {
        const validLoginData = {
            username: "Jojodu59",
            password: "HelloWorld0/"
        };

        it("doit retourner un statut 200 et un token en cas de succès", async () => {
            const fauxToken = "mon_super_token_jwt_456";
            AuthService.prototype.login = jest.fn().mockResolvedValue(fauxToken);

            const response = await request(app)
                .post("/api/auth/login")
                .send(validLoginData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Connexion réussie.",
                token: fauxToken
            });
            expect(AuthService.prototype.login).toHaveBeenCalledWith(validLoginData.username, validLoginData.password);
        });

        it("doit retourner un statut 401 si les identifiants sont incorrects", async () => {
            AuthService.prototype.login = jest.fn().mockRejectedValue(new Error("USER_NOT_FOUND"));

            const response = await request(app)
                .post("/api/auth/login")
                .send(validLoginData);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                message: "Identifiants incorrects."
            });
        });

        it("doit retourner un statut 400 si la validation Zod échoue", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    username: "",
                    password: ""
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Erreur de validation des données.");
            expect(response.body).toHaveProperty("errors");
            expect(AuthService.prototype.login).not.toHaveBeenCalled();
        });

        it("doit retourner un statut 500 en cas d'erreur inattendue du serveur", async () => {
            AuthService.prototype.login = jest.fn().mockRejectedValue(new Error("Erreur SQL critique"));

            const response = await request(app)
                .post("/api/auth/login")
                .send(validLoginData);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Erreur interne du serveur."
            });
        });
    });
});


describe("AuthController - logoutMember", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.post("/api/auth/logout", middlewareAuth, logoutMember);
    });
    
    beforeEach(() => {
        jest.clearAllMocks();

        (jwtTool.verify as jest.Mock).mockImplementation((token, secret, callback) => {
            callback(null, { id: 1, role: 'member' }); 
        });
    });

    describe("POST /api/auth/logout", () => {
        
        it("doit retourner un statut 200 et invalider le token", async () => {
            const mockLogout = jest.fn().mockResolvedValue({ message: "Déconnexion réussie." });
            (AuthService as jest.Mock).mockImplementation(() => {
                return { logout: mockLogout };
            });

            const monFauxToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.faux.token";

            const response = await request(app)
                .post("/api/auth/logout")
                .set("Authorization", `Bearer ${monFauxToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Déconnexion réussie." });
            
            expect(mockLogout).toHaveBeenCalledWith(monFauxToken);
        });

        it("doit retourner une erreur 401 si aucun token n'est fourni", async () => {
            const response = await request(app)
                .post("/api/auth/logout");

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: "No token provided" });
        });

        it("doit retourner une erreur 500 si le service échoue", async () => {
            const mockLogout = jest.fn().mockRejectedValue(new Error("Erreur DB"));
            (AuthService as jest.Mock).mockImplementation(() => {
                return { logout: mockLogout };
            });

            const response = await request(app)
                .post("/api/auth/logout")
                .set("Authorization", "Bearer fake-token");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Erreur interne du serveur." });
        });
        
    });
});
