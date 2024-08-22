      const { PermissionFlagsBits, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const beş_config = require("../../../beş_config");
const client = global.client;
const ms = require("ms");
const db = client.db;

module.exports = {
    name: "menu",
    usage: "cmute [@User / ID]",
    category: "moderasyon",
    aliases: ["menü"],
    execute: async (client, message, args, beş_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let cstaffData = await db.get("five-cmute-staff") || [];
        let vstaffData = await db.get("five-vmute-staff") || [];
        let muteRoles = await db.get("five-cmute-roles");
        let limitData = await db.get(`mutelimit-${message.author.id}`) || 0;

        if (!cstaffData.length > 0 || !vstaffData.length > 0) console.error("Chat Mute / Voice Mute Yetkilisi Ayarlı Değil!");
        if (!muteRoles) {
            console.error("Chat Mute Rolleri Ayarlı Değil!");
            return client.false(message);
        }
        if (!cstaffData.some(beş => message.member.roles.cache.get(beş)) &&
            !vstaffData.some(beş => message.member.roles.cache.get(beş)) &&
            !message.member.permissions.has(PermissionFlagsBits.Administrator) &&
            !message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        }

        if (!member) return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if (member.id == message.author.id) return message.reply({ embeds: [beş_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)] }).sil(5);
        if (member.user.bot) return message.reply({ embeds: [beş_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)] }).sil(5);
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [beş_embed.setDescription(`> **Kendinden Üst/Aynı Pozisyondaki Birine İşlem Uygulayamazsın!**`)] }).sil(5);
        if (limitData >= beş_config.limit.muteLimit) return message.reply({ embeds: [beş_embed.setDescription(`> **Mute Atma Limitin Dolmuş Durumda, Lütfen Sonra Tekrar Dene!**`)] }).sil(5);
        if (!member.manageable) return message.reply({ embeds: [beş_embed.setDescription(`> **Belirtilen User'a İşlem Yapmaya Yetkim Yetmiyor!**`)] }).sil(5);

        let menu = new SelectMenuBuilder()
            .setCustomId('select_mute_reason')
            .setPlaceholder('Bir işlem tipi seçin')
            .addOptions([
                {
                    label: 'Küfür - 5 Dakika',
                    value: 'küfür_10m',
                },
                {
                    label: 'Rahatsızlık Verme - 5 Dakika',
                    value: 'rahatsızlık_10m',
                },
              {
                    label: 'Kadın Üyelere Sarkma - 25 Dakika',
                    value: 'rahatsızlık_25m',
                },
                {
                    label: 'Flood, Spam, Caps - 5 Dakika',
                    value: 'flood_10m',
                },
                {
                    label: 'Ailevi Değerlere Küfür - 25 Dakika',
                    value: 'aile_30m',
                },
                {
                    label: 'Sunucuyu Kötüleme - 30 Dakika',
                    value: 'sunucu_60m',
                }
            ]);

        let actionRow = new ActionRowBuilder().addComponents(menu);

        let mesaj = await message.reply({ components: [actionRow], embeds: [beş_embed.setDescription(`> **Aşağıdaki menüden bir işlem tipi belirleyiniz!**`)] });
        const collector = mesaj.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000, max: 1 });
        
        collector.on('end', async (collected) => {
            if (collected.size == 0) mesaj.delete();
        });

        collector.on('collect', async (interaction) => {
            if (!interaction.isSelectMenu()) return;

            let time;
            let reason;

            switch (interaction.values[0]) {
                case 'küfür_10m':
                    time = '5m';
                    reason = 'Küfür';
                    break;
                case 'rahatsızlık_10m':
                    time = '5m';
                    reason = 'Rahatsızlık Verme';
                    break;
                case 'rahatsızlık_25m':
                    time = '25m';
                    reason = 'Kadın Üyelere Rahatsızlık Verme';
                    break;
                case 'flood_10m':
                    time = '5m';
                    reason = 'Flood, Spam, Caps';
                    break;
                case 'aile_30m':
                    time = '25m';
                    reason = 'Ailevi Değerlere Küfür';
                    break;
                case 'sunucu_60m':
                    time = '30m';
                    reason = 'Sunucuyu Kötüleme';
                    break;
            }

            let tip = time.replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta");
            member.roles.add(muteRoles);
            db.set(`cmuted-${member.id}`, (Date.now() + ms(time)));
            await client.ceza(member.id, message, "CMUTE", reason, Date.now(), tip);
            mesaj.delete();
            db.add(`mutelimit-${message.author.id}`, 1);

            setTimeout(async () => {
                member.roles.remove(muteRoles);
                db.delete(`cmuted-${member.id}`);
                message.channel.send({ embeds: [beş_embed.setDescription(`> **${member} Kullanıcısının Mute Süresi Doldu ve Mute Kaldırıldı.**`)] }).sil(5);
            }, ms(time));
        });
    }
}
         
 
 