const mongoose = require("mongoose");

const patrimonioLocalizacaoSchema = new mongoose.Schema({
    numerodeEtiqueta: {
        type: Number,
        min: 0,
        max: 9999,
        required: true,
    },
    de: {
        type: String,
        required: false,
    },
    para: {
        type: String,
        required: false,
    },
    data: {
        type: Date,
        default: Date.now,
    },
});

const patrimonioLocalizacao = mongoose.model(
    "patrimonioLocalizacao",
    patrimonioLocalizacaoSchema
);
module.exports = patrimonioLocalizacao;
