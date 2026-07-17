import { MemberService } from "./member.service";
import { Pool } from "mysql2/promise";



describe("MemberService - getMemberById", () => {
    let memberService: MemberService;
    let mockConnection: any;
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

            await expect(memberService.getMemberById(1)).rejects.toThrow(errorMessage);
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it("devrait lancer NotFoundError si aucun membre n'est trouvé", async () => {
            mockConnection.execute.mockResolvedValueOnce([[]]);

            await expect(memberService.getMemberById(1)).rejects.toThrow("MEMBER_NOT_FOUND");
            expect(mockConnection.release).toHaveBeenCalled();
        });
    });

    describe("Cas de succès", () => {
        it("devrait retourner le profil du membre si la requête réussit", async () => {
            const dbRow = { PK_id: 1, email: "john.doe@example.com", FK_role_id: 1, firstname: "John", lastname: "Doe", username: "johndoe", biography: "I am John Doe", profil_pic_link: "https://example.com/johndoe.jpg", creation_date: new Date(), last_connection: new Date() };
            mockConnection.execute.mockResolvedValueOnce([[dbRow]]);

            const result = await memberService.getMemberById(1);

            expect(mockConnection.execute).toHaveBeenCalledWith(
                "SELECT PK_id, email, FK_role_id, firstname, lastname, username, biography, profil_pic_link, creation_date, last_connection FROM User_ WHERE PK_id = ?", 
                [1]
            );

            expect(result).toEqual({
                id: dbRow.PK_id,
                email: dbRow.email,
                role: dbRow.FK_role_id,
                firstname: dbRow.firstname,
                lastname: dbRow.lastname,
                username: dbRow.username,
                biography: dbRow.biography,
                profil_pic_link: dbRow.profil_pic_link,
                creation_date: dbRow.creation_date,
                last_connection: dbRow.last_connection
            });

            expect(mockConnection.release).toHaveBeenCalled();
        });
    });
});