const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "sunucular",
    usage: ".sunucular",
    category: "guard",
    aliases: ["servers"],
    execute: async (client, message, args, beş_embed) => {
        // Sunucu bilgilerini toplama
        const guilds = client.guilds.cache.map(guild => ({
            name: guild.name,
            id: guild.id
        }));

        // Eğer bot hiçbir sunucuda bulunmuyorsa
        if (guilds.length === 0) {
            return message.reply("Bot hiçbir sunucuda bulunmuyor.");
        }

        // Sunucu bilgilerinin oluşturulması
        const embed = new EmbedBuilder()
            .setTitle("Botun Bulunduğu Sunucular")
            //.setColor("Blue")
            .setTimestamp();

        guilds.forEach(guild => {
            embed.addFields({ name: guild.name, value: `ID: ${guild.id}`, inline: true });
        });

        // Sunucu bilgilerini mesaj olarak gönderme
        message.reply({ embeds: [embed] });
    },
};
