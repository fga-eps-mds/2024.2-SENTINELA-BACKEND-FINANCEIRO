const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("../routes");
const patrimonioLocalizacaoModel = require("../Models/patrimonioLocalizacaoSchema");
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
    await patrimonioLocalizacaoModel.deleteMany({});
});

describe("PatrimonioLocalizacao API", () => {
    it("should create a new patrimonioLocalizacao", async () => {
        const res = await request(app)
            .post("/patrimonioLocalizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioLocalizacaoData: {
                    de: "Presidencia",
                    para: "Copa",
                    numerodeEtiqueta: 5,
                    datadeCadastro: new Date(),
                },
            }); // Enviar os dados dentro de patrimonioLocalizacaoData

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("numerodeEtiqueta", 5);
    });

    it("should get patrimonioLocalizacao by id", async () => {
        const { body: createdpatrimonioLocalizacao } = await request(app)
            .post("/patrimonioLocalizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioLocalizacaoData: {
                    de: "Presidencia",
                    para: "Copa",
                    numerodeEtiqueta: 5,
                    datadeCadastro: new Date(),
                },
                de: "Get By ID Mock",
            });

        const res = await request(app)
            .get(`/patrimonioLocalizacao/${createdpatrimonioLocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body).toMatchObject(createdpatrimonioLocalizacao);
        expect(res.status).toBe(200);
    });

    it("should get patrimonioLocalizacao", async () => {
        const patrimonioLocalizacaoModelCount =
            await patrimonioLocalizacaoModel.countDocuments({});
        const res = await request(app)
            .get("/patrimonioLocalizacao")
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body.length).toBe(patrimonioLocalizacaoModelCount);
        expect(res.status).toBe(200);
    });

    it("should delete patrimonioLocalizacao", async () => {
        const { body: createdpatrimonioLocalizacao } = await request(app)
            .post("/patrimonioLocalizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioLocalizacaoData: {
                    de: "Presidencia",
                    para: "Copa",
                    numerodeEtiqueta: 5,
                    datadeCadastro: new Date(),
                },
                de: "Delete By ID Mock",
            });

        const res = await request(app)
            .delete(`/patrimonioLocalizacao/delete/${createdpatrimonioLocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body).toMatchObject(createdpatrimonioLocalizacao);
        expect(res.status).toBe(200);
    });

    it("should update patrimonioLocalizacao", async () => {
        const { body: createdpatrimonioLocalizacao } = await request(app)
            .post("/patrimonioLocalizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioLocalizacaoData: {
                    de: "Presidencia",
                    para: "Copa",
                    numerodeEtiqueta: 5,
                    datadeCadastro: new Date(),
                },
                de: "Update By ID Mock",
            });

        const res = await request(app)
            .patch(`/patrimonioLocalizacao/update/${createdpatrimonioLocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(200);
    });

    it("should reject creating patrimonioLocalizacao with missing data", async () => {
        const res = await request(app)
            .post("/patrimonioLocalizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({}); // Enviar dados incompletos

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("should return 404 if patrimonioLocalizacao not found on GET by ID", async () => {
        const nonExistingId = "60f8e8b1d3b99c4b8c6c3bbd"; // ID fictício
        const res = await request(app)
            .get(`/patrimonioLocalizacao/${nonExistingId}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty(
            "error",
            "PatrimonioLocalizacao not found"
        );
    });

    it("should return 404 if patrimonioLocalizacao not found on DELETE", async () => {
        const nonExistingId = "60f8e8b1d3b99c4b8c6c3bbd"; // ID fictício
        const res = await request(app)
            .delete(`/patrimonioLocalizacao/delete/${nonExistingId}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty(
            "error",
            "PatrimonioLocalizacao not found"
        );
    });
    it("should update a patrimonioLocalizacao with partial data", async () => {
        const { body: createdpatrimonioLocalizacao } = await request(app)
            .post("/patrimonioLocalizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioLocalizacaoData: {
                    de: "Presidencia",
                    para: "Copa",
                    numerodeEtiqueta: 5,
                    datadeCadastro: new Date(),
                },
                de: "Update By ID Mock",
            });

        const updatedData = {
            de: "Copa",
            para: "Espaço",
            numerodeEtiqueta: 23,
        };

        const res = await request(app)
            .patch(`/patrimonioLocalizacao/update/${createdpatrimonioLocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({ patrimonioLocalizacaoData: updatedData });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("de", "Copa");
        expect(res.body).toHaveProperty("para", "Espaço");
        expect(res.body).toHaveProperty("numerodeEtiqueta", 23);
    });

    it("should update 'para' status", async () => {
        const { body: createdpatrimonioLocalizacao } = await request(app)
            .post("/patrimonioLocalizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                patrimonioLocalizacaoData: {
                    de: "Presidencia",
                    para: "Copa",
                    numerodeEtiqueta: 5,
                    datadeCadastro: new Date(),
                },
                de: "Update By ID Mock",
            });

        const res = await request(app)
            .patch(`/patrimonioLocalizacao/update/${createdpatrimonioLocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({ patrimonioLocalizacaoData: { para: "Casa" } });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("para", "Casa");
    });
});
