const mongoose = require("mongoose");

const patrimonioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: false,
    },
    valor: {
        type: Number,
        required: true,
    },
    numerodeSerie: {
        type: String,
        required: false,
    },
    numerodeEtiqueta: {
        type: Number,
        min: 0,
        max: 9999,
        required: true,
    },
    localizacao: {
        type: String,
        required: false, 
    },
    doacao: {
        type: Boolean,
        default: false,
    },
    datadeCadastro: {
        type: Date,
        default: Date.now,
    },
});

const patrimonio = mongoose.model(
    "patrimonio",
    patrimonioSchema
);
module.exports = patrimonio;
