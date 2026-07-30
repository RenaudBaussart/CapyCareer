import { generatememberToken, TokenMember } from "./authUtility";
import jwt from "jsonwebtoken";

const mockPayload: TokenMember = {
    id: 42,
    role: "candidat",
    isFirstLogin: true
};

describe("AuthUtility - Génération de Token", () => {
    const ORIGINAL_SECRET = process.env.JWT_SECRET;
    const ORIGINAL_EXPIRATION = process.env.JWT_EXPIRATION;
    const ORIGINAL_LONG_EXPIRATION = process.env.JWT_LONG_EXPIRATION;

    beforeAll(() => {
        process.env.JWT_SECRET = "fallback_secret_pour_les_tests";
        process.env.JWT_EXPIRATION = "1h";
        process.env.JWT_LONG_EXPIRATION = "7d";
    });

    afterAll(() => {
        process.env.JWT_SECRET = ORIGINAL_SECRET;
        process.env.JWT_EXPIRATION = ORIGINAL_EXPIRATION;
        process.env.JWT_LONG_EXPIRATION = ORIGINAL_LONG_EXPIRATION;
    });

    it("doit générer un token JWT valide (une chaîne de caractères)", () => {
        const token = generatememberToken(mockPayload);

        expect(typeof token).toBe("string");
        expect(token.length).toBeGreaterThan(0);
        
        expect(token.startsWith("eyJ")).toBe(true);
    });

    it("doit contenir les bonnes données dans le payload du token", () => {
        const token = generatememberToken(mockPayload);
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as any;

        expect(decoded.id).toBe(42);
        expect(decoded.role).toBe("candidat");
        expect(decoded.isFirstLogin).toBe(true);
        
        expect(decoded.exp).toBeDefined();
    });

    it("doit générer un token valide avec la longue expiration si stayLoggedIn est true", () => {
        const token = generatememberToken(mockPayload, true);
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as any;

        expect(decoded.id).toBe(42);
        expect(decoded.exp).toBeDefined();
    });
});

describe("AuthUtility - Gestion des erreurs", () => {
    const ORIGINAL_SECRET = process.env.JWT_SECRET;
    const ORIGINAL_EXPIRATION = process.env.JWT_EXPIRATION;
    const ORIGINAL_LONG_EXPIRATION = process.env.JWT_LONG_EXPIRATION;

    beforeEach(() => {
        process.env.JWT_SECRET = "fallback_secret_pour_les_tests";
        process.env.JWT_EXPIRATION = "1h";
        process.env.JWT_LONG_EXPIRATION = "7d";
    });

    afterEach(() => {
        process.env.JWT_SECRET = ORIGINAL_SECRET;
        process.env.JWT_EXPIRATION = ORIGINAL_EXPIRATION;
        process.env.JWT_LONG_EXPIRATION = ORIGINAL_LONG_EXPIRATION;
    });

    it("doit lever une erreur si JWT_SECRET est manquant", () => {
        delete process.env.JWT_SECRET;
        expect(() => generatememberToken(mockPayload)).toThrow("Erreur critique : JWT_SECRET est manquant dans le fichier .env");
    });

    it("doit lever une erreur si JWT_EXPIRATION est manquant (stayLoggedIn = false)", () => {
        delete process.env.JWT_EXPIRATION;
        expect(() => generatememberToken(mockPayload, false)).toThrow("Erreur critique : JWT_EXPIRATION ou JWT_LONG_EXPIRATION est manquant dans le fichier .env");
    });

    it("doit lever une erreur si JWT_LONG_EXPIRATION est manquant (stayLoggedIn = true)", () => {
        delete process.env.JWT_LONG_EXPIRATION;
        expect(() => generatememberToken(mockPayload, true)).toThrow("Erreur critique : JWT_EXPIRATION ou JWT_LONG_EXPIRATION est manquant dans le fichier .env");
    });
});