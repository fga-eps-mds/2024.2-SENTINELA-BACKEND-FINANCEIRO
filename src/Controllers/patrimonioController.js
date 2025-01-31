const Patrimonio = require("../Models/patrimonioSchema");

// const validateCPF = (cpf) => {
//     return /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(cpf);
// };

const createpatrimonio = async (req, res) => {
    try {
        console.log("Dados recebidos:", req.body);
        const patrimonioData = req.body.patrimonioData || {};
        if (!patrimonioData) {
            return res.status(400).send({ error: "No data provided" });
        }
        /* if (!validateCPF(financialMovementsData.cpFCnpj)) {
            return res.status(400).send({ error: "Invalid CPF" });  
        } */
        if (!patrimonioData.nome) {
            throw new Error("Database error");
        }

        // Criação da movimentação financeira
        const patrimonio = new patrimonio(
            patrimonioData
        );
        await patrimonio.save();

        res.status(201).send(patrimonio);
    } catch (error) {
        console.error("Error creating patrimonio:", error.message);
        return res.status(400).send({ error: error.message });
    }
};

const getpatrimonio = async (req, res) => {
    try {
        const patrimonio = await Patrimonio.find({});
        return res.status(200).send(patrimonio);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const getpatrimonioById = async (req, res) => {
    try {
        const patrimonio = await patrimonio.findById(
            req.params.id
        );
        if (!patrimonio) {
            return res
                .status(404)
                .send({ error: "Patrimonio not found" });
        }
        return res.status(200).send(patrimonio);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const deletepatrimonioById = async (req, res) => {
    try {
        const deletedpatrimonio =
            await patrimonio.findByIdAndDelete(req.params.id);
        if (!deletedpatrimonio) {
            return res
                .status(404)
                .send({ error: "Patrimonio not found" });
        }
        return res.status(200).send(deletedpatrimonio);
    } catch (error) {
        return res.status(400).send(error);
    }
};

const updatepatrimonioById = async (req, res) => {
    try {
        const patrimonio = await patrimonio.findById(
            req.params.id
        );
        if (!patrimonio) {
            return res
                .status(404)
                .send({ error: "Patrimonio not found" });
        }
        Object.assign(patrimonio, req.body.patrimonioData);
        patrimonio.updatedAt = new Date();
        await patrimonio.save();
        return res.status(200).send(patrimonio);
    } catch (error) {
        return res.status(400).send(error);
    }
};

module.exports = {
    createpatrimonio,
    getpatrimonio,
    getpatrimonioById,
    deletepatrimonioById,
    updatepatrimonioById,
};
