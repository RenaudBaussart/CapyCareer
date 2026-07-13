import { generatememberToken, TokenMember } from "./authUtility";
import jwt from "jsonwebtoken";

describe("AuthUtility - Génération de Token", () => {
    
    const mockPayload: TokenMember = {
        id: 42,
        role: "candidat",
        isFirstLogin: true
    };

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

        
        const secret = process.env.JWT_SECRET || "fallback_secret_pour_les_tests"; 
        
        const decoded = jwt.verify(token, secret) as any;

        // vérifie que les datas de base sont a l'intérieur
        expect(decoded.id).toBe(42);
        expect(decoded.role).toBe("candidat");
        expect(decoded.isFirstLogin).toBe(true);
        
        // verifie expiration de celui ci
        expect(decoded.exp).toBeDefined();
    });
});
