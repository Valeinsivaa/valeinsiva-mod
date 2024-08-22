const { PermissionFlagsBits, ActionRowBuilder, Events,StringSelectMenuBuilder, codeBlock } = require("discord.js");
const beş_config = require("../../../beş_config")
const client = global.client;
const canvafy = require('canvafy');
const db = client.db;
module.exports = {
    name: "yarsmskkddım",
    usage: "yardım",
    category:"sahip",
    aliases: ["helwkksksp", "hiwkw"],
    execute: async (client, message, args, beş_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(beş => message.member.roles.cache.get(beş)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        client.true(message)
        let menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setOptions([
            {value:`genelkomutlar`,description:`Genel Komutları Gösterir`,label:`Genel Komutlar`,emoji:`${("<:uye:1176216293624520725>") !== null ? ("<:uye:1176216293624520725>") : "⚕️"}`},
            {value:`statkomutlar`,description:`Stat Komutlarını Gösterir`,label:`Stat Komutları`,emoji:`${("<:istatistikler:1176216754037469195>") !== null ? ("<:istatistikler:1176216754037469195>") : "⚕️"}`},
           {value:`kayıtkomutlari`,description:`Kayıt Komutlarını Gösterir`,label:`Kayıt Komutları`,emoji:`${("<:kalem:1176218610251874404>") !== null ? ("<:kalem:1176218610251874404>") : "⚕️"}`},

              
              {value:`guardkomutlar`,description:`Guard Komutlarını Gösterir`,label:`Guard Komutları`,emoji:`${("<:guard2:1176217568005083206>") !== null ? ("<:guard2:1176217568005083206>") : "⚕️"}`},
{value:`modkomutlar` ,description:`Moderasyon Komutlarını Gösterir`,label:`Moderasyon Komutları`,emoji:`${("<:mavi_yetkili2:1176226005560590406>") !== null ? ("<:mavi_yetkili2:1176226005560590406>") : "⚕️"}`},
{value:`üstytkomutlar` ,description:`Üst Yetki Komutlarını Gösterir`,label:`Üst Yetki Komutları`,emoji:`${("<:mavi_developer:1176226510366060605>") !== null ? ("<:mavi_developer:1176226510366060605>") : "⚕️"}`},
{value:`shpkomutları`,description:`Sahip Komutlarını Gösterir`,label:`Sahip Komutları`,emoji:`${("<:mavi_tac:1176224800293797968>") !== null ? ("<:mavi_tac:1176224800293797968>") : "⚕️"}`},
              
              
   
  
            ])
            .setCustomId("yardım")
            .setPlaceholder(`❓ | ${client.commands.size} Adet Komut Bulunmakta!`)
            )
      message.channel.send({components:[menu]});
    }
}


client.on(Events.InteractionCreate,async(beş) => {
if(!beş.isStringSelectMenu())return;
let value = beş.values[0];
if(beş.customId == "yardım"){
switch (value) {
    case "genelkomutlar":
        let cmd = commandShow("genel");
        beş.reply({ephemeral:true,content:codeBlock("fix",`${cmd.map(bes => `${beş_config.prefix}${bes.usage}`).join("\n")}`)})
        break;
        case "kayıtkomutlari":
        let cmd2 = commandShow("k");
        beş.reply({ephemeral:true,content:codeBlock("fix",`${cmd2.map(bes => `${beş_config.prefix}${bes.usage}`).join("\n")}`)})
        break;
        case "modkomutlar":
        let cmd3 = commandShow("md");
        beş.reply({ephemeral:true,content:codeBlock("fix",`${cmd3.map(bes => `${beş_config.prefix}${bes.usage}`).join("\n")}`)})
        break;
        case "guardkomutlar":
        let cmd4 = commandShow("guard");
        beş.reply({ephemeral:true,content:codeBlock("fix",`${cmd4.map(bes => `${beş_config.prefix}${bes.usage}`).join("\n")}`)})
        break;
        case "shpkomutları":
        let cmd5 = commandShow("shp");
        beş.reply({ephemeral:true,content:codeBlock("fix",`${cmd5.map(bes => `${beş_config.prefix}${bes.usage}`).join("\n")}`)})
        break;
        case "üstytkomutlar":
        let cmd6 = commandShow("üstyt");
        beş.reply({ephemeral:true,content:codeBlock("fix",`${cmd6.map(bes => `${beş_config.prefix}${bes.usage}`).join("\n")}`)})
        break;
        case "statkomutlar":
        let cmd7 = commandShow("stat");
        beş.reply({ephemeral:true,content:codeBlock("fix",`${cmd7.map(bes => `${beş_config.prefix}${bes.usage}`).join("\n")}`)})
        break;

}
}
})


function commandShow(name){
let cmd = client.commands.filter(bes => bes.category && bes.category == name.toLowerCase())
return cmd ? cmd : null;
}