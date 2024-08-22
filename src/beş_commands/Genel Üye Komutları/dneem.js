module.exports = {
    name: "leave",
    usage: ".leave [sunucuID]",
    category: "guard",
    aliases: ["sunucudan-ayrıl", "ayrıl"],
    execute: async (client, message, args, beş_embed) => {
        const guildId = args[0];

        if (!guildId) {
            return message.reply("Lütfen ayrılmak istediğiniz sunucunun ID'sini belirtin.");
        }

        const guild = client.guilds.cache.get(guildId);

        if (!guild) {
            return message.reply("Belirtilen sunucu bulunamadı veya bot bu sunucuda değil.");
        }

        try {
            await guild.leave();
            message.reply(`Sunucudan başarıyla ayrıldım: ${guild.name}`);
        } catch (error) {
            console.error(error);
            message.reply("Sunucudan ayrılırken bir hata oluştu.");
        }
    },
};

 