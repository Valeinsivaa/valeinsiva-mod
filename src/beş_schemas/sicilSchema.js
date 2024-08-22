const { Schema, model } = require("mongoose");

const cezaSchema = new Schema({
    guildId: String,
    userId: String,
    cezaId: Number,
    reason: String
});

module.exports = model("Ceza", cezaSchema);
