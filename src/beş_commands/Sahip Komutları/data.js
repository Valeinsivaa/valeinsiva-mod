const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const beş_config = require("../../../beş_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "mdata",
    category: "shp",
    usage: "datasil",
    aliases: ["datadeskwkwlete", "wkwissil"],
    execute: async (client, message, args, beş_embed) => {
        const protectedDBs = [
            "five-register-staff","five-man-roles","five-woman-roles","five-unregister-roles","five-supheli-roles","five-family-roles","five-tags","five-channel-chat","five-channel-welcome","five-ban-staff","five-jail-staff","five-vmute-staff","five-cmute-staff","five-cmute-roles","five-ytalım-roles","five-firstyt-roles","five-jail-roles"
        ]; 
        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm_delete')
            .setLabel('Onayla')
            .setStyle(ButtonStyle.Danger);
        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel_delete')
            .setLabel('İptal')
            .setStyle(ButtonStyle.Secondary);
const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);
const sentMessage = await message.channel.send({ 
           embeds:[beş_embed.setDescription( `> 🗑️ **Local Veritabanı Silinecek! Onaylamak veya iptal etmek için butonlara basın.**\n > **⚠️ Bu işlem geri alınamaz!**`)], 
         components: [row] 
        });
const filter = i => i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'confirm_delete') {
 for (const data of await db.all()) {
                    if (!protectedDBs.includes(data.ID)) {
                        await db.delete(data.ID);
                    }
                }
                await interaction.update({ content: `> ✅ **Veritabanı başarıyla temizlendi.**`, embeds: [], components: [] });
                collector.stop();
            } else if (interaction.customId === 'cancel_delete') {
                await interaction.update({ content: `> ❌ **Veritabanı silme işlemi iptal edildi.**`, embeds: [], components: [] });
                collector.stop();
            }
        });
collector.on('end', (collected, reason) => {
 });}};

