const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("../routes");
const LocalizacaoModel = require("../Models/LocalizacaoSchema");
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
    await LocalizacaoModel.deleteMany({});
});

describe("Localizacao API", () => {
    it("should create a new localizacao", async () => {
        const res = await request(app)
            .post("/localizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                localizacaoData: {
                    localizacao: "Copa",
                },
            }); // Enviar os dados dentro de LocalizacaoData

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("localizacao", "Copa");
    });

    it("should get localizacao by id", async () => {
        const { body: createdlocalizacao } = await request(app)
            .post("/localizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                localizacaoData: {
                    localizacao: "Copa",
                },
                de: "Get By ID Mock",
            });

        const res = await request(app)
            .get(`/localizacao/${createdlocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body).toMatchObject(createdlocalizacao);
        expect(res.status).toBe(200);
    });

    it("should get localizacao", async () => {
        const localizacaoModelCount = await LocalizacaoModel.countDocuments({});
        const res = await request(app)
            .get("/localizacao")
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body.length).toBe(localizacaoModelCount);
        expect(res.status).toBe(200);
    });

    it("should delete localizacao", async () => {
        const { body: createdlocalizacao } = await request(app)
            .post("/localizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                localizacaoData: {
                    localizacao: "Copa",
                },
                de: "Get By ID Mock",
            });

        const res = await request(app)
            .delete(`/localizacao/delete/${createdlocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.body).toMatchObject(createdlocalizacao);
        expect(res.status).toBe(200);
    });

    it("should update localizacao", async () => {
        const { body: createdlocalizacao } = await request(app)
            .post("/localizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                localizacaoData: {
                    localizacao: "Copa",
                },
                de: "Get By ID Mock",
            });

        const res = await request(app)
            .patch(`/localizacao/update/${createdlocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(200);
    });

    it("should reject creating localizacao with missing data", async () => {
        const res = await request(app)
            .post("/localizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({}); // Enviar dados incompletos

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("should return 404 if localizacao not found on GET by ID", async () => {
        const nonExistingId = "60f8e8b1d3b99c4b8c6c3bbd"; // ID fictício
        const res = await request(app)
            .get(`/localizacao/${nonExistingId}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Localizacao not found");
    });

    it("should return 404 if localizacao not found on DELETE", async () => {
        const nonExistingId = "60f8e8b1d3b99c4b8c6c3bbd"; // ID fictício
        const res = await request(app)
            .delete(`/localizacao/delete/${nonExistingId}`)
            .set("Authorization", `Bearer ${mockedToken()}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Localizacao not found");
    });
    it("should update a localizacao with partial data", async () => {
        const { body: createdlocalizacao } = await request(app)
            .post("/localizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                localizacaoData: {
                    localizacao: "Copa",
                },
                de: "Get By ID Mock",
            });

        const updatedData = {
            localizacao: "Espaço",
        };

        const res = await request(app)
            .patch(`/localizacao/update/${createdlocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({ localizacaoData: updatedData });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("localizacao", "Espaço");
    });

    it("should update 'para' status", async () => {
        const { body: createdlocalizacao } = await request(app)
            .post("/localizacao/create")
            .set("Authorization", `Bearer ${mockedToken()}`)
            .send({
                localizacaoData: {
                    localizacao: "Copa",
                },
                de: "Get By ID Mock",
            });

        const res = await request(app)
            .patch(`/localizacao/update/${createdlocalizacao._id}`)
            .set("Authorization", `Bearer ${mockedToken()}`) // Atualize o caminho da rota
            .send({ localizacaoData: { localizacao: "Casa" } });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("localizacao", "Casa");
    });
});
