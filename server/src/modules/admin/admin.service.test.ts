import { AdminService } from "./admin.service";
import { Pool } from "mysql2/promise";
import { BadRequestError, NotFoundError } from "../../core/errors/HttpError";

describe("AdminService", () => {
    let adminService: AdminService;
    let mockConnection: any;
    let mockPool: any;

    beforeEach(() => {
        mockConnection = { execute: jest.fn(), release: jest.fn() };
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

        it("devrait retourner la liste des membres avec les rôles en string", async () => {
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
                { PK_id: 1, email: "john@test.com", FK_role_id: "admin", firstname: "John", lastname: "Doe", username: "johndoe", biography: "", profil_pic_link: "", creation_date: new Date(), last_connection: new Date() },
                { PK_id: 2, email: "jane@test.com", FK_role_id: "candidat", firstname: "Jane", lastname: "Smith", username: "janesmith", biography: "", profil_pic_link: "", creation_date: new Date(), last_connection: new Date() }
            ];
            mockConnection.execute.mockResolvedValueOnce([dbRows]);

            const result = await adminService.getAllMembers(1);

            expect(result.length).toBe(1);
            expect(result[0]!.id).toBe(2);
        });
    });

    describe("getMemberByRoleName", () => {
        it("devrait lancer BadRequestError si le rôle n'est pas dans le dictionnaire", async () => {
            await expect(adminService.getMemberByRoleName("pirate")).rejects.toThrow(BadRequestError);
            expect(mockPool.getConnection).not.toHaveBeenCalled(); 
        });

        it("devrait lancer NotFoundError si aucun membre n'est trouvé pour ce rôle", async () => {
            mockConnection.execute.mockResolvedValueOnce([[]]);

            await expect(adminService.getMemberByRoleName("candidat")).rejects.toThrow(NotFoundError);
            expect(mockConnection.execute).toHaveBeenCalledWith(expect.any(String), ["candidat"]);
        });

        it("devrait retourner la liste filtrée et exclure l'admin", async () => {
            const dbRows = [
                { PK_id: 1, email: "admin1@test.com", FK_role_id: "admin", firstname: "Admin", lastname: "Un", username: "admin1", biography: "", profil_pic_link: "", creation_date: new Date(), last_connection: new Date() },
                { PK_id: 2, email: "admin2@test.com", FK_role_id: "admin", firstname: "Admin", lastname: "Deux", username: "admin2", biography: "", profil_pic_link: "", creation_date: new Date(), last_connection: new Date() }
            ];
            mockConnection.execute.mockResolvedValueOnce([dbRows]);

            const result = await adminService.getMemberByRoleName("admin", 1);

            expect(result.length).toBe(1);
            expect(result[0]!.id).toBe(2);
        });
    });
});