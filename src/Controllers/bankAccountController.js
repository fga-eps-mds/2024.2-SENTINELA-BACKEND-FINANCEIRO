const mongoose = require("mongoose"); // Importar mongoose

const BankAccount = require("../Models/bankAccountSchema"); // Importação do modelo

const createBankAccount = async (req, res) => {
    try {
        // Log dos dados recebidos para depuração
        console.log("Dados recebidos:", req.body);

        // Acessando dados diretamente
        const formData = req.body.formData || {}; // Fallback para objeto vazio se formData estiver ausente
        const { name } = formData;

        if (!name) {
            return res.status(400).send({ error: "Nome não fornecido" }); // Erro caso 'name' esteja faltando
        }

        // Verifica se já existe uma conta bancária com o mesmo nome
        if (typeof name == "string") {
            const existingName = await BankAccount.findOne({ name });

            if (existingName) {
                // Mensagem de erro se o nome já estiver repetido
                return res.status(409).send({ error: "Nome já cadastrado" }); // Código 409 para conflito
            }
        } else {
            return res.status(500).send({ error: "Tipo de dado incorreto" });
        }

        // Criação de uma nova conta bancária
        const bankAccount = new BankAccount(formData);
        await bankAccount.save(); // Salvando a conta bancária no banco de dados
        console.log("Conta bancária criada com sucesso:", bankAccount);
        res.status(201).send(bankAccount); // Enviando resposta de sucesso
    } catch (error) {
        // Log do erro para depuração
        console.error("Erro ao criar conta bancária:", error.message);
        res.status(400).send({ error: error.message }); // Enviando erro caso ocorra
    }
};

const getAll = async (req, res) => {
    try {
        const bankAccount = await BankAccount.find({});
        return res.status(200).send(bankAccount);
    } catch (error) {
        return res.status(400).send({ error });
    }
};

const getBankAccountbyId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(500).send({ error: "ID inválido ou ausente" });
        }
        const bankAccount = await BankAccount.findById(id); // Buscando conta pelo ID
        if (!bankAccount) {
            return res.status(404).send({ message: "Conta não encontrada" });
        }
        res.status(200).json(bankAccount); // Enviando conta bancária encontrada
    } catch (error) {
        console.error("Erro ao buscar conta bancária:", error.message);
        res.status(500).send({ error: error.message || "Erro interno" }); // Garantindo que a resposta tenha a chave 'error'
    }
};

const deleteBankAccount = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(500).send({ error: "ID inválido ou ausente" });
        }
        const bankAccount = await BankAccount.findByIdAndDelete(req.params.id); // Deletando conta pelo ID
        if (!bankAccount) {
            return res.status(404).send({ message: "Conta não encontrada" }); // Enviando mensagem de erro se a conta não for encontrada
        }
        res.status(200).send({ message: "Conta deletada com sucesso" });
    } catch (error) {
        // Log do erro para depuração
        console.error("Erro ao deletar conta bancária:", error.message);
        res.status(500).send({ error: error.message }); // Enviando mensagem de erro
    }
};

const updateBankAccount = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(500).send({ error: "ID inválido ou ausente" });
        }

        // Log dos dados recebidos
        console.log("Dados recebidos para atualização:", req.body);

        // Atualizar apenas os campos fornecidos
        const bankAccount = await BankAccount.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!bankAccount) {
            return res.status(404).send({ message: "Conta não encontrada" });
        }

        res.status(200).send(bankAccount);
    } catch (error) {
        console.error("Erro ao atualizar conta bancária:", error.message);
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createBankAccount,
    deleteBankAccount,
    getBankAccountbyId,
    updateBankAccount,
    getAll,
};
