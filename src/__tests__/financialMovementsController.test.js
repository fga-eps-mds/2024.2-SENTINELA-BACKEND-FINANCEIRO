const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("../routes");
const financialMovementsModel = require("../Models/financialMovementsSchema");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let app = express();

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    app.use("/", routes);
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await financialMovementsModel.deleteMany({});
});

describe("FinancialMovements API", () => {
    it("should create a new financial movement", async () => {
        const res = await request(app)
            .post("/financialMovements/create")
            .send({
                financialMovementsData: {
                    contaOrigem: "12345",
                    contaDestino: "67890",
                    nomeOrigem: "João Silva",
                    nomeDestino: "Maria Souza",
                    tipoDocumento: "Transferência",
                    cpFCnpj: "123.456.789-00",
                    valorBruto: 1000,
                    valorLiquido: 950,
                    acrescimo: 50,
                    desconto: 0,
                    formadePagamento: "PIX",
                    datadeVencimento: new Date(),
                    datadePagamento: new Date(),
                    baixada: false,
                    descricao: "Pagamento de serviço",
                },
            }); // Enviar os dados dentro de financialMovementsData

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("nomeOrigem", "João Silva");
    });

    it("should get financial movement by id", async () => {
        const { body: createdFMovements } = await request(app)
            .post("/financialMovements/create")
            .send({
                financialMovementsData: {
                    contaOrigem: "12345",
                    contaDestino: "67890",
                    nomeOrigem: "João Silva",
                    nomeDestino: "Maria Souza",
                    tipoDocumento: "Transferência",
                    cpFCnpj: "123.456.789-00",
                    valorBruto: 1000,
                    valorLiquido: 950,
                    acrescimo: 50,
                    desconto: 0,
                    formadePagamento: "PIX",
                    datadeVencimento: new Date(),
                    datadePagamento: new Date(),
                    baixada: false,
                    descricao: "Pagamento de serviço",
                },
                contaOrigem: "Get By ID Mock",
            });

        const res = await request(app).get(
            `/financialMovements/${createdFMovements._id}`
        );

        expect(res.body).toMatchObject(createdFMovements);
        expect(res.status).toBe(200);
    });

    it("should get financial movements", async () => {
        const financialMovementsModelCount =
            await financialMovementsModel.countDocuments({});
        const res = await request(app).get("/financialMovements");

        expect(res.body.length).toBe(financialMovementsModelCount);
        expect(res.status).toBe(200);
    });

    it("should delete financial movement", async () => {
        const { body: createdFMovements } = await request(app)
            .post("/financialMovements/create")
            .send({
                financialMovementsData: {
                    contaOrigem: "12345",
                    contaDestino: "67890",
                    nomeOrigem: "João Silva",
                    nomeDestino: "Maria Souza",
                    tipoDocumento: "Transferência",
                    cpFCnpj: "123.456.789-00",
                    valorBruto: 1000,
                    valorLiquido: 950,
                    acrescimo: 50,
                    desconto: 0,
                    formadePagamento: "PIX",
                    datadeVencimento: new Date(),
                    datadePagamento: new Date(),
                    baixada: false,
                    descricao: "Pagamento de serviço",
                },
                contaOrigem: "Delete By ID Mock",
            });

        const res = await request(app).delete(
            `/financialMovements/delete/${createdFMovements._id}`
        );

        expect(res.body).toMatchObject(createdFMovements);
        expect(res.status).toBe(200);
    });

    it("should update financial movement", async () => {
        const { body: createdFMovements } = await request(app)
            .post("/financialMovements/create")
            .send({
                financialMovementsData: {
                    contaOrigem: "12345",
                    contaDestino: "67890",
                    nomeOrigem: "João Silva",
                    nomeDestino: "Maria Souza",
                    tipoDocumento: "Transferência",
                    cpFCnpj: "123.456.789-00",
                    valorBruto: 1000,
                    valorLiquido: 950,
                    acrescimo: 50,
                    desconto: 0,
                    formadePagamento: "PIX",
                    datadeVencimento: new Date(),
                    datadePagamento: new Date(),
                    baixada: false,
                    descricao: "Pagamento de serviço",
                },
                contaOrigem: "Update By ID Mock",
            });

        const res = await request(app).patch(
            `/financialMovements/update/${createdFMovements._id}`
        );

        expect(res.status).toBe(200);
    });

    it("should reject creating financial movement with missing data", async () => {
        const res = await request(app)
            .post("/financialMovements/create")
            .send({}); // Enviar dados incompletos
    
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("should return 404 if financial movement not found on GET by ID", async () => {
        const nonExistingId = "60f8e8b1d3b99c4b8c6c3bbd"; // ID fictício
        const res = await request(app).get(`/financialMovements/${nonExistingId}`);
    
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Financial Movement not found");
    });
    
    it("should return 404 if financial movement not found on DELETE", async () => {
        const nonExistingId = "60f8e8b1d3b99c4b8c6c3bbd"; // ID fictício
        const res = await request(app).delete(`/financialMovements/delete/${nonExistingId}`);
    
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Financial Movement not found");
    });
    it("should update a financial movement with partial data", async () => {
        const { body: createdFMovements } = await request(app)
            .post("/financialMovements/create")
            .send({
                financialMovementsData: {
                    contaOrigem: "12345",
                    contaDestino: "67890",
                    nomeOrigem: "João Silva",
                    nomeDestino: "Maria Souza",
                    tipoDocumento: "Transferência",
                    cpFCnpj: "123.456.789-00",
                    valorBruto: 1000,
                    valorLiquido: 950,
                    acrescimo: 50,
                    desconto: 0,
                    formadePagamento: "PIX",
                    datadeVencimento: new Date(),
                    datadePagamento: new Date(),
                    baixada: false,
                    descricao: "Pagamento de serviço",
                },
            });
    
        const updatedData = {
            nomeOrigem: "João Silva Atualizado",
            valorBruto: 1200,
        };
    
        const res = await request(app)
            .patch(`/financialMovements/update/${createdFMovements._id}`)
            .send({ financialMovementsData: updatedData });
    
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("nomeOrigem", "João Silva Atualizado");
        expect(res.body).toHaveProperty("valorBruto", 1200);
    });

    it("should update 'baixada' status", async () => {
        const { body: createdFMovements } = await request(app)
            .post("/financialMovements/create")
            .send({
                financialMovementsData: {
                    contaOrigem: "12345",
                    contaDestino: "67890",
                    nomeOrigem: "João Silva",
                    nomeDestino: "Maria Souza",
                    tipoDocumento: "Transferência",
                    cpFCnpj: "123.456.789-00",
                    valorBruto: 1000,
                    valorLiquido: 950,
                    acrescimo: 50,
                    desconto: 0,
                    formadePagamento: "PIX",
                    datadeVencimento: new Date(),
                    datadePagamento: new Date(),
                    baixada: false,
                    descricao: "Pagamento de serviço",
                },
            });
    
        const res = await request(app)
            .patch(`/financialMovements/update/${createdFMovements._id}`)
            .send({ financialMovementsData: { baixada: true } });
    
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("baixada", true);
    });
        
                
});
