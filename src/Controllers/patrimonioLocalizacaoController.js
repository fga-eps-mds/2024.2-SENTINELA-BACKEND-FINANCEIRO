const PatrimonioLocalizacao = require("../Models/patrimonioLocalizacaoSchema");

// const validateCPF = (cpf) => {
//     return /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(cpf);
// };

const createpatrimonioLocalizacao = async (req, res) => {
    try {
        console.log("Dados recebidos:", req.body);
        const patrimonioLocalizacaoData = req.body.patrimonioLocalizacaoData || {};
        if (!patrimonioLocalizacaoData) {
            return res.status(400).send({ error: "No data provided" });
        }

        // Criação da movimentação financeira
        const patrimonioLocalizacao = new PatrimonioLocalizacao(
            patrimonioLocalizacaoData
        );
        await patrimonioLocalizacao.save();

        res.status(201).send(patrimonioLocalizacao);
    } catch (error) {
        console.error("Error creating patrimonio:", error.message);
        return res.status(400).send({ error: error.message });
    }
};

const getpatrimonioLocalizacao = async (req, res) => {
    try {
        const patrimonioLocalizacao = await PatrimonioLocalizacao.find({});
        return res.status(200).send(patrimonioLocalizacao);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const getpatrimonioLocalizacaoById = async (req, res) => {
    try {
        const patrimonioLocalizacao = await PatrimonioLocalizacao.findById(
            req.params.id
        );
        if (!patrimonioLocalizacao) {
            return res
                .status(404)
                .send({ error: "PatrimonioLocalizacao not found" });
        }
        return res.status(200).send(patrimonioLocalizacao);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const deletepatrimonioLocalizacaoById = async (req, res) => {
    try {
        const deletedpatrimonioLocalizacao =
            await PatrimonioLocalizacao.findByIdAndDelete(req.params.id);
        if (!deletedpatrimonioLocalizacao) {
            return res
                .status(404)
                .send({ error: "PatrimonioLocalizacao not found" });
        }
        return res.status(200).send(deletedpatrimonioLocalizacao);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const updatepatrimonioLocalizacaoById = async (req, res) => {
    try {
        const patrimonioLocalizacao = await PatrimonioLocalizacao.findById(
            req.params.id
        );
        if (!patrimonioLocalizacao) {
            return res
                .status(404)
                .send({ error: "Patrimonio not found" });
        }
        Object.assign(patrimonioLocalizacao, req.body.patrimonioData);
        patrimonioLocalizacao.updatedAt = new Date();
        await patrimonioLocalizacao.save();
        return res.status(200).send(patrimonioLocalizacao);
    } catch (error) {
        return res.status(400).send(error);
    }
};

module.exports = {
    createpatrimonioLocalizacao,
    getpatrimonioLocalizacao,
    getpatrimonioLocalizacaoById,
    deletepatrimonioLocalizacaoById,
    updatepatrimonioLocalizacaoById,
};
