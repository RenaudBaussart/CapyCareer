import dotenv from "dotenv";
dotenv.config({ path: ".env.test" }); 

process.env.JWT_SECRET = "secret_global_pour_tous_les_tests";
process.env.NODE_ENV = "test";

beforeAll(() => {
   
});

afterAll(() => {
   
});