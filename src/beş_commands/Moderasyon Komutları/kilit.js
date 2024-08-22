const {PermissionFlagsBits, PermissionsBitField, Events, EmbedBuilder,ActionRowBuilder,ButtonStyle,ButtonBuilder} = require("discord.js");
const beş_config = require("../../../beş_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "kilit",
    usage:"kilit <channel>",
    category:"md",
    aliases: ["kanal-kilit", "kanalkilit","kilitle","kilitaç","kilkapat"],
    execute: async (client, message, args, beş_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if(!staffData.length > 0)console.error("Ban Yetkilisi Ayarlı Değil!");
        if(!staffData.some(beş => message.member.roles.cache.get(beş)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);

        let button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId(`lockackapa-${message.member.id}`)
        .setStyle(!message.channel.permissionsFor(message.guild.roles.cache.find(bes => bes.name == "@everyone")).has(PermissionFlagsBits.SendMessages) ? ButtonStyle.Danger : ButtonStyle.Success)
        .setEmoji(!message.channel.permissionsFor(message.guild.roles.cache.find(bes => bes.name == "@everyone")).has(PermissionFlagsBits.SendMessages) ? "🔒" : "🔓")    
        .setLabel(!message.channel.permissionsFor(message.guild.roles.cache.find(bes => bes.name == "@everyone")).has(PermissionFlagsBits.SendMessages) ? "Kilitle" : "Kilit Aç")
        )

        client.true(message)
        if (message.channel.permissionsFor(message.guild.roles.cache.find(bes => bes.name == "@everyone")).has(PermissionFlagsBits.SendMessages)) {
            await message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(bes => bes.name == "@everyone").id, { SendMessages: false });
            return message.reply({components:[button], embeds: [new EmbedBuilder().setDescription(`> **\`🔒\` Kanal ${message.author} Tarafından Kilitlendi!**`).setColor("#ff0000")] });
          } else {
            await message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(bes => bes.name == "@everyone").id, { SendMessages: true });
            return message.reply({components:[button], embeds: [new EmbedBuilder().setDescription(`> **\`🔓\` Kanalın Kilidi ${message.author} Tarafından Açıldı!**`).setColor("#00ff00")] });
          };
    }
}

client.on(Events.InteractionCreate,async(beş) => {
 if(!beş.isButton())return;
 if(beş.customId == `lockackapa-${beş.member.id}`){
    beş.message.delete().catch(err => { });
    if (beş.channel.permissionsFor(beş.guild.roles.cache.find(bes => bes.name == "@everyone")).has(PermissionFlagsBits.SendMessages)) {
        await beş.channel.permissionOverwrites.edit(beş.guild.roles.cache.find(bes => bes.name == "@everyone").id, { SendMessages: false });
        return beş.channel.send({ embeds: [new EmbedBuilder().setDescription(`> **\`🔒\` Kanal ${beş.member} Tarafından Kilitlendi!**`).setColor("#ff0000")] });
      } else {
        await beş.channel.permissionOverwrites.edit(beş.guild.roles.cache.find(bes => bes.name == "@everyone").id, { SendMessages: true });
        return beş.channel.send({ embeds: [new EmbedBuilder().setDescription(`> **\`🔓\` Kanalın Kilidi ${beş.member} Tarafından Açıldı!**`).setColor("#00ff00")] });
      };
 }  
})