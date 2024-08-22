const { PermissionFlagsBits } = require("discord.js");
const beş_config = require("../../../beş_config");
const client = global.client;
const db = client.db;

module.exports = {
    name: "uyarı-temizle",
    usage: "uyarı-temizle [@User]",
    category: "guard",
    aliases: ["wsil","wtemizle"],
    execute: async (client, message, args, beş_embed) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
let staffData = await db.get("five-ban-staff") || [];
        
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(beş => message.member.roles.cache.get(beş)) && 
            !message.member.permissions.has(PermissionFlagsBits.Administrator) && 
            !message.member.permissions.has(PermissionFlagsBits.BanMembers))
            return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        
        if (!member) return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if (member.id == message.author.id) return message.reply({ embeds: [beş_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)] }).sil(5);
        if (member.user.bot) return message.reply({ embeds: [beş_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)] }).sil(5);
        if (member.roles.highest.position > message.member.roles.highest.position) return message.reply({ embeds: [beş_embed.setDescription(`> **Kendinden Üst/Aynı Pozisyondaki Birine İşlem Uygulayamazsın!**`)] }).sil(5);
        //if (reason.length < 1) return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir Sebep Belirt!**`)] }).sil(5);
        if (!member.bannable) return message.reply({ embeds: [beş_embed.setDescription(`> **Belirtilen User'a İşlem Yapmaya Yetkim Yetmiyor!**`)] }).sil(5);

        // Uyarı rollerinin isimleri
        const uyarıRolleri = [
            "Uyarı 1",
            "Uyarı 2",
            "Uyarı 3"
        ];

        // Kullanıcının sahip olduğu uyarı rolleri
        const mevcutRoller = member.roles.cache.filter(role => uyarıRolleri.includes(role.name));

        if (mevcutRoller.size === 0)
            return message.reply({ embeds: [beş_embed.setDescription(`> **Belirtilen Kullanıcının Uyarısı Yok!**`)] });
client.false();
      try {
            // Rolleri temizleme
            await member.roles.remove(mevcutRoller.map(role => role.id));
            message.reply({ embeds: [beş_embed.setDescription(`> **Belirtilen Kullanıcının Uyarıları Temizlendi!**`)] });
        client.true();
        } catch (error) {
            console.error(error);
            message.reply({ embeds: [beş_embed.setDescription(`> **Rolleri Temizlerken Bir Hata Oluştu!**`)] }).sil(5);
        }
    }
};
