
const { PermissionFlagsBits } = require("discord.js");
const beş_config = require("../../../beş_config")
const client = global.client;
const db = client.db;

module.exports = {
    name: "forceban",
    usage:"forceban [@User / ID] <sebep>",
    category:"guard",
    aliases: ["forcebans", "forceyasakla","forceyasaklama","kalkmazban","kalkmaz-ban","ultra-sitiridigiri"],
    execute: async (client, message, args, beş_embed) => {
        let member;

        // Kullanıcıyı Bulma
        try {
            member = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (error) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir Kullanıcı ID'si Belirtin!**`)] }).sil(5);
        }
        
        if (!member) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir Kullanıcı Belirt!**`)] }).sil(5);
        }
        
        let reason = args.slice(1).join(' ');
        let forcedata = await db.get(`forcebans`) || [];
        
        // Yetki Kontrolü
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Bu Komutu Kullanmak İçin Yeterli Yetkiye Sahip Değilsin!**`)] }).sil(5);
        }

        // Çeşitli Kontroller
        if (member.id == message.author.id) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)] }).sil(5);
        }
        
        if (member.bot) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)] }).sil(5);
        }
        
        if (reason.length < 1) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir Sebep Belirt!**`)] }).sil(5);
        }
        
        if (forcedata.includes(member.id)) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Belirtilen Üyenin Zaten Bir Kalıcı Yasaklaması Bulunmakta!**`)] }).sil(5);
        }

        // Kullanıcıyı Yasaklama
        try {
            await message.guild.members.ban(member.id, { reason: reason });
            await client.ceza(member.id, message, "FORCEBAN", reason, Date.now());
            message.reply({ embeds: [beş_embed.setDescription(`> **${member.tag} adlı kullanıcı başarıyla yasaklandı!**`)] }).sil(5);
        } catch (error) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Yasaklama işlemi sırasında bir hata oluştu!**`)] }).sil(5);
        }
    }
}
