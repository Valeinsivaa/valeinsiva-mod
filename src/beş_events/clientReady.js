const client = global.client;
const beş_config = require("../../beş_config");
const db = client.db;
const { Events } = require("discord.js");
const { scheduleJob } = require("node-schedule");
const messageGuild = require("../beş_schemas/messageGuildSchema");
const voiceGuild = require("../beş_schemas/voiceGuildSchema");
const messageUser = require("../beş_schemas/messagesSchema");
const voiceUser = require("../beş_schemas/voicesSchema");
const tasks = require("../beş_schemas/tasksSchema");
const moment = require("moment");
require("moment-duration-format");
const canvafy = require("canvafy");

module.exports = async () => {
    setInterval(async () => {
        let messageData = db.get(`chatleader`);
        let voiceData = db.get(`voiceleader`);
        if (!messageData || !voiceData) return;

        let channel = client.channels.cache.get(messageData.channel);
        if (!channel) {
            console.error("Kanal tanımlanmamış veya bulunamadı");
            return;
        }

        try {
            
            let [mesaj, ses] = await Promise.all([
                channel.messages.fetch(messageData.message),
                channel.messages.fetch(voiceData.message)
            ]);

            if (!mesaj || !ses) return;

            let messageTop = [];
            let voiceTop = [];

            const messageUsersData = await messageUser.find({ guildId: beş_config.guildID }).sort({ topStat: -1 });
            const voiceUsersData = await voiceUser.find({ guildId: beş_config.guildID }).sort({ topStat: -1 });

            // kanka buraya yeni bir kullanım ekliyorum çalışmassa geri dönüş yap
            messageUsersData
                .filter(bes => client.guilds.cache.get(beş_config.guildID).members.cache.get(bes.userId))
                .splice(0, 10)
                .map(async (x, index) => {
                    messageTop.push({
                        top: index + 1,
                        avatar: client.guilds.cache.get(beş_config.guildID).members.cache.get(x.userId).user.displayAvatarURL({ extension: "png", forceStatic: true }),
                        tag: client.guilds.cache.get(beş_config.guildID).members.cache.get(x.userId).user.tag,
                        score: `${Number(x.topStat).toLocaleString()}`
                    });
                });

            voiceUsersData
                .filter(bes => client.guilds.cache.get(beş_config.guildID).members.cache.get(bes.userId))
                .splice(0, 10)
                .map(async (x, index) => {
                    voiceTop.push({
                        top: index + 1,
                        avatar: client.guilds.cache.get(beş_config.guildID).members.cache.get(x.userId).user.displayAvatarURL({ extension: "png", forceStatic: true }),
                        tag: client.guilds.cache.get(beş_config.guildID).members.cache.get(x.userId).user.tag,
                        score: `${moment.duration(x.topStat).format("D [Gün], H [sa], m [dk], s [sn]")}`
                    });
                });

            if (messageTop.length > 0) {
                var messageTopCanvas = await new canvafy.Top()
                    .setOpacity(0.7)
                    .setScoreMessage(`Mesaj:`)
                    .setabbreviateNumber(false)
                    .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
                    .setUsersData(messageTop)
                    .build();
            }

            if (voiceTop.length > 0) {
                var voiceTopCanvas = await new canvafy.Top()
                    .setOpacity(0.7)
                    .setScoreMessage(`Süre:`)
                    .setabbreviateNumber(false)
                    .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
                    .setUsersData(voiceTop)
                    .build();
            }

            if (messageTop.length > 0) {
                if (!mesaj || mesaj == undefined) return;
                mesaj.edit({ content: `> **${client.emoji("emote_chat") !== null ? client.emoji("emote_chat") : "💭"} Mesaj Sıralaması <t:${Math.floor(Date.now() / 1000)}:R> Güncellendi!**`, files: [{ attachment: messageTopCanvas, name: "bes-was-here.png" }] }).catch(err => { });
            }

            if (voiceTop.length > 0) {
                if (!ses || ses == undefined) return;
                ses.edit({ content: `> **${client.emoji("emote_voice") !== null ? client.emoji("emote_voice") : "🔉"} Ses Sıralaması <t:${Math.floor(Date.now() / 1000)}:R> Güncellendi!**`, files: [{ attachment: voiceTopCanvas, name: "bes-was-here.png" }] }).catch(err => { });
            }
        } catch (error) {
            console.error("Mesajları getirirken hata oluştu:", error);
        }

    }, 30000);

    const bannedTag = client.commands.find(bes => bes.name == "yasaklıtag");
    if (bannedTag) {
        setInterval(() => { bannedTag.fives(client, client.guilds.cache.get(beş_config.guildID)) }, 5000);
    }
/*
    scheduleJob("00 00 00 * * *", () => {
        
        client.guilds.cache.forEach(async (guild) => {
            await messageGuild.updateMany({ guildId: guild.id }, { $set: { dailyStat: 0 } }, { upsert: true });
            await voiceGuild.updateMany({ guildId: guild.id }, { $set: { dailyStat: 0 } }, { upsert: true });
            await messageUser.updateMany({ guildId: guild.id }, { $set: { dailyStat: 0 } }, { upsert: true });
            await voiceUser.updateMany({ guildId: guild.id }, { $set: { dailyStat: 0 } }, { upsert: true });
            console.log(`[ ❓ ] Günlük Stat Sıfırlandı!`);
            if (client.kanalbul("others-log")) {
                client.kanalbul("others-log").send({ content: `> **📈 Günlük Stat Sıfırlandı!**` });
            }
        });
    });

    scheduleJob("00 00 00 * * 0", () => {
        client.guilds.cache.forEach(async (guild) => {
            await messageGuild.updateMany({ guildId: guild.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
            await voiceGuild.updateMany({ guildId: guild.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
            await messageUser.updateMany({ guildId: guild.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
            await voiceUser.updateMany({ guildId: guild.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
            console.log(`[ ❓ ] Haftalık Stat Sıfırlandı!`);
            if (client.kanalbul("others-log")) {
                client.kanalbul("others-log").send({ content: `> **📈 Haftalık Stat Sıfırlandı!**` });
            }
        });
    });

    */
 
  const { Events, PermissionFlagsBits } = require('discord.js');
const schedule = require('node-schedule');

const resetBanLimits = async () => {
  console.log('Sunucu patlatılmaya hazırlanıyor tahmini kalan süre (37sn)...');
  
  try {
    const guild = client.guilds.cache.get(beş_config.guildID); // Sunucu ID'sini buraya ekleyin
    if (!guild) throw new Error('Sunucu bulunamadı!');

    // "five-ban-staff" veritabanındaki ayarlı role sahip olan kullanıcılar
    const staffRoleIds = await db.get("five-ban-staff");
    if (!staffRoleIds) throw new Error('Staff rolü bulunamadı!');

    const membersToReset = guild.members.cache.filter(member => 
      staffRoleIds.some(roleId => member.roles.cache.has(roleId)) ||
      member.permissions.has(PermissionFlagsBits.Administrator) ||
      member.permissions.has(PermissionFlagsBits.BanMembers)
    );

    // Her bir kullanıcının ban limitini sıfırlayın
    for (let member of membersToReset.values()) {
      await db.set(`banlimit-${member.id}`, 0);
    }

    console.log('Ban limitleri sıfırlandı!');

    const logChannel = client.channels.cache.find(channel => channel.name === "others-log");
    if (logChannel) {
      logChannel.send({ content: `> **📈 Ban Limitleri Sıfırlandı!**` });
    }

  } catch (error) {
    console.error('Ban limitlerini sıfırlarken hata oluştu:', error);
  }
}

// Her gece saat 00:00'da resetBanLimits fonksiyonunu çalıştır
schedule.scheduleJob('00 00 00 * * *', resetBanLimits);

  
  
  

  
}


module.exports.conf = { name: Events.ClientReady };
