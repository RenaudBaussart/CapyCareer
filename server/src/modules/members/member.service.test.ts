import { MemberService } from "./member.service";
import { Pool } from "mysql2/promise";

describe("MemberService - getAllMembers", () => {
    let memberService: MemberService;
    let mockConnection: any
    let mockPool: any;

    beforeEach(() => {
        mockConnection = {
            execute: jest.fn(),
            release: jest.fn(),
        };
        
        mockPool = {
            getConnection: jest.fn().mockResolvedValue(mockConnection),
        };

        memberService = new MemberService(mockPool as unknown as Pool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Cas d'erreurs", () => {
        it("devrait lancer une erreur si la requête échoue", async () => {
            const errorMessage = "Erreur de base de données";
            mockConnection.execute.mockRejectedValueOnce(new Error(errorMessage));

            await expect(memberService.getAllMembers()).rejects.toThrow(errorMessage);
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it("devrait libérer la connexion même si la récupération de connexion échoue", async () => {
            mockPool.getConnection.mockRejectedValueOnce(new Error("Connexion impossible"));

            await expect(memberService.getAllMembers()).rejects.toThrow("Connexion impossible");
        });

        it("devrait lancer NO_MEMBERS_FOUND si aucun membre n'est trouvé", async () => {
            mockConnection.execute.mockResolvedValueOnce([[]]);

            await expect(memberService.getAllMembers()).rejects.toThrow("NO_MEMBERS_FOUND");
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it("devrait lancer NO_MEMBERS_FOUND si seul le membre courant est présent", async () => {
            const dbRows = [
                { PK_id: 1, email: "john.doe@example.com", FK_role_id: 1, firstname: "John", lastname: "Doe", username: "johndoe", biography: "I am John Doe", profil_pic_link: "https://example.com/johndoe.jpg", creation_date: new Date(), last_connection: new Date() }
            ];
            mockConnection.execute.mockResolvedValueOnce([dbRows]);

            await expect(memberService.getAllMembers(1)).rejects.toThrow("NO_MEMBERS_FOUND");
            expect(mockConnection.release).toHaveBeenCalled();
        });
    });

    describe("Cas de succès", () => {
        it("devrait retourner la liste des membres si la requête réussit", async () => {
            const dbRows = [
                { PK_id: 1, email: "john.doe@example.com", FK_role_id: 1, firstname: "John", lastname: "Doe", username: "johndoe", biography: "I am John Doe", profil_pic_link: "https://example.com/johndoe.jpg", creation_date: new Date(), last_connection: new Date() },
                { PK_id: 2, email: "jane.smith@example.com", FK_role_id: 1, firstname: "Jane", lastname: "Smith", username: "janesmith", biography: "I am Jane Smith", profil_pic_link: "https://example.com/janesmith.jpg", creation_date: new Date(), last_connection: new Date() }
            ];
            mockConnection.execute.mockResolvedValueOnce([dbRows]);

            const expected = dbRows.map(row => ({
                id: row.PK_id,
                email: row.email,
                role: row.FK_role_id,
                firstname: row.firstname,
                lastname: row.lastname,
                username: row.username,
                biography: row.biography,
                profil_pic_link: row.profil_pic_link,
                creation_date: row.creation_date,
                last_connection: row.last_connection
            }));

            const result = await memberService.getAllMembers();
            expect(mockConnection.execute).toHaveBeenCalledWith("SELECT PK_id, email, FK_role_id, firstname, lastname, username, biography, profil_pic_link, creation_date, last_connection FROM User_");
            expect(result).toEqual(expected);
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it("devrait exclure le membre courant si un id est fourni", async () => {
            const dbRows = [
                { PK_id: 1, email: "john.doe@example.com", FK_role_id: 1, firstname: "John", lastname: "Doe", username: "johndoe", biography: "I am John Doe", profil_pic_link: "https://example.com/johndoe.jpg", creation_date: new Date(), last_connection: new Date() },
                { PK_id: 2, email: "jane.smith@example.com", FK_role_id: 1, firstname: "Jane", lastname: "Smith", username: "janesmith", biography: "I am Jane Smith", profil_pic_link: "https://example.com/janesmith.jpg", creation_date: new Date(), last_connection: new Date() }
            ];
            mockConnection.execute.mockResolvedValueOnce([dbRows]);
            const secondRow = dbRows[1]!;

            const result = await memberService.getAllMembers(1);

            expect(result).toEqual([
                {
                    id: 2,
                    email: "jane.smith@example.com",
                    role: 1,
                    firstname: "Jane",
                    lastname: "Smith",
                    username: "janesmith",
                    biography: "I am Jane Smith",
                    profil_pic_link: "https://example.com/janesmith.jpg",
                    creation_date: secondRow.creation_date,
                    last_connection: secondRow.last_connection
                }
            ]);
            expect(mockConnection.release).toHaveBeenCalled();
        });
    });
});