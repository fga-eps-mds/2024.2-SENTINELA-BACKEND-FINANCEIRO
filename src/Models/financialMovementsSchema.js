const mongoose = require("mongoose");

const financialMovementsSchema = new mongoose.Schema({
    contaOrigem: {
        type: String,
        required: true,
    },
    contaDestino: {
        type: String,
        required: true,
    },
    nomeOrigem: {
        type: String,
        required: true,
    },
    nomeDestino: {
        type: String,
        required: true,
    },
    tipoDocumento: {
        type: String,
        required: true,
        default: " ",
    },
    cpFCnpj: {
        type: String,
        immutable: true,
    },
    valorBruto: {
        type: Number,
        required: true,
    },
    valorLiquido: {
        type: Number,
    },
    acrescimo: {
        type: Number,
        min: 0,
    },
    desconto: {
        type: Number,
        min: 0,
    },
    formadePagamento: {
        type: String,
        enum: [
            "Crédito",
            "Débito",
            "PIX",
            "Dinheiro",
            "Boleto",
            "Cheque",
            "Depósito",
            "",
        ],
    },
    datadeVencimento: {
        type: Date,
        default: Date.now,
        required: true,
    },
    datadePagamento: {
        type: Date,
        default: Date.now,
    },
    baixada: {
        type: Boolean,
    },
    descricao: {
        type: String,
        maxlength: 130,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    gastoFixo: {
        type: Boolean,
        default: false,
    },
});

const financialMovements = mongoose.model(
    "financialMovements",
    financialMovementsSchema
);
module.exports = financialMovements;
