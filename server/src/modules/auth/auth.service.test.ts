import { AuthService } from "./auth.service"; 
import bcrypt from "bcrypt";
import { generatememberToken } from "../../core/utils/authUtility"; 
import { Pool } from "mysql2/promise";



jest.mock("bcrypt");
jest.mock("../../core/utils/authUtility");

describe("AuthService - Méthode Register", () => {
    let authService: AuthService;
    let mockConnection: any;
    let mockPool: any;

    beforeEach(() => {
        mockConnection = {
            execute: jest.fn(),
            release: jest.fn(),
        };
        
        // On simule le Pool MySQL
        mockPool = {
            getConnection: jest.fn().mockResolvedValue(mockConnection),
        };

        // On injecte notre fausse base de données dans le service via l'injection de dépendances
        authService = new AuthService(mockPool as unknown as Pool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Cas d'erreurs", () => {
        it("doit rejeter l'inscription et lever une erreur si l'email existe déjà", async () => {
            mockConnection.execute.mockResolvedValueOnce([[{ PK_id: 1 }]]); 
            
            const userData = {
                email: "jojo@gmail.com",
                password: "HelloWorld0/",
                role: "candidat",
                firstname: "Jojo",
                lastname: "Bernard",
                username: "Jojodu59"
            };

            await expect(authService.register(userData as any)).rejects.toThrow("EMAIL_EXISTS");  

            expect(mockConnection.release).toHaveBeenCalledTimes(1);
            
            // On vérifie que bcrypt n'a pas été appelé puisque ça a planté avant
            expect(bcrypt.hash).not.toHaveBeenCalled(); 
        });
    });

    describe("Cas de succès", () => {
        it("doit inscrire un nouvel utilisateur, hacher son mot de passe et retourner un token", async () => {
            mockConnection.execute
                .mockResolvedValueOnce([[]]) 
                .mockResolvedValueOnce([{ insertId: 42 }]); 
            
            // On lui donne le mdp à hacher et le token à générer
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");
            (generatememberToken as jest.Mock).mockReturnValue("fake-jwt-token-123");

            const userData = {
                email: "jojo@gmail.com",
                password: "HelloWorld0/",
                role: "candidat",
                firstname: "Jojo",
                lastname: "Bernard",
                username: "Jojodu59"
            };

            // typage strict
            const result = await authService.register(userData as any);

            
            // on voit que l'on a bien reçu le token généré
            expect(result).toBe("fake-jwt-token-123");
            
            // on voit si la connexion a été obtenue depuis le pool
            expect(mockConnection.execute).toHaveBeenCalledTimes(2); 
            
            // on voit si le mot de passe a été haché avec les bons paramètres
            expect(bcrypt.hash).toHaveBeenCalledWith("HelloWorld0/", 10);
            
            // on voit si le token a été généré avec les bonnes informations
            expect(generatememberToken).toHaveBeenCalledWith({
                id: 42,
                role: "candidat",
                isFirstLogin: true
            });
            // on s'assure que la connexion a été relâchée après l'opération
            expect(mockConnection.release).toHaveBeenCalledTimes(1);
        });
    });
});