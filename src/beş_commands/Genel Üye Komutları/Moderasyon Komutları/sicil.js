const { PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const Ceza = require("../../beş_schemas/sicilSchema"); // MongoDB modelini içe aktarın
const client = global.client;

module.exports = {
    name: "sicil",
    usage: "sicil [@Beş / ID]",
    category: "moderasyon",
    aliases: ["geçmiş", "cezalar", "cezaları"],
    execute: async (client, message, args, beş_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let staffData = await client.db.get("five-ban-staff") || [];
        if (!staffData.length) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(beş => message.member.roles.cache.get(beş)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))
            return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        if (!member) return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir Kullanıcı Belirt!**`)] }).sil(5);

        // MongoDB'den cezaları çek
        let cezaRecords = await Ceza.find({ userId: member.id }).sort({ date: -1 }).exec();
        if (!cezaRecords.length) return message.reply({ embeds: [beş_embed.setDescription(`> **Kullanıcının Sicil Kaydı Bulunmamakta!**`)] }).sil(5);

        let names = cezaRecords.map(record => {
    const date = new Date(record.date);
    
    // Eğer date değeri geçerli bir tarih değilse default bir tarih atayın
    const timestamp = isNaN(date.getTime()) ? Date.now() : date.getTime();
    
    const formattedDate = `<t:${Math.floor(timestamp / 1000)}:F>`;
    const timeAgo = `<t:${Math.floor(timestamp / 1000)}:R>`;
    return `${record.reason}`;
});
        if (names.length <= 10) {
            message.reply({ embeds: [beş_embed.setTitle("Kullanıcının Sicil Verileri").setDescription(names.join("\n\n"))] });
        } else {
            let pages = 1;
            const beş_buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("beş_back")
                        .setLabel("⬅️")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("beş_exit")
                        .setLabel("🗑️")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId("beş_skip")
                        .setLabel("➡️")
                        .setStyle(ButtonStyle.Secondary)
                );
            let mesaj = await message.reply({
                components: [beş_buttons],
                embeds: [
                    beş_embed.setTitle("Kullanıcının Sicil Verileri").setDescription(names.slice(0, 10).join("\n\n")).setFooter({ text: `Sayfa #${pages}` })
                ]
            });

            const filter = i => i.user.id === message.member.id;
            const collector = mesaj.createMessageComponentCollector({ filter: filter, time: 120000 });
            collector.on("collect", async (beş) => {
                if (beş.customId === "beş_skip") {
                    if (names.slice(pages * 10, (pages + 1) * 10).length <= 0) return beş.reply({ ephemeral: true, content: `> **❌ Daha Fazla Veri Bulunmamakta!**` });
                    pages += 1;
                    let newData = names.slice((pages - 1) * 10, pages * 10).join("\n\n");
                    await beş.update({
                        components: [beş_buttons],
                        embeds: [
                            beş_embed.setTitle("Kullanıcının Sicil Verileri").setFooter({ text: `Sayfa #${pages}` }).setDescription(newData)
                        ]
                    });
                } else if (beş.customId === "beş_back") {
                    if (pages === 1) return beş.reply({ ephemeral: true, content: `> **❌ İlk Sayfadasın, Geriye Gidemezsin!**` });
                    pages -= 1;
                    let newData = names.slice((pages - 1) * 10, pages * 10).join("\n\n");
                    await beş.update({
                        components: [beş_buttons],
                        embeds: [
                            beş_embed.setTitle("Kullanıcının Sicil Verileri").setFooter({ text: `Sayfa #${pages}` }).setDescription(newData)
                        ]
                    });
                } else if (beş.customId === "beş_exit") {
                    beş.reply({ ephemeral: true, content: `> **🗑️ Panel Başarıyla Silindi!**` });
                    mesaj.delete().catch(() => { });
                    message.delete().catch(() => { });
                }
            });
        }
    }
};
