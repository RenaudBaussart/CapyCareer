import { generatememberToken, TokenMember } from "./authUtility";
import jwt from "jsonwebtoken";

const mockPayload: TokenMember = {
    id: 42,
    role: "candidat",
    isFirstLogin: true
};

describe("AuthUtility - Génération de Token", () => {
    const ORIGINAL_SECRET = process.env.JWT_SECRET;

    beforeAll(() => {
        process.env.JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_pour_les_tests";
    });

    afterAll(() => {
        process.env.JWT_SECRET = ORIGINAL_SECRET;
    });

    it("doit générer un token JWT valide (une chaîne de caractères)", () => {
        const token = generatememberToken(mockPayload);

        // verifie format string & non vide
        expect(typeof token).toBe("string");
        expect(token.length).toBeGreaterThan(0);
        
        // le token JWT commence eyJ
        expect(token.startsWith("eyJ")).toBe(true);
    });

    it("doit contenir les bonnes données dans le payload du token", () => {
        // génère token
        const token = generatememberToken(mockPayload);

        const secret = process.env.JWT_SECRET as string;

        const decoded = jwt.verify(token, secret) as any;

        // vérifie que les datas de base sont a l'intérieur
        expect(decoded.id).toBe(42);
        expect(decoded.role).toBe("candidat");
        expect(decoded.isFirstLogin).toBe(true);
        
        // verifie expiration de celui ci
        expect(decoded.exp).toBeDefined();
    });
});

describe("AuthUtility - Gestion des erreurs", () => {
    it("doit lever une erreur si JWT_SECRET est manquant", () => {
        // sauvegarde de l'ancien secret
        const originalSecret = process.env.JWT_SECRET;
        delete process.env.JWT_SECRET;

        expect(() => generatememberToken(mockPayload)).toThrow("Erreur critique : JWT_SECRET est manquant dans le fichier .env");

        // restaure l'ancien secret
        process.env.JWT_SECRET = originalSecret;
    });
});
