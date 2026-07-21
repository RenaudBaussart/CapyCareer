import { AuthService } from "./auth.service"; 
import bcrypt from "bcrypt";
import { generatememberToken } from "../../core/utils/authUtility"; 
import { Pool } from "mysql2/promise";
import jwtTool from "jsonwebtoken";
import { ConflictError, UnauthorizedError, InternalServerError } from "../../core/errors/HttpError";

jest.mock('jsonwebtoken');
jest.mock("bcrypt");
jest.mock("../../core/utils/authUtility");

describe("AuthService - Méthode Register", () => {
    let authService: AuthService;
    let mockConnection: any;
    let mockPool: any;

    beforeEach(() => {
        mockConnection = { execute: jest.fn().mockResolvedValue([[]]), release: jest.fn() };
        mockPool = { getConnection: jest.fn().mockResolvedValue(mockConnection) };
        authService = new AuthService(mockPool as unknown as Pool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Cas d'erreurs", () => {
        it("doit rejeter l'inscription et lever une ConflictError si l'email existe déjà", async () => {
            mockConnection.execute
                .mockResolvedValueOnce([[]]) 
                .mockResolvedValueOnce([[{ PK_id: 1 }]]); 
            
            const userData = {
                email: "jojo@gmail.com",
                password: "HelloWorld0/",
                role: "candidat",
                firstname: "Jojo",
                lastname: "Bernard",
                username: "Jojodu59"
            };

            await expect(authService.register(userData as any)).rejects.toThrow(ConflictError);  
            expect(mockConnection.release).toHaveBeenCalledTimes(1);
            expect(bcrypt.hash).not.toHaveBeenCalled(); 
        });
    });

    describe("Cas de succès", () => {
        it("doit inscrire un nouvel utilisateur, hacher son mot de passe et retourner un token", async () => {
            mockConnection.execute
                .mockResolvedValueOnce([[]]) 
                .mockResolvedValueOnce([[]]) 
                .mockResolvedValueOnce([[]]) 
                .mockResolvedValueOnce([{ insertId: 42 }]); 
            
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

            const result = await authService.register(userData as any);

            expect(result).toBe("fake-jwt-token-123");
            expect(mockConnection.execute).toHaveBeenCalledTimes(4); // 4 requêtes maintenant
            expect(bcrypt.hash).toHaveBeenCalledWith("HelloWorld0/", 10);
            expect(generatememberToken).toHaveBeenCalledWith({
                id: 42,
                role: "candidat",
                isFirstLogin: true
            });
            expect(mockConnection.release).toHaveBeenCalledTimes(1);
        });
    });
});

describe("AuthService - Méthode Login", () => {
    let authService: AuthService;
    let mockConnection: any;
    let mockPool: any;

    beforeEach(() => {
        mockConnection = { execute: jest.fn().mockResolvedValue([[]]), release: jest.fn() };
        mockPool = { getConnection: jest.fn().mockResolvedValue(mockConnection) };
        authService = new AuthService(mockPool as unknown as Pool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Cas d'erreurs", () => {
        it("devrait jeter l'erreur UnauthorizedError si le pseudonyme n'existe pas", async () => {
            mockConnection.execute
                .mockResolvedValueOnce([[]])  
                .mockResolvedValueOnce([[]]);

            await expect(authService.login("Inconnu", "Password123!"))
                .rejects.toThrow(UnauthorizedError);
            
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it("devrait jeter l'erreur UnauthorizedError si le mot de passe est faux", async () => {
            const fakeUser = [{ PK_id: 1, username: "Jojodu59", hashed_password: "hash-bdd", FK_role_id: "candidat" }];
            mockConnection.execute
                .mockResolvedValueOnce([[]])
                .mockResolvedValueOnce([fakeUser]); 
            
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

            await expect(authService.login("Jojodu59", "MauvaisMotDePasse"))
                .rejects.toThrow(UnauthorizedError);

            expect(mockConnection.release).toHaveBeenCalled();
        });
    });

    describe("Cas de succès", () => {
        it("devrait retourner un token si les identifiants sont corrects", async () => {
            const fakeUser = [{ PK_id: 1, username: "Jojodu59", hashed_password: "hash-bdd", FK_role_id: "candidat" }];
            mockConnection.execute
                .mockResolvedValueOnce([[]]) 
                .mockResolvedValueOnce([fakeUser]); 

            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

            const fakeToken = "eyFauxTokenJWT...";
            (generatememberToken as jest.Mock).mockReturnValueOnce(fakeToken);

            const result = await authService.login("Jojodu59", "BonMotDePasse1!");

            expect(result).toBe(fakeToken);
            expect(generatememberToken).toHaveBeenCalledWith({
                id: 1,
                role: "candidat",
                isFirstLogin: false
            });
            expect(mockConnection.release).toHaveBeenCalled();
        });
    });
});

describe("AuthService - Méthode Logout", () => {
    let authService: AuthService;
    let mockConnection: any;
    let mockPool: any;

    beforeEach(() => {
        mockConnection = { execute: jest.fn(), release: jest.fn() };
        mockPool = { getConnection: jest.fn().mockResolvedValue(mockConnection) };
        authService = new AuthService(mockPool as unknown as Pool);
        (jwtTool.verify as jest.Mock).mockReturnValue({ id: 1, role: 'member' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Cas d'erreurs", () => {
        it("devrait rejeter la déconnexion avec InternalServerError si une erreur survient dans la base de données", async () => {
            mockConnection.execute.mockRejectedValueOnce({ errno: 9999, message: "Erreur DB" });

            await expect(authService.logout("fauxToken")).rejects.toThrow(InternalServerError);
            
            expect(mockConnection.release).toHaveBeenCalled();
        });
    });

    describe("Cas de succès", () => {
        it("devrait réussir la déconnexion et invalider le token", async () => {
            mockConnection.execute.mockResolvedValue([{}]);

            const result = await authService.logout("fauxToken");

            expect(result).toEqual({ message: "Déconnexion réussie." });
            
            expect(mockConnection.execute).toHaveBeenNthCalledWith(1,
                "UPDATE User_ SET last_connection = NOW() WHERE PK_id = ?",
                [1] 
            );

            expect(mockConnection.execute).toHaveBeenNthCalledWith(2,
                "INSERT INTO Blacklist (token, blacklisted_at) VALUES (?, NOW())",
                ["fauxToken"]
            );

            expect(mockConnection.release).toHaveBeenCalled();
        });
    });
});