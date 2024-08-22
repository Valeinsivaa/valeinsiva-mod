const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events } = require("discord.js");
const beş_config = require("../../../beş_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "sil",
    usage: "sil <0-100>",
    category:"md",
    aliases: ["delete", "kaldır", "temizle", "sils"],
    execute: async (client, message, args, beş_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(beş => message.member.roles.cache.get(beş)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`) ] }).sil(5);

        let buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("10")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("<a:emote_value:1198900092996943913>") !== null ? client.emoji("<a:emote_value:1198900092996943913>") : "<:copkutusu:1136722328546459660>"}`)
                    .setCustomId(`${message.author.id}_delete_10`),
                new ButtonBuilder()
                    .setLabel("25")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("<a:emote_value:1198900092996943913>") !== null ? client.emoji("<a:emote_value:1198900092996943913>") : "<:copkutusu:1136722328546459660>"}`)
                    .setCustomId(`${message.author.id}_delete_25`),
                new ButtonBuilder()
                    .setLabel("50")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("<a:emote_value:1198900092996943913>") !== null ? client.emoji("<a:emote_value:1198900092996943913>") : "<:copkutusu:1136722328546459660>"}`)
                    .setCustomId(`${message.author.id}_delete_50`),
                new ButtonBuilder()
                    .setLabel("100")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("<a:emote_value:1198900092996943913>") !== null ? client.emoji("<a:emote_value:1198900092996943913>") : "<:copkutusu:1136722328546459660>"}`)
                    .setCustomId(`${message.author.id}_delete_100`),
                new ButtonBuilder()
                    .setLabel("İptal")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("<a:emote_value:1198900092996943913>") !== null ? client.emoji("<a:emote_value:1198900092996943913>") : "<:emote_false:1198900098340487208>"}`)
                    .setCustomId(`${message.author.id}_delete_iptal`)
            )
        const roleColor = message.member.roles.highest.color;   
      if (!args[0]) return message.reply({ components: [buttons], embeds: [beş_embed.setDescription(`> **Silinecek Mesajın Adet Tipini Seçiniz!**`).setColor(roleColor).setThumbnail(message.guild.iconURL({ forceStatic: true, dynamic: true }))] })
        if ((args[0] && isNaN(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.reply({ embeds: [beş_embed.setDescription(`> **Eksik Komut Kullandınız!** *${beş_config.prefix}sil <0-100>*`)] }).sil(5);
        message.channel.bulkDelete(Number(args[0]))
        message.channel.send(`> **${args[0]}** *Adet Mesaj Silindi!*`).sil(10);

    }
}

client.on(Events.InteractionCreate, async (beş) => {
    if (!beş.isButton()) return;
    switch (beş.customId) {
        case `${beş.member.id}_delete_10`:
            beş.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            beş.message.delete();
            beş.channel.bulkDelete(10)
            break;
        case `${beş.member.id}_delete_25`:
            beş.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            beş.message.delete();
            beş.channel.bulkDelete(25)
            break;
        case `${beş.member.id}_delete_50`:
            beş.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            beş.message.delete();
            beş.channel.bulkDelete(50)
            break;
        case `${beş.member.id}_delete_100`:
            beş.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            beş.message.delete();
            beş.channel.bulkDelete(100)
            break;
        case `${beş.member.id}_delete_iptal`:
            beş.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            beş.message.delete();
            break;
    }
})