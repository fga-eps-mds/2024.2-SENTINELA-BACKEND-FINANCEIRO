const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bankAccountRouter = require("../routes"); // Atualize o caminho para o arquivo de rotas
const { mockedToken } = require('./utils.test')


let mongoServer;
let app = express();



beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    app.use(express.json());
    app.use("/", bankAccountRouter); // Atualize o prefixo da rota para '/finance'
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});



describe("BankAccount API", () => {
    it("should create a new bank account", async () => {        
        const response = await request(app)
            .post("/finance/createBankAccount")
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({
                formData: {
                    name: "Conta Teste",
                    bank: "Banco Teste",
                    accountNumber: "12345678",
                    status: "Ativo",
                    accountType: "Conta Corrente",
                },
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("name", "Conta Teste");
    });

    it("should not create a bank account with an existing name", async () => {
        await request(app)
            .post("/finance/createBankAccount")
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({
                formData: {
                    name: "Conta Teste",
                    bank: "Banco Teste",
                    accountNumber: "12345678",
                    status: "Ativo",
                    accountType: "Conta Corrente",
                },
            });

        const response = await request(app)
            .post("/finance/createBankAccount")
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({
                formData: {
                    name: "Conta Teste",
                    bank: "Banco Teste",
                    accountNumber: "87654321",
                },
            });

        console.log("Conflict Response:", response.body); // Adicione um log para depuração

        expect(response.status).toBe(409);
        expect(response.body.error).toBe("Nome já cadastrado");
    });

    it("should not create a bank account with a blank name", async () => {
        const response = await request(app)
            .post("/finance/createBankAccount") // Atualize o caminho da rota
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                formData: {
                    name: "",
                    bank: "Banco Teste",
                    accountNumber: "12345678",
                    status: "Ativo",
                    accountType: "Conta Corrente",
                },
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Nome não fornecido");
    });

    it("should fetch a bank account by ID", async () => {
        const newAccount = await request(app)
            .post("/finance/createBankAccount") // Atualize o caminho da rota
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                formData: {
                    name: "Conta Teste ID",
                    bank: "Banco Teste ID",
                    accountNumber: "11111111",
                    status: "Ativo",
                    accountType: "Conta Corrente",
                },
            });

        const response = await request(app).get(
            `/finance/bankAccount/${newAccount.body._id}`
        ).set("Authorization", `Bearer ${mockedToken()}`); // Atualize o caminho da rota

        console.log("Fetch By ID Response:", response.body); // Adicione um log para depuração

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Conta Teste ID");
    });

    it("should not fetch a bank account without ID", async () => {
        await request(app)
            .post("/finance/createBankAccount")
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({
                formData: {
                    name: "Conta Teste ID",
                    bank: "Banco Teste ID",
                    accountNumber: "11111111",
                    status: "Ativo",
                    accountType: "Conta Corrente",
                },
            });

        const response = await request(app).get(`/finance/bankAccount/${null}`).set("Authorization", `Bearer ${mockedToken()}`); // Atualize o caminho da rota

        console.log("Fetch By ID Response:", response.body); // Adicione um log para depuração

        expect(response.status).toBe(500);
    });
    it("should fetch all bank accounts", async () => {
        const response = await request(app).get("/finance/getBankAccount").set("Authorization", `Bearer ${mockedToken()}`); // Atualize o caminho da rota

        console.log("Fetch All Response:", response.body); // Adicione um log para depuração

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it("should update a bank account", async () => {
        const newAccount = await request(app)
            .post("/finance/createBankAccount")
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({
                formData: {
                    name: "Conta a ser Atualizada",
                    bank: "Banco Teste Atualização",
                    accountNumber: "22222222",
                    status: "Ativo",
                    accountType: "Conta Corrente",
                },
            });

        const response = await request(app)
            .patch(`/finance/updateBankAccount/${newAccount.body._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({ name: "Conta Atualizada" });

        console.log("Update Response:", response.body); // Adicione um log para depuração

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Conta Atualizada");
    });

    it("should not update a bank account without id", async () => {
        await request(app)
            .post("/finance/createBankAccount")
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({
                formData: {
                    name: "Conta a ser Atualizada",
                    bank: "Banco Teste Atualização",
                    accountNumber: "22222222",
                    status: "Ativo",
                    accountType: "Conta Corrente",
                },
            });

        const response = await request(app)
            .patch(`/finance/updateBankAccount/${null}`)
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({ name: "Conta Atualizada" });

        console.log("Update Response:", response.body); // Adicione um log para depuração

        expect(response.status).toBe(500);
    });

    it("should delete a bank account", async () => {
        const newAccount = await request(app)
            .post("/finance/createBankAccount")
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({
                formData: {
                    name: "Conta a ser Deletada",
                    bank: "Banco Teste Deletar",
                    accountNumber: "33333333",
                    status: "Ativo",
                    accountType: "Conta Corrente",
                },
            });

        const response = await request(app).delete(
            `/finance/deleteBankAccount/${newAccount.body._id}`
        ).set("Authorization", `Bearer ${mockedToken()}`); // Atualize o caminho da rota

        console.log("Delete Response:", response.body); // Adicione um log para depuração

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Conta deletada com sucesso");
    });
    it("should delete a bank account", async () => {
        const response = await request(app).delete(
            `/finance/deleteBankAccount/${null}`
        ).set("Authorization", `Bearer ${mockedToken()}`); // Atualize o caminho da rota

        expect(response.status).toBe(500);
    });

    it("should return 404 if bank account is not found by ID", async () => {
        const invalidId = new mongoose.Types.ObjectId(); // Gerar um ID válido, mas que não está no banco

        const response = await request(app).get(
            `/finance/getBankAccountbyId/${invalidId}`
        ).set("Authorization", `Bearer ${mockedToken()}`);

        expect(response.status).toBe(404);
    });
});
it("should return 500 when fetching a bank account with invalid ID", async () => {
    const response = await request(app).get(`/finance/bankAccount/${null}`).set("Authorization", `Bearer ${mockedToken()}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("ID inválido ou ausente");
});
it("should return 500 when updating a bank account with invalid ID", async () => {
    const response = await request(app)
        .patch(`/finance/updateBankAccount/${null}`)
        .set("Authorization", `Bearer ${mockedToken()}`)
        .send({ name: "Conta Atualizada" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("ID inválido ou ausente");
});
it("should delete a bank account", async () => {
    const newAccount = await request(app)
        .post("/finance/createBankAccount")
        .set("Authorization", `Bearer ${mockedToken()}`)
        .send({
            formData: {
                name: "Conta a ser Deletada 2",
                bank: "Banco Teste Deletar",

                accaccountNumber: "33333333",
                status: "Ativo",
                accountType: "Conta Corrente",
            },
        });
        
        
        const response = await request(app).delete(
            `/finance/deleteBankAccount/${newAccount.body._id}`
        ).set("Authorization", `Bearer ${mockedToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Conta deletada com sucesso");
});

it("should return 500 when deleting a bank account with invalid ID", async () => {
    const response = await request(app).delete(`/finance/deleteBankAccount/${null}`).set("Authorization", `Bearer ${mockedToken()}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("ID inválido ou ausente");
});

it("should return 500 if the name is invalid", async () => {
    const response = await request(app)
        .post("/finance/createBankAccount")
        .set("Authorization", `Bearer ${mockedToken()}`)
        .send({
            formData: {
                name: 12345, // Tipo inválido
                bank: "Banco Teste",
                accountNumber: "98765432",
                status: "Ativo",
                accountType: "Conta Corrente",
            },
        });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Tipo de dado incorreto");
});
