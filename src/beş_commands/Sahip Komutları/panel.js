const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Events, ChannelType, StringSelectMenuBuilder } = require("discord.js");
const ms = require("ms");
const db = client.db;
const beş_config = require("../../../beş_config")
const children = require("child_process");
const { codeBlock } = require("@discordjs/formatters");
const canvafy = require("canvafy");
module.exports = {
    name: "msetup",
    category:"shp",
    usage:"setup",
    aliases: ["msetup","mpanel"],
    execute: async (client, message, args, beş_embed) => {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        let secim = args[0];
        message.react(client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅")
        let mesajx;
        if(!secim) mesajx = await message.reply({ content: `> **Lütfen Bekleyiniz..**` })
        let registerEmbed = new EmbedBuilder(); let moderationEmbed = new EmbedBuilder();


        const secimButtons1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("regsetup")
                    .setLabel(`Kayıt`)
                    .setEmoji("📝")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("modsetup")
                    .setLabel(`Moderasyon`)
                    .setEmoji("🛠️")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("logkur")
                    .setLabel(`Logları Kur`)
                    .setEmoji("📃")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("emojikur")
                    .setLabel(`Emojileri Kur`)
                    .setEmoji("😂")
                    .setStyle(ButtonStyle.Primary),
            );

        const secimButtons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("restart")
                    .setLabel(`Tüm Botları Yeniden Başlat`)
                    .setEmoji("🔃")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("datareset")
                    .setLabel(`Local Database'i Sıfırla`)
                    .setEmoji("🗑️")
                    .setStyle(ButtonStyle.Danger),
            );

        const secimMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setPlaceholder("✨ Diğer İşlemler")
                    .setCustomId("select_menu")
                    .addOptions([
                        { label: "Stat Leaderboard Kur", value: "statboard", emoji: "📈", description: "Mesajda Güncellenen İstatistik Verileri!" },
                        { label: "Tüm Yasaklamaları Kaldır", value: "yasakkaldır", emoji: "🛠️", description: "Sunucudaki Tüm Yasaklamaları Kaldırır!" },
                        { label: "Menüler & Rollerin Paneli", value: "menurolekur", emoji: "🪄", description: "Menulerin Ve Rol Kurma Paneli!" },
                    ])
            )

        const canvasPanel = await new canvafy.Rank()
            .setAvatar(`${message.guild.iconURL({ forceStatic: true, extension: "png" }) !== null ? message.guild.iconURL({ forceStatic: true, extension: "png" }) : beş_config.shipArkaplan}`)
            .setBackground("image", `${message.guild.bannerURL({extension:"png",size:2048}) !== null ? message.guild.bannerURL({extension:"png",size:2048}) : beş_config.shipArkaplan}`)
            .setUsername(message.guild.name)
            .setCustomStatus("#f0f0f0")
            .setLevel(message.guild.memberCount,"Üye Sayısı;")
            .setRank(message.guild.premiumSubscriptionCount,"Boost Adeti")
            .setCurrentXp(message.guild.premiumSubscriptionCount >= 14 ? 14 : message.guild.premiumSubscriptionCount)
            .setBarColor("#00ff00")
            //.setForegroundColor("#000000")
            //.setForegroundOpacity(0.8)
            .setRequiredXp(14)
            .build();

        const beş_buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("welcome_image")
                    .setLabel(`Resimli Welcome`)
                    .setEmoji(`${db.has("five-welcome-image") ? "<:five_true:882380542513913886>" : "<:five_false:882380473551192096>"}`)
                    .setStyle(db.has("five-welcome-image") ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("tag_mode")
                    .setLabel(`Taglı Alım`)
                    .setEmoji(`${db.has("five-welcome-tagmode") ? "<:five_true:882380542513913886>" : "<:five_false:882380473551192096>"}`)
                    .setStyle(db.has("five-welcome-tagmode") ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("welcome_mentions")
                    .setLabel(`Rol Etiket`)
                    .setEmoji(`${db.has("five-welcome-mentions") ? "<:five_true:882380542513913886>" : "<:five_false:882380473551192096>"}`)
                    .setStyle(db.has("five-welcome-mentions") ? ButtonStyle.Success : ButtonStyle.Danger),
                 );

        let staffData = await db.get("five-register-staff") || [];
        let banstaffData = await db.get("five-ban-staff") || [];
        let jailstaffData = await db.get("five-jail-staff") || [];
        let vmutestaffData = await db.get("five-vmute-staff") || [];
        let cmutestaffData = await db.get("five-cmute-staff") || [];
        let cmuteRoles = await db.get("five-cmute-roles");
       let vmuteRoles = await db.get("five-vmute-roles");
       
      let ytalımRoles = await db.get("five-ytalım-roles");
        let firstytRoles = await db.get("five-firstyt-roles") || [];

        let manRoles = await db.get("five-man-roles") || [];
        let womanRoles = await db.get("five-woman-roles") || [];
        let unregisterRoles = await db.get("five-unregister-roles") || [];
        let jailRoles = await db.get("five-jail-roles") || [];
        let supheliRoles = await db.get("five-supheli-roles") || [];
        let familyRoles = await db.get("five-family-roles") || [];
        let tagData = await db.get("five-tags") || [];
        let chatChannel = await db.get("five-channel-chat");
        let welcomeChannel = await db.get("five-channel-welcome");

        registerEmbed.setTitle("Kayıt Sistemi").setURL(message.url).setDescription(`
**Kayıt Yetkilileri \`ID: 1\`**
${staffData.length > 0 ? staffData.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Erkek Rolleri \`ID: 2\`**
${manRoles.length > 0 ? manRoles.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Kadın Rolleri \`ID: 3\`**
${womanRoles.length > 0 ? womanRoles.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Kayıtsız Rolleri \`ID: 4\`**
${unregisterRoles.length > 0 ? unregisterRoles.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Şüpheli Rolleri \`ID: 5\`**
${supheliRoles.length > 0 ? supheliRoles.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Family/Taglı Rolleri \`ID: 6\`**
${familyRoles.length > 0 ? familyRoles.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Taglar \`ID: 7\`**
${tagData.length > 0 ? tagData.map((bes) => `${bes}`).join(",") : "Bulunmamakta"}
**Genel Chat Kanalı \`ID: 8\`**
${chatChannel ? `<#${chatChannel}>` : "Bulunmamakta"}
**Hoşgeldin Kanalı \`ID: 9\`**
${welcomeChannel ? `<#${welcomeChannel}>` : "Bulunmamakta"}

${codeBlock("diff", `
${db.has("five-welcome-image") ? "+" : "-"} Canvaslı / Resimli Hoşgeldin; ${db.has("five-welcome-image") ? "✅ " : "❌ "}
${db.has("five-welcome-tagmode") ? "+" : "-"} Taglı Alım; ${db.has("five-welcome-tagmode") ? "✅ " : "❌ "}
${db.has("five-welcome-mentions") ? "+" : "-"} Welcome Rol Etiket; ${db.has("five-welcome-mentions") ? "✅ " : "❌ "}
--- Bot Ping; ${Math.round(client.ws.ping)} MS | Mesaj Ping; ${(Date.now() - message.createdAt)} MS
`)}
`).setThumbnail(message.guild.iconURL({ forceStatic: true }))

moderationEmbed.setTitle("Moderasyon Sistemi").setURL(message.url).setDescription(`
**Ban Yetkilileri \`ID: 10\`**
${banstaffData.length > 0 ? banstaffData.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Jail Yetkilileri \`ID: 11\`**
${jailstaffData.length > 0 ? jailstaffData.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Voice Mute Yetkilileri \`ID: 12\`**
${vmutestaffData.length > 0 ? vmutestaffData.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Chat Mute Yetkilileri \`ID: 13\`**
${cmutestaffData.length > 0 ? cmutestaffData.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Chat Mute Rolü \`ID: 14\`**
${cmuteRoles ? `<@&${cmuteRoles}>` : "Bulunmamakta"}
**Voice Mute Rolü \`ID: 15\`**
${vmuteRoles ? `<@&${vmuteRoles}>` : "Bulunmamakta"}
**Yetkili Alım Rolü \`ID: 16\`**
${ytalımRoles ? `<@&${ytalımRoles}>` : "Bulunmamakta"}
**İlk Yetki Rolleri \`ID: 17\`**
${firstytRoles.length > 0 ? firstytRoles.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}
**Cezalı / Jailed Rolleri \`ID: 18\`**
${jailRoles.length > 0 ? jailRoles.map((bes) => `<@&${bes}>`).join(",") : "Bulunmamakta"}

${codeBlock("diff", `
${db.has("five-welcome-image") ? "+" : "-"} Canvaslı / Resimli Hoşgeldin; ${db.has("five-welcome-image") ? "✅ " : "❌ "}
${db.has("five-welcome-tagmode") ? "+" : "-"} Taglı Alım; ${db.has("five-welcome-tagmode") ? "✅ " : "❌ "}
${db.has("five-welcome-mentions") ? "+" : "-"} Welcome Rol Etiket; ${db.has("five-welcome-mentions") ? "✅ " : "❌ "}
--- Bot Ping; ${Math.round(client.ws.ping)} MS | Mesaj Ping; ${(Date.now() - message.createdAt)} MS
`)}
`).setThumbnail(message.guild.iconURL({ forceStatic: true }))


        if (!secim) {
            let mesaj = await mesajx.edit({ content:``,components: [secimButtons1, secimButtons2, secimMenu], embeds: [new EmbedBuilder().setImage("attachment://bes-server-setup.png").setColor("Random").setDescription(`> **Bir İşlem Seçiniz!**`)], files: [{ attachment: canvasPanel, name: "bes-server-setup.png" }]})
            const collector = mesaj.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000 });
            collector.on('end',async(beş) =>{
            if(beş.size == 0) mesaj.delete();
            })
            collector.on('collect', async (beş) => {
                if (!beş.isButton()) return;
                if (beş.customId == "regsetup") {
                    beş.update({ content: ``, embeds: [registerEmbed], components: [beş_buttons],files:[] })
                    collector.stop();
                } else if (beş.customId == "modsetup") {
                    beş.update({ content: ``, embeds: [moderationEmbed], components: [beş_buttons],files:[] })
                    collector.stop();
                } else if (beş.customId == "logkur") {
                    beş.update({ content: `> **📝 Loglar Kuruluyor..**`,embeds:[],files:[], components: [] })
                    const parent = await beş.guild.channels.create({ name: '</Loglar>', type: ChannelType.GuildCategory });
                    const loglar = beş_config.logs;
                    for (let index = 0; index < loglar.length; index++) {
                        let element = loglar[index];
                        await beş.guild.channels.create({
                            name: element.name,
                            type: ChannelType.GuildText,
                            parent: parent.id, permissionOverwrites: [
                                { id: beş.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                            ]
                        })
                    }
                    beş.channel.send({ content: `> **✅ Logların Kurulumu Tamamlandı!**` })
                    collector.stop();
                } else if (beş.customId == "emojikur") {
                    beş.update({ content: `> **📝 Emojiler Kuruluyor..**`, embeds:[],files:[],components: [] })
                    const emojiler = beş_config.emojis;
                    for (let index = 0; index < emojiler.length; index++) {
                        let element = emojiler[index];
                        await beş.guild.emojis.create({
                            name: element.name,
                            attachment: element.url
                        })
                    }
                    beş.channel.send({ content: `> **✅ Emojilerin Kurulumu Tamamlandı!**` })
                    collector.stop();
                } else if (beş.customId == "restart") {
                    const five = children.exec(`pm2 restart all`);
                    five.stdout.on('data', async (datas) => {
                        beş.update({ content: `> 🔃 **Botlar Yeniden Başlatılıyor..**`, components: [],embeds:[],files:[] })
                        collector.stop();
                    });
                } else if (beş.customId == "datareset") {
                    db.all().forEach(async (data) => {
                        db.delete(data.ID)
                    })
                    beş.update({ content: `> 🗑️ **Local Veritabanı Siliniyor..**`, components: [] ,embeds:[],files:[]})
                    collector.stop();
                }
            })
            return;
        }

        if (secim == "1") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-register-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 1 @rol**` })
            if (staffData.some(bes => bes.includes(roles.id))) {
                db.pull("five-register-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-register-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "2") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-man-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 1 @rol**` })
            if (manRoles.some(bes => bes.includes(roles.id))) {
                db.pull("five-man-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-man-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "3") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-woman-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 3 @rol**` })
            if (womanRoles.some(bes => bes.includes(roles.id))) {
                db.pull("five-woman-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-woman-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "4") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-unregister-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 4 @rol**` })
            if (unregisterRoles.some(bes => bes.includes(roles.id))) {
                db.pull("five-unregister-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-unregister-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "5") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-supheli-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 5 @rol**` })
            if (supheliRoles.some(bes => bes.includes(roles.id))) {
                db.pull("five-supheli-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-supheli-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "6") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-family-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 6 @rol**` })
            if (familyRoles.some(bes => bes.includes(roles.id))) {
                db.pull("five-family-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-family-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "7") {
            let tag = args[1];
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-tags")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!tag) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 7 <tag>**` })
            if (tagData.some(bes => bes.includes(tag))) {
                db.pull("five-tags", (eleman, sıra, array) => eleman == tag, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${tag} Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-tags", tag)
                message.reply({ content: `> **✅ Başarılı!**\n> **${tag} Başarıyla Eklendi!**` })
            }

        } else if (secim == "8") {
            let channel = message.mentions.channels.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-channel-chat")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!channel) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 8 #chat-kanal**` })
            db.set("five-channel-chat", channel.id)
            message.reply({ content: `> **✅ Başarılı!**\n> **${channel} (\`${channel.name}\`) Başarıyla Eklendi!**` })

        } else if (secim == "9") {
            let channel = message.mentions.channels.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-channel-welcome")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!channel) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 9 #chat-kanal**` })
            db.set("five-channel-welcome", channel.id)
            message.reply({ content: `> **✅ Başarılı!**\n> **${channel} (\`${channel.name}\`) Başarıyla Eklendi!**` })

        }else if (secim == "10") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-ban-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 10 @rol**` })
            if (banstaffData.some(bes => bes.includes(roles.id))) {
                db.pull("five-ban-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-ban-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }
        }else if (secim == "11") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-jail-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 11 @rol**` })
            if (jailstaffData.some(bes => bes.includes(roles.id))) {
                db.pull("five-jail-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-jail-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            } 
        }else if (secim == "12") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-vmute-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 12 @rol**` })
            if (vmutestaffData.some(bes => bes.includes(roles.id))) {
                db.pull("five-vmute-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-vmute-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            } 
        }else if (secim == "13") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-cmute-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 13 @rol**` })
            if (cmutestaffData.some(bes => bes.includes(roles.id))) {
                db.pull("five-cmute-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-cmute-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            } 
        }else if (secim == "14") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-cmute-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 14 @rol**` })
                db.set("five-cmute-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` }) 
        }else if (secim == "15") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-vmute-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 14 @rol**` })
                db.set("five-vmute-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` }) 
        }else if (secim == "16") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-ytalım-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 15 @rol**` })
                db.set("five-ytalım-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` }) 
        }else if (secim == "17") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-firstyt-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 16 @rol**` })
            if (cmutestaffData.some(bes => bes.includes(roles.id))) {
                db.pull("five-firstyt-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("five-firstyt-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            } 
            }else if (secim == "18") {
                let roles = message.mentions.roles.first();
                if (isNaN(args[1]) && args[1] == "sıfırla") {
                    db.delete("five-jail-roles")
                    return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
                }
                if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup 17 @rol**` })
                if (jailRoles.some(bes => bes.includes(roles.id))) {
                    db.pull("five-jail-roles", (eleman, sıra, array) => eleman == roles.id, true)
                    message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
                } else {
                    db.push("five-jail-roles", roles.id)
                    message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
                } 
            
    }else { return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${beş_config.prefix}setup <ID> @rol/#kanal/tag**` }) }

    }
}

client.on(Events.InteractionCreate,async(beş) => {
 if(!beş.isStringSelectMenu())return;
 let value = beş.values[0];
 if(value == "statboard"){
beş.message.delete();
let chat = await beş.channel.send({content:`*Veriler Çekiliyor Lütfen Bekleyiniz, Ve Bu Mesajı Silmeyiniz!*`})
let voice = await beş.channel.send({content:`*Veriler Çekiliyor Lütfen Bekleyiniz, Ve Bu Mesajı Silmeyiniz!*`})
db.set(`chatleader`,{message:chat.id,channel:beş.channel.id})
db.set(`voiceleader`,{message:voice.id,channel:beş.channel.id})
beş.reply({content:`> **✅ Kurulum Başarılı!** *Leaderboard'un Gözükmesi İçin Biraz Bekleyiniz!*`,ephemeral:true})
 }else if(value == "yasakkaldır"){
    if (!beş.member.permissions.has(PermissionFlagsBits.Administrator)) return beş.reply({ content: noPermMessage, ephemeral: true })
    beş.message.delete();
    const fetchBans = await beş.guild.bans.fetch()
        fetchBans.forEach(async (bans) => {
        beş.guild.members.unban(bans.user.id).catch(err => { });
 })
 beş.channel.send({content:`> **Sunucuda Yasaklı Listesinde Olan Kullanıcıların Banları Açılıyor!**`});
}else if(value == "menurolekur"){
    const rolmenukur1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("burcrolkur")
                    .setLabel(client.rolinc("akrep") ? "[KURULU]" : "Rol Kur")
                    .setEmoji("♋")
                    .setDisabled(client.rolinc("akrep") ? true : false)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("sevrolkur")
                    .setLabel(client.rolinc("sevgilim var") ? "[KURULU]" : "Rol Kur")
                    .setDisabled(client.rolinc("sevgilim var") ? true : false)
                    .setEmoji("💝")
                    .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                    .setCustomId("etkinlikrolkur")
                    .setDisabled(client.rolinc("çekiliş") ? true : false)
                    .setLabel(client.rolinc("çekiliş") ? "[KURULU]" : "Rol Kur")
                    .setEmoji("🎉")
                    .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                    .setCustomId("renkrolkur")
                    .setDisabled(client.rolinc("🍓") ? true : false)
                    .setLabel(client.rolinc("🍓") ? "[KURULU]" : "Rol Kur")
                    .setEmoji("🔴")
                    .setStyle(ButtonStyle.Success),
            );
            const rolmenukur2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("burcpanelkur")
                    .setLabel(`Panel Kur`)
                    .setEmoji("♋")
                    .setDisabled(client.rolinc("akrep") ? false : true)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("sevpanelkur")
                    .setLabel(`Panel Kur`)
                    .setEmoji("💝")
                    .setDisabled(client.rolinc("sevgilim var") ? false : true)
                    .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                    .setCustomId("etkinlikpanelkur")
                    .setLabel(`Panel Kur`)
                    .setEmoji("🎉")
                    .setDisabled(client.rolinc("çekiliş") ? false : true)
                    .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                    .setCustomId("renkpanelkur")
                    .setDisabled(client.rolinc("🍓") ? false : true)
                    .setLabel("Panel Kur")
                    .setEmoji("🔴")
                    .setStyle(ButtonStyle.Success),
            );


            const menus = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setPlaceholder("Diğer Paneller İçin Tıklayın!")
                .setCustomId("othersmenu")
                .setOptions([
                {label:`Kısayol & Menu Panel`,value:`buttonpanel`,emoji:`🟥`,description:`Kısayol & Bilgilendirme Paneli`},
                {label:`YT Alım & İstek & Öneri Panel`,value:`ytistekoneripanel`,emoji:`🟩`,description:`Yetkili Alım & İstek & Öneri Bilgilendirme Paneli`},
                {label:`Yardım & Komutlar Panel`,value:`yardımpanel`,emoji:`🟦`,description:`Komut Kullanım Menusu.`},
                ])
            )



if (!beş.member.permissions.has(PermissionFlagsBits.Administrator)) return beş.reply({ content: noPermMessage, ephemeral: true })
beş.message.delete();
beş.channel.send({components:[rolmenukur1,rolmenukur2,menus],embeds:[new EmbedBuilder().setColor("Random").setFooter({iconURL:"https://cdn.discordapp.com/emojis/1103844452218458212.gif?size=128&quality=lossless",text:`⬆️ = Rol | ⬇️ = Panel`}).setDescription(`> **Merhaba, Hangi Paneli Veya Rolü Kurmak İstiyorsun?**\n\n> **♋ > \`Burç\`**\n> **💝 > \`İlişki\`**\n> **🎉 > \`Etkinlik\`**\n> **🔴 > \`Renk\`**`)]})
}
})

client.on(Events.InteractionCreate,async(beş) => {
    if(!beş.isStringSelectMenu())return;
     let value = beş.values[0];
     if(value == "buttonpanel"){
        beş.message.delete();
        beş.channel.send({"content": `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🔹"} Aşağıdaki Menü Üzerinden Sunucu Hakkında\n> Veya Hesabınızla İlgili Bazı Bilgilere Ulaşabilirsiniz.`,
        "components": [{
            "type": 1, "components": [{
                "type": 3, "custom_id": "btnpanel", "options": [
                    { "label": "Sunucuya Giriş Tarihiniz.","description":"ㅤ" ,"value": "btn1", "emoji": { "id": "1103844498670354522" }, },
                    { "label": "Üzerinizde Bulunan Roller.", "description":"ㅤ" ,"value": "btn2", "emoji": { "id": "1103844441598464040" }, },
                    { "label": "Hesap Açılış Tarihiniz.", "description":"ㅤ" ,"value": "btn3", "emoji": { "id": "1103844446468063282" }, },
                    { "label": "Sunucudaki Son 10 İsim Geçmişiniz.", "description":"ㅤ" ,"value": "btn4", "emoji": { "id": "1103844448787505232" }, },
                    { "label": "Sunucunun Anlık Aktiflik Listesi.", "description":"ㅤ" ,"value": "btn5", "emoji": { "id": "1103844452218458212" }, },
                    { "label": "Sunucudaki Son 10 Ceza Geçmişiniz.", "description":"ㅤ" ,"value": "btn6", "emoji": { "id": "1103844319644885082" }, },
                    { "label": "Kullanıcı Avatarınız.", "description":"ㅤ" ,"value": "btn7", "emoji": { "id": "1103844321591038104" }, },
                    { "label": "Kullanıcı Bannerınız.", "description":"ㅤ" ,"value": "btn8", "emoji": { "id": "1103844324346699796" }, },
                ], "placeholder": "Kısayol Menu", "min_values": 1, "max_values": 1
            }],
        }
        ]})
     }else if(value == "ytistekoneripanel"){
        beş.message.delete();

/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////

// bıtonlar buradan başlıyor

        let buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("istekoneri")
            .setLabel("İstek & Öneri")
            .setEmoji("<:kalpzarf:1169248837580365937>")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("sikayet")
            .setLabel("Şikayet")
            .setEmoji("<:uyari:1169246954014900266>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("ytbasvur")
            .setLabel("Yetkili Başvuru")
            .setEmoji("<:ytbasvuru:1169246551256866847>")
            .setStyle(ButtonStyle.Primary)
        
        )
    // bıtonlar buradan bitiyor/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
        //////////////////////////////////
/////////////////

        
        beş.channel.send({content: `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🔹"} Aşağıdaki Menü Üzerinden **İstek Öneri**,**Şikayet** Veya **Yetkili Başvurusu** Yapabilirsiniz.`,components:[buttons]})
     }else if(value == "yardımpanel"){
       let cmd = client.commands.find(bes => bes.name == "yardım")
      if(cmd){cmd.execute(client,beş.message,null,null)}
      beş.message.delete();
     }
})
client.on(Events.InteractionCreate,async(beş) => {
 if(!beş.isButton())return;
  let value = beş.customId;
  if(value == "burcrolkur"){
    beş.reply({ content: `> **📝 Burç Rolleri Kuruluyor..**${beş.guild.premiumTier >= 2 ? "" : ` *Sunucu Seviyesi 2'den Yüksek Olmadığı İçin Rolleri Iconsuz Kuruyorum!*`}`})
    const burc = beş_config.burcRoles;
    for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        if(beş.guild.premiumTier >= 2){
        await beş.guild.roles.create({
            icon: element.icon,
            name: element.name,
            color: "#CC8899",
          })
        }else{
            await beş.guild.roles.create({
                name: element.name,
                color: "#CC8899",
              })
        }
        }
        beş.channel.send({ content: `> **✅ Burç Rollerinin Kurulumu Tamamlandı!**` })
  }else if(value == "sevrolkur"){
    beş.reply({ content: `> **📝 İlişki Rolleri Kuruluyor..**${beş.guild.premiumTier >= 2 ? "" : ` *Sunucu Seviyesi 2'den Yüksek Olmadığı İçin Rolleri Iconsuz Kuruyorum!*`}`})
    const burc = beş_config.iliskiRoles;
    for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        if(beş.guild.premiumTier >= 2){
        await beş.guild.roles.create({
            icon: element.icon,
            name: element.name,
            color: element.color
          })
        }else{
            await beş.guild.roles.create({
                name: element.name,
                color: element.color
              })
        }
        }
        beş.channel.send({ content: `> **✅ İlişki Rollerinin Kurulumu Tamamlandı!**` })
  }  else if(value == "renkrolkur"){
    beş.reply({ content: `> **📝 Renk Rolleri Kuruluyor..**`})
    const burc = beş_config.renkRoles;
    for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        await beş.guild.roles.create({
            name: element.name,
            color: element.color
          })
        }
        beş.channel.send({ content: `> **✅ Renk Rollerinin Kurulumu Tamamlandı!**` })
  } else if(value == "etkinlikrolkur"){
    beş.reply({ content: `> **📝 Etkinlik Rolleri Kuruluyor..**${beş.guild.premiumTier >= 2 ? "" : ` *Sunucu Seviyesi 2'den Yüksek Olmadığı İçin Rolleri Iconsuz Kuruyorum!*`}`})
    const burc = beş_config.etkinlikRoles;
    for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        if(beş.guild.premiumTier >= 2){
        await beş.guild.roles.create({
            icon: element.icon,
            name: element.name,
            color: element.color
          })
        }else{
            await beş.guild.roles.create({
                name: element.name,
                color: element.color
              })
        }
        }
        
    beş.channel.send({ content: `> **✅ Etkinlik Rollerinin Kurulumu Tamamlandı!**` })
  }  else if(value == "burcpanelkur"){
        beş.message.delete();
        beş.channel.send({"content": ``,
        "components": [{
            "type": 1, "components": [{
                "type": 3, "custom_id": "burclar", "options": [
                    { "label": "Koç", "value": "koç", "emoji": { "id": "1054803690848006164" }, },
                    { "label": "Boğa", "value": "boğa", "emoji": { "id": "1054803741250957324" }, },
                    { "label": "İkizler", "value": "ikizler", "emoji": { "id": "1054803754232324107" }, },
                    { "label": "Yengeç", "value": "yengeç", "emoji": { "id": "1054788879422599209" }, },
                    { "label": "Aslan", "value": "aslan", "emoji": { "id": "1054803703808397413" }, },
                    { "label": "Başak", "value": "başak", "emoji": { "id": "1054803729901166622" }, },
                    { "label": "Terazi", "value": "terazi", "emoji": { "id": "1099539509596663819" }, },
                    { "label": "Akrep", "value": "akrep", "emoji": { "id": "1054803768031588403" }, },
                    { "label": "Yay", "value": "yay", "emoji": { "id": "1054788894262038548" }, },
                    { "label": "Oğlak", "value": "oğlak", "emoji": { "id": "1054803665367617586" }, },
                    { "label": "Kova", "value": "kova", "emoji": { "id": "1054803678168629398" }, },
                    { "label": "Balık", "value": "balık", "emoji": { "id": "1054803716689113108" }, },
                    { "label": "Rol İstemiyorum", "value": "roldelete", "emoji": { "name": "🗑️" }, }
                ], "placeholder": "Burç Rolleri Menusu!", "min_values": 1, "max_values": 1
            }],
        }
        ] })
}else if(value == "sevpanelkur"){
    beş.message.delete();
    beş.channel.send({"content": `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"💖"} Menü Üzerinden **İlişki** Rolünüzü Alabilirsiniz.`,
    "components": [{
        "type": 1, "components": [{
            "type": 3, "custom_id": "iliskiler", "options": [
                { "label": "Sevgilim Var", "value": "sevvar", "emoji": { "name":"💖" }, },
                { "label": "Sevgilim Yok", "value": "sevyok", "emoji": { "name":"🙄" }, },
                { "label": "Sevgili Yapmiyorum", "value": "sevyapmiyorum", "emoji": { "name":"🥱" }, },
                { "label": "Rol İstemiyorum", "value": "roldelete", "emoji": { "name": "🗑️" }, }
            ], "placeholder": "İlişki Rolleri Menusu!", "min_values": 1, "max_values": 1
        }],
    }
    ] })
}else if(value == "etkinlikpanelkur"){
    beş.message.delete();
    beş.channel.send({"content": `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🎉"} Menü Üzerinden **Etkinlik** Rolünüzü Alabilirsiniz.`,
    "components": [{
        "type": 1, "components": [{
            "type": 3, "custom_id": "etkinlikler", "options": [
                { "label": "Etkinlik Katılımcısı", "value": "etkinlikrol", "emoji": { "name":"🎉" }, },
                { "label": "Çekiliş Katılımcısı", "value": "çekilişrol", "emoji": { "name":"📣" }, },
                { "label": "Rol İstemiyorum", "value": "roldelete", "emoji": { "name": "🗑️" }, }
            ], "placeholder": "Etkinlik Rolleri Menusu!", "min_values": 1, "max_values": 2
        }],
    }
    ]})
}else if(value == "renkpanelkur"){
    beş.message.delete();
    beş.channel.send({"content": `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🔹"} Menü Üzerinden **Renk** Rolünüzü Alabilirsiniz.`,
    "components": [{
        "type": 1, "components": [{
            "type": 3, "custom_id": "renkler", "options": [
                { "label": "Kırmızı", "value": "kırmızı", "emoji": { "name": "🍓" }, },
                { "label": "Yeşil", "value": "yeşil", "emoji": { "name": "🍏" }, },
                { "label": "Sarı", "value": "sarı", "emoji": { "name": "🍌" }, },
                { "label": "Mor", "value": "mor", "emoji": { "name": "🍇" }, },
                { "label": "Beyaz", "value": "beyaz", "emoji": { "name": "🌼" }, },
                { "label": "Turuncu", "value": "turuncu", "emoji": { "name": "🥕" }, },
                { "label": "Rol İstemiyorum", "value": "roldelete", "emoji": { "name": "🗑️" }, }
            ], "placeholder": "Renk Rolleri Menusu!", "min_values": 1, "max_values": 1
        }],
    }
    ]})
}
})






client.on(Events.InteractionCreate, async (beş) => {
    if (!beş.isButton()) return;
    let fiveValue = beş.customId;
    let noPermMessage = `> **❌ Bu İşlem İçin \` Yönetici \` Yetkisine Sahip Olmalısın!**`;

    if (fiveValue == "welcome_image") {
        if (!beş.member.permissions.has(PermissionFlagsBits.Administrator)) return beş.reply({ content: noPermMessage, ephemeral: true })
        if (!db.has("five-welcome-image")) {
            db.set("five-welcome-image", true);
            beş.reply({ content: `> **✅ Canvaslı / Resimli Hoşgeldin Başarıyla Açıldı!**`, ephemeral: true })
        } else {
            db.delete("five-welcome-image");
            beş.reply({ content: `> **✅ Canvaslı / Resimli Hoşgeldin Başarıyla Kapatıldı!**`, ephemeral: true })
        }
    } else if (fiveValue == "welcome_mentions") {
        if (!beş.member.permissions.has(PermissionFlagsBits.Administrator)) return beş.reply({ content: noPermMessage, ephemeral: true })
        if (!db.has("five-welcome-mentions")) {
            db.set("five-welcome-mentions", true);
            beş.reply({ content: `> **✅ Hoşgeldin Rol Etiketi Başarıyla Açıldı!**`, ephemeral: true })
        } else {
            db.delete("five-welcome-mentions");
            beş.reply({ content: `> **✅ Hoşgeldin Rol Etiketi Başarıyla Kapatıldı!**`, ephemeral: true })
        }
    } else if (fiveValue == "tag_mode") {
        if (!beş.member.permissions.has(PermissionFlagsBits.Administrator)) return beş.reply({ content: noPermMessage, ephemeral: true })
        if (!db.has("five-welcome-tagmode")) {
            db.set("five-welcome-tagmode", true);
            beş.reply({ content: `> **✅ Taglı Alım Başarıyla Açıldı!**`, ephemeral: true })
        } else {
            db.delete("five-welcome-tagmode");
            beş.reply({ content: `> **✅ Taglı Alım Başarıyla Kapatıldı!**`, ephemeral: true })
        }
    }
})
