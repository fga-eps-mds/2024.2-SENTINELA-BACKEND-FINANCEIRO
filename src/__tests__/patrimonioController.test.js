const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("../routes");
const patrimonioModel = require("../Models/patrimonioSchema");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mockedToken } = require("./utils.test");

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
    await patrimonioModel.deleteMany({});
});

describe("Patrimonio API", () => {
    it("should create a new patrimonio", async () => {
        const res = await request(app)
            .post("/patrimonio/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioData: {
                    nome: "Computador X",
                    descricao: "Computador usado",
                    valor: 200,
                    numerodeSerie: "2CFF4A",
                    numerodeEtiqueta: 5,
                    localizacao: "Copa",
                    doacao: false,
                    datadeCadastro: new Date(),
                },
            }); // Enviar os dados dentro de patrimonioData

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("nome", "Computador X");
    });

    it("should get patrimonio by id", async () => {
        const { body: createdpatrimonio } = await request(app)
            .post("/patrimonio/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioData: {
                    nome: "Computador X",
                    descricao: "Computador usado",
                    valor: 200,
                    numerodeSerie: "2CFF4A",
                    numerodeEtiqueta: 5,
                    localizacao: "Copa",
                    doacao: false,
                    datadeCadastro: new Date(),
                },
                descricao: "Get By ID Mock",
            });

        const res = await request(app)
            .get(`/patrimonio/${createdpatrimonio._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body).toMatchObject(createdpatrimonio);
        expect(res.status).toBe(200);
    });

    it("should get patrimonio", async () => {
        const patrimonioModelCount =
            await patrimonioModel.countDocuments({});
        const res = await request(app)
            .get("/patrimonio")
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body.length).toBe(patrimonioModelCount);
        expect(res.status).toBe(200);
    });

    it("should delete patrimonio", async () => {
        const { body: createdpatrimonio } = await request(app)
            .post("/patrimonio/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioData: {
                    nome: "Computador X",
                    descricao: "Computador usado",
                    valor: 200,
                    numerodeSerie: "2CFF4A",
                    numerodeEtiqueta: 5,
                    localizacao: "Copa",
                    doacao: false,
                    datadeCadastro: new Date(),
                },
                nome: "Delete By ID Mock",
            });

        const res = await request(app)
            .delete(`/patrimonio/delete/${createdpatrimonio._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body).toMatchObject(createdpatrimonio);
        expect(res.status).toBe(200);
    });

    it("should update patrimonio", async () => {
        const { body: createdpatrimonio } = await request(app)
            .post("/patrimonio/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioData: {
                    nome: "Computador X",
                    descricao: "Computador usado",
                    valor: 200,
                    numerodeSerie: "2CFF4A",
                    numerodeEtiqueta: 5,
                    localizacao: "Copa",
                    doacao: false,
                    datadeCadastro: new Date(),
                },
                nome: "Update By ID Mock",
            });

        const res = await request(app)
            .patch(`/patrimonio/update/${createdpatrimonio._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(200);
    });

    it("should reject creating patrimonio with missing data", async () => {
        const res = await request(app)
            .post("/patrimonio/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({}); // Enviar dados incompletos

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("should return 404 if patrimonio not found on GET by ID", async () => {
        const nonExistingId = "60f8e8b1d3b99c4b8c6c3bbd"; // ID fictício
        const res = await request(app)
            .get(`/patrimonio/${nonExistingId}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty(
            "error",
            "Patrimonio not found"
        );
    });

    it("should return 404 if patrimonio not found on DELETE", async () => {
        const nonExistingId = "60f8e8b1d3b99c4b8c6c3bbd"; // ID fictício
        const res = await request(app)
            .delete(`/patrimonio/delete/${nonExistingId}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty(
            "error",
            "Patrimonio not found"
        );
    });
    it("should update a patrimonio with partial data", async () => {
        const { body: createdpatrimonio } = await request(app)
            .post("/patrimonio/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioData: {
                    nome: "Computador X",
                    descricao: "Computador usado",
                    valor: 200,
                    numerodeSerie: "2CFF4A",
                    numerodeEtiqueta: 5,
                    localizacao: "Copa",
                    doacao: false,
                    datadeCadastro: new Date(),
                },
                nome: "Update By ID Mock",
            });

        const updatedData = {
            nome: "Computador X Atualizado",
            valor: 1200,
            numerodeEtiqueta: 23,
        };

        const res = await request(app)
            .patch(`/patrimonio/update/${createdpatrimonio._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({ patrimonioData: updatedData });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("nome", "Computador X Atualizado");
        expect(res.body).toHaveProperty("valor", 1200);
        expect(res.body).toHaveProperty("numerodeEtiqueta", 23);
    });

    it("should update 'doacao' status", async () => {
        const { body: createdpatrimonio } = await request(app)
            .post("/patrimonio/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioData: {
                    nome: "Computador X",
                    descricao: "Computador usado",
                    valor: 200,
                    numerodeSerie: "2CFF4A",
                    numerodeEtiqueta: 5,
                    localizacao: "Copa",
                    doacao: false,
                    datadeCadastro: new Date(),
                },
                nome: "Update By ID Mock",
            });

        const res = await request(app)
            .patch(`/patrimonio/update/${createdpatrimonio._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({ patrimonioData: { doacao: true } });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("doacao", true);
    });
});
