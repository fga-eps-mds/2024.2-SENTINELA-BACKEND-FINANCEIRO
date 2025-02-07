const mongoose = require("mongoose");

const LocalizacaoSchema = new mongoose.Schema({
    localizacao: {
        type: String,
        required: false, 
    },
});

const Localizacao = mongoose.model(
    "Localizacao",
    LocalizacaoSchema
);
module.exports = Localizacao;
