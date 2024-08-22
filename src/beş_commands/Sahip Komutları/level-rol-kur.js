const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const beş_config = require("../../../beş_config")
const client = global.client;
const canvafy = require('canvafy');
const db = client.db;
module.exports = {
    name: "level-ksksksrol-kur",
    usage: "level-rol-kur",
    category:"shp",
    aliases: ["lvlroskklkur", "lvlrksksol"],
    execute: async (client, message, args, beş_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(beş => message.member.roles.cache.get(beş)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        client.true(message)
        message.reply({ content: `> **📝 Level Rolleri Kuruluyor..**`})
        const burc = beş_config.levelRoles;
        for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        await message.guild.roles.create({name: element.name,color: element.color,})
        }
     message.reply({ content: `> **✅ Level Rollerinin Kurulumu Tamamlandı!**` })
75
    }
}
