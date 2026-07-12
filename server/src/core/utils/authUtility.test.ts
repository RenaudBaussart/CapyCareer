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

        // On vérifie que c'est bien une string et qu'elle n'est pas vide
        expect(typeof token).toBe("string");
        expect(token.length).toBeGreaterThan(0);
        
        // Un token JWT comment par "eyJ"
        expect(token.startsWith("eyJ")).toBe(true);
    });

    it("doit contenir les bonnes données dans le payload du token", () => {
        // On génère le token
        const token = generatememberToken(mockPayload);

        
        const secret = process.env.JWT_SECRET || "fallback_secret_pour_les_tests"; 
        
        const decoded = jwt.verify(token, secret) as any;

        // On vérifie que nos données de base sont bien présentes à l'intérieur
        expect(decoded.id).toBe(42);
        expect(decoded.role).toBe("candidat");
        expect(decoded.isFirstLogin).toBe(true);
        
        // on verifie l'expiration
        expect(decoded.exp).toBeDefined();
    });
});