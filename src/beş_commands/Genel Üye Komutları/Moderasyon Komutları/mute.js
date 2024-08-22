const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const beş_config = require("../../../beş_config");
const client = global.client;
const ms = require("ms");
const db = client.db;

module.exports = {
    name: "cmute",
    usage: "cmute [@Beş / ID] <süre[10m]> <sebep>",
    category: "moderasyon",
    aliases: ["cmute", "mute", "chat-mute", "chatmute", "çet-mute", "sustur"],
    execute: async (client, message, args, beş_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let time = args[1];
        let reason = args.slice(2).join(' ');
        let cstaffData = await db.get("five-cmute-staff") || [];
        let vstaffData = await db.get("five-vmute-staff") || [];
        let muteRoles = await db.get("five-cmute-roles");
        let limitData = await db.get(`mutelimit-${message.author.id}`) || 0;
         let vmuteRoles = await db.get("five-vmute-roles");
        
      if (!cstaffData.length > 0 || !vstaffData.length > 0) {
            console.error("Chat Mute / Voice Mute Yetkilisi Ayarlı Değil!");
        }
        if (!muteRoles) {
            console.error("Chat Mute Rolleri Ayarlı Değil!");
            return client.false(message);
        }
      if (!vmuteRoles) {
            console.error("Voice Mute Rolleri Ayarlı Değil!");
            return client.false(message);
        }
        if (!cstaffData.some(beş => message.member.roles.cache.get(beş)) &&
            !vstaffData.some(beş => message.member.roles.cache.get(beş)) &&
            !message.member.permissions.has(PermissionFlagsBits.Administrator) &&
            !message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        }

        if (!member) return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        if (member.id == message.author.id) return message.reply({ embeds: [beş_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        if (member.user.bot) return message.reply({ embeds: [beş_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [beş_embed.setDescription(`> **Kendinden Üst/Aynı Pozisyondaki Birine İşlem Uygulayamazsın!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        if (limitData >= beş_config.limit.muteLimit) return message.reply({ embeds: [beş_embed.setDescription(`> **Mute Atma Limitin Dolmuş Durumda, Lütfen Sonra Tekrar Dene!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        if (!time || !["w", "d", "h", "m", "s"].some(bes => time.includes(bes))) return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir Süre Belirt!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        if (reason.length < 1) return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir Sebep Belirt!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        if (!member.manageable) return message.reply({ embeds: [beş_embed.setDescription(`> **Belirtilen User'a İşlem Yapmaya Yetkim Yetmiyor!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));

        let tip = time.replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta");

        const guildId = message.guild.id;  // Current guild ID
        let buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Chat Mute")
                    .setDisabled(cstaffData.some(beş => message.member.roles.cache.get(beş)) || message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.MuteMembers) ? member.roles.cache.has(muteRoles) ? true : false : true)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`1243608297379074055`)
                    .setCustomId("punish_cmute"),
                new ButtonBuilder()
                    .setLabel("Voice Mute")
                    .setDisabled(cstaffData.some(beş => message.member.roles.cache.get(beş)) || message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.MuteMembers) ? !member.voice.channel ? true : member.voice.serverMute ? true : false : true)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`1243607657445851166`)
                    .setCustomId("punish_vmute"),
                new ButtonBuilder()
                    .setLabel("İptal")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`1243569404021702708`)
                    .setCustomId("punish_iptal")
            );

        let mesaj = await message.reply({
            components: [buttons],
            embeds: [beş_embed.setDescription(`> **${client.emoji("emote_value", guildId) !== null ? client.emoji("emote_value", guildId) : "❓"} Aşağıdaki Butonlardan Bir İşlem Tipi Belirleyiniz!**`)]
        });

        const collector = mesaj.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000, max: 1 });

        collector.on('end', async (beş) => {
            if (beş.size == 0) mesaj.delete();
        });

        collector.on('collect', async (beş) => {
            if (!beş.isButton()) return;
            if (beş.customId == "punish_cmute") {
                member.roles.add(muteRoles);
                
              db.set(`cmuted-${member.id}`, (Date.now() + ms(time)));
                await client.ceza(member.id, message, "CMUTE", reason, Date.now(), tip);
                mesaj.delete();
                db.add(`mutelimit-${message.author.id}`, 1);
            } else if (beş.customId == "punish_vmute") {
                if (!member.voice.channel) return beş.reply({ content: `> **Kullanıcı Ses Kanalında Bulunmuyor!**`, ephemeral: true });
                member.roles.add(vmuteRoles);
                
              member.voice.setMute(true);
                db.set(`vmuted-${member.id}`, (Date.now() + ms(time)));
                await client.ceza(member.id, message, "VMUTE", reason, Date.now(), tip);
                mesaj.delete();
                db.add(`mutelimit-${message.author.id}`, 1);
            } else if (beş.customId == "punish_iptal") {
                beş.reply({ content: `> **${client.emoji("emote_true", guildId) !== null ? client.emoji("emote_true", guildId) : "✅"} İşlem Başarıyla İptal Edildi!**`, ephemeral: true });
                client.false(message);
                mesaj.delete();
            }
        });
    }
};
