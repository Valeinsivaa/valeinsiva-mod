const { Schema, model } = require("mongoose");

const rollogSchema = new Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    logs: { type: [String], default: [] }, // logs bir dizi olarak tanımlandı
});

module.exports = model("rollogs", rollogSchema);
