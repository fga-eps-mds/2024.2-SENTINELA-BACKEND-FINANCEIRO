const Localizacao = require("../Models/LocalizacaoSchema");

// const validateCPF = (cpf) => {
//     return /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(cpf);
// };

const createlocalizacao = async (req, res) => {
    try {
        console.log("Dados recebidos:", req.body);
        const localizacaoData = req.body.localizacaoData;
        if (!localizacaoData) {
            return res.status(400).send({ error: "No data provided" });
        }

        // Criação da movimentação financeira
        const localizacao = new Localizacao(
            localizacaoData
        );
        await localizacao.save();

        res.status(201).send(localizacao);
    } catch (error) {
        console.error("Error creating localizacao:", error.message);
        return res.status(400).send({ error: error.message });
    }
};

const getlocalizacao = async (req, res) => {
    try {
        const localizacao = await Localizacao.find({});
        return res.status(200).send(localizacao);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const getlocalizacaoById = async (req, res) => {
    try {
        const localizacao = await Localizacao.findById(
            req.params.id
        );
        if (!localizacao) {
            return res
                .status(404)
                .send({ error: "Localizacao not found" });
        }
        return res.status(200).send(localizacao);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const deletelocalizacaoById = async (req, res) => {
    try {
        const deletedlocalizacao =
            await Localizacao.findByIdAndDelete(req.params.id);
        if (!deletedlocalizacao) {
            return res
                .status(404)
                .send({ error: "Localizacao not found" });
        }
        return res.status(200).send(deletedlocalizacao);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const updatelocalizacaoById = async (req, res) => {
    try {
        const localizacao = await Localizacao.findById(
            req.params.id
        );
        if (!localizacao) {
            return res
                .status(404)
                .send({ error: "Localizacao not found" });
        }
        Object.assign(localizacao, req.body.localizacaoData);
        localizacao.updatedAt = new Date();
        await localizacao.save();
        return res.status(200).send(localizacao);
    } catch (error) {
        return res.status(400).send(error);
    }
};

module.exports = {
    createlocalizacao,
    getlocalizacao,
    getlocalizacaoById,
    deletelocalizacaoById,
    updatelocalizacaoById,
};
