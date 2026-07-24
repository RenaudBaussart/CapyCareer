import { AdminService } from "./admin.service";
import { Pool } from "mysql2/promise";
import bcrypt from "bcrypt";
import { BadRequestError, NotFoundError, ConflictError } from "../../core/errors/HttpError";

jest.mock("bcrypt");

describe("AdminService", () => {
    let adminService: AdminService;
    let mockConnection: any;
    let mockPool: any;

    beforeEach(() => {
        mockConnection = { 
            execute: jest.fn(), 
            release: jest.fn(),
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn()
        };
        mockPool = { getConnection: jest.fn().mockResolvedValue(mockConnection) };
        adminService = new AdminService(mockPool as unknown as Pool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllMembers", () => {
        it("devrait lancer NO_MEMBERS_FOUND si la table est vide", async () => {
            mockConnection.execute.mockResolvedValueOnce([[]]);
            await expect(adminService.getAllMembers()).rejects.toThrow("NO_MEMBERS_FOUND");
        });

        it("devrait retourner la liste des membres", async () => {
            const dbRows = [
                { PK_id: 1, email: "john@test.com", FK_role_id: "admin", firstname: "John", lastname: "Doe", username: "johndoe", biography: "", profil_pic_link: "", creation_date: new Date(), last_connection: new Date() },
                { PK_id: 2, email: "jane@test.com", FK_role_id: "candidat", firstname: "Jane", lastname: "Smith", username: "janesmith", biography: "", profil_pic_link: "", creation_date: new Date(), last_connection: new Date() }
            ];
            mockConnection.execute.mockResolvedValueOnce([dbRows]);

            const expected = dbRows.map(row => ({
                id: row.PK_id, email: row.email, role: row.FK_role_id, firstname: row.firstname, lastname: row.lastname, username: row.username, biography: row.biography, profil_pic_link: row.profil_pic_link, creation_date: row.creation_date, last_connection: row.last_connection
            }));

            const result = await adminService.getAllMembers();
            expect(result).toEqual(expected);
        });

        it("devrait exclure le membre courant si un id est fourni", async () => {
            const dbRows = [
                { PK_id: 1, FK_role_id: "admin" },
                { PK_id: 2, FK_role_id: "candidat" }
            ];
            mockConnection.execute.mockResolvedValueOnce([dbRows]);

            const result = await adminService.getAllMembers(1);
            expect(result.length).toBe(1);
            expect(result[0]!.id).toBe(2);
        });
    });

    describe("getMemberByRoleName", () => {
        it("devrait lancer BadRequestError si le rôle n'est pas valide", async () => {
            await expect(adminService.getMemberByRoleName("pirate")).rejects.toThrow(BadRequestError);
            expect(mockPool.getConnection).not.toHaveBeenCalled(); 
        });

        it("devrait lancer NotFoundError si aucun membre n'est trouvé pour ce rôle", async () => {
            mockConnection.execute.mockResolvedValueOnce([[]]);
            await expect(adminService.getMemberByRoleName("candidat")).rejects.toThrow(NotFoundError);
        });
    });

    describe("banMember", () => {
        it("devrait bannir un membre, le supprimer et faire un commit", async () => {
            mockConnection.execute.mockResolvedValueOnce([[{ PK_id: 2, username: "baduser", FK_role_id: "candidat" }]]); 
            mockConnection.execute.mockResolvedValueOnce([[]]); 
            mockConnection.execute.mockResolvedValueOnce([[]]); 

            const result = await adminService.banMember("baduser@test.com");

            expect(result.message).toBe("Membre banni et supprimé avec succès.");
            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.rollback).not.toHaveBeenCalled();
        });

        it("devrait lancer BadRequestError si on essaie de bannir un admin", async () => {
            mockConnection.execute.mockResolvedValueOnce([[{ PK_id: 1, username: "admin", FK_role_id: "admin" }]]);

            await expect(adminService.banMember("admin@test.com")).rejects.toThrow("Impossible de bannir un autre administrateur.");
            expect(mockConnection.rollback).toHaveBeenCalled();
        });

        it("devrait lancer NotFoundError si l'email n'existe pas", async () => {
            mockConnection.execute.mockResolvedValueOnce([[]]); 

            await expect(adminService.banMember("inconnu@test.com")).rejects.toThrow("MEMBER_NOT_FOUND");
            expect(mockConnection.rollback).toHaveBeenCalled();
        });
    });

    describe("unbanMember", () => {
        it("devrait débannir un membre et faire un commit", async () => {
            mockConnection.execute.mockResolvedValueOnce([[{ PK_banned_id: 1 }]]); 
            mockConnection.execute.mockResolvedValueOnce([[]]); 

            const result = await adminService.unbanMember("banned@test.com");

            expect(result.message).toBe("Membre débanni avec succès. Il peut désormais recréer un compte.");
            expect(mockConnection.commit).toHaveBeenCalled();
        });

        it("devrait lancer NotFoundError si le membre n'est pas banni", async () => {
            mockConnection.execute.mockResolvedValueOnce([[]]); 

            await expect(adminService.unbanMember("notbanned@test.com")).rejects.toThrow("Cet email n'est pas dans la liste des bannis.");
            expect(mockConnection.rollback).toHaveBeenCalled();
        });
    });

    describe("performAdminUpdate", () => {
        beforeEach(() => {
            mockConnection.execute.mockImplementation(async (query: string) => {
                if (query.includes("SELECT FK_role_id FROM User_ WHERE PK_id = ?")) return [[{ FK_role_id: "candidat" }]];
                if (query.includes("SELECT 1 FROM Banned")) return [[ ]]; 
                if (query.includes("SELECT PK_id FROM User_ WHERE email = ? AND PK_id != ?")) return [[ ]]; 
                return [[]]; 
            });
        });

        it("devrait mettre à jour le mot de passe, le rôle, et le profil, puis faire un commit", async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");

            await adminService.performAdminUpdate(2, {
                newPassword: "MonNouveauMotDePasse1/",
                role: "entreprise",
                firstname: "Jean",
                email: "jean@new.com"
            });

            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith("MonNouveauMotDePasse1/", 10);
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.rollback).not.toHaveBeenCalled();
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it("devrait lancer BadRequestError si on modifie un admin", async () => {
            mockConnection.execute.mockImplementation(async (query: string) => {
                if (query.includes("SELECT FK_role_id FROM User_ WHERE PK_id = ?")) return [[{ FK_role_id: "admin" }]];
                return [[]];
            });

            await expect(adminService.performAdminUpdate(1, { firstname: "Hacker" }))
                .rejects.toThrow("Impossible de modifier un administrateur.");
            
            expect(mockConnection.rollback).toHaveBeenCalled();
        });

        it("devrait lancer ConflictError si le nouvel email est déjà pris", async () => {
            mockConnection.execute.mockImplementation(async (query: string) => {
                if (query.includes("SELECT FK_role_id FROM User_ WHERE PK_id = ?")) return [[{ FK_role_id: "candidat" }]];
                if (query.includes("SELECT 1 FROM Banned")) return [[ ]]; 
                if (query.includes("SELECT PK_id FROM User_ WHERE email = ? AND PK_id != ?")) return [[{ PK_id: 5 }]]; 
                return [[]];
            });

            await expect(adminService.performAdminUpdate(2, { email: "deja-pris@test.com" }))
                .rejects.toThrow(ConflictError);

            expect(mockConnection.rollback).toHaveBeenCalled();
        });
    });
});