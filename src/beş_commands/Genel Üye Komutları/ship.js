const { MessageButton, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Events, ChannelType, StringSelectMenuBuilder } = require("discord.js");


const canvafy = require('canvafy');
const beş_config = require("../../../beş_config");
const client = global.client;

module.exports = {
    name: "shsjkwkwjeip", 
    usage: "ship [@User / ID / Random]",
    category: "genel",
    aliases: ["shiskwkps", "kakwkwjlp"],
    execute: async (client, message, args, beş_embed) => {
        if (!["ship", "bot", "commands", "command", "komut"].some(bes => message.channel.name.includes(bes))) return message.channel.send({ embeds: [beş_embed.setDescription(`> **Ship Komudunu Sadece Adında "ship","bot","commands","command","komut" İçeren Kanallarda Kullanabilirsin!**`)] }).sil(5);
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.random();
        if (!user) return message.channel.send({ embeds: [beş_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
     
       /* const ship = await new canvafy.Ship()
            //.setAvatars(message.author.displayAvatarURL({ dynamic: true, format: "png" }), user.user.displayAvatarURL({ dynamic: true, format: "png" }))
           .setAvatars(message.author.displayAvatarURL({ dynamic: true, extension: "png" }), user.user.displayAvatarURL({ dynamic: true, extension: "png" }))
        .setBackground("image", "https://media.discordapp.net/attachments/999732640817098823/1234994305677135882/bilinmeyen.jpeg?ex=6632c193&is=66317013&hm=99b4b4f56b3011c0b54cc6fe5c034b76d4354f4ac1c8e21ac940966e96ef5fd8&") // bannerURL() null dönebilir, bunu kontrol edin
            .setBorder("#000000")
            .setOverlayOpacity(0.5)
            .build();

        // Butonları oluştur
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("tanis")
                    .setLabel("Tanış!")
                    .setStyle(ButtonStyle.Success),
          

                new ButtonBuilder()
                    .setCustomId("sarki")
                    .setLabel("Sizin Şarkınız")
                    .setStyle(ButtonStyle.Primary),
          
            );
// Şarkıları tanımla
        const sarkilar = [
            'https://open.spotify.com/track/2SGltWNsdjCjyf6eh3iM0g?si=c49bb2c15ac343f5',
            'https://open.spotify.com/track/0ywlnV6QEZneCbbqLev6qL?si=a94d3ae7328b476c',
            'https://open.spotify.com/track/0JkZUrGmvzpX4yP8CoqItc?si=c5b35b77a6804b43',
           'https://open.spotify.com/track/2SGltWNsdjCjyf6eh3iM0g?si=c49bb2c15ac343f5',
      'https://open.spotify.com/track/0ywlnV6QEZneCbbqLev6qL?si=a94d3ae7328b476c',
      'https://open.spotify.com/track/0JkZUrGmvzpX4yP8CoqItc?si=c5b35b77a6804b43',
      'https://open.spotify.com/track/0yrqfgfaQs222WGcZMvIFA?si=3219a4f749884702',
      'https://open.spotify.com/track/2911GW6Gdfuc3CQ2HrLDn6?si=a590bce4552f40a0',
      'https://open.spotify.com/track/3ZGUpGjkL9D5wjMWd7wFB5?si=ed9b59544f6a4eab',
      'https://open.spotify.com/track/38j60DwttFNYk2GmCTIUod?si=2ab67840f1a84dd0',
      'https://open.spotify.com/track/6KmThLltgcLO058vNzxvMV?si=2a89388eeb42414c',
      'https://open.spotify.com/track/26EzdCBOvRJljcc2zYOEVP?si=e4c5cd109369406e',
      'https://open.spotify.com/track/7hrjh79DQVNwGTL3EgrBi4?si=c4e24bf978ea457c',
      'https://open.spotify.com/track/11AkXmBdjwu4upt22GjJrG?si=76fe1e69c3224af3',
      'https://open.spotify.com/track/6ZvKnJSendvbZGiVMmgIdp?si=c3fb586f7c0142b2',
      'https://open.spotify.com/track/0kjy0Qk3anB4t1dNIL7No3?si=8f9cea3da1e146e3',
      'https://open.spotify.com/track/3jDcUArWhSonfHpK3QXJug?si=2b4db33b15784b89',
      'https://open.spotify.com/track/4uoXb2toU8zWD27TpJS7Yk?si=1a6217915dd5422f',
      'https://open.spotify.com/track/4UohOvkgmCt3p0PYOPnHjN?si=8f0199b91b164724',
      'https://open.spotify.com/track/04RR90pc7GMGHfELXfuX2Z?si=56154d8544164a7b',
      'https://open.spotify.com/track/6CcJMwBtXByIz4zQLzFkKc?si=a76b6157d1c6480b',
      'https://open.spotify.com/track/1GvNBnLOlRKZYS93fdEN9h?si=9e3a97956b3d4046',
      'https://open.spotify.com/track/0wr0JTOlgZVYccny0GlL4T?si=432cd351bee74708',
      'https://open.spotify.com/track/3bKMzeLEDmPHzDMWplhdtP?si=4d28a63f8a3a4a67',
      'https://open.spotify.com/track/5SFBaOi2ELB2P5tFzmcD73?si=713b86f5e0d64a62',
      'https://open.spotify.com/track/2pPJA6IEl9iyXtVyrE06cT?si=05e234d20ad645b7',
      'https://open.spotify.com/track/6nhJ2KSi1rKGX75frHpkXK?si=7bd37d56f85f4148',
      'https://open.spotify.com/track/5XMAeSjjinBwKjdANxHbeZ?si=87ec32afe2994536',
      'https://open.spotify.com/track/0slHapEcgmGP0kwfqQLLmP?si=4bf5c78418ef4136',
  
          
   
        ];
// Rastgele bir şarkı seç
        const randomSarki = sarkilar[Math.floor(Math.random() * sarkilar.length)];

        // Resmi ekleyerek mesajı gönder
        message.reply({
            content: ` **     [ ${message.author.tag} • ${user.user.tag} ]**`,
            files: [{
                attachment: ship,
                name: `ship-${message.member.id}.png`
            }],
            components: [row] // components buraya, reply'in içine yerleştirilmeli
        }).then(msg => {
            // Butonları bekleyen bir filtre oluştur
            const filter = (interaction) => interaction.user.id === message.author.id;

            // Buton tıklamalarını dinle
            const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

            // Buton tıklamalarını işle
            collector.on('collect', async (interaction) => {
                if (interaction.customId === "tanis") {
                    // Kullanıcıya hedef üyeyi tanıtan bir mesaj gönder
                    interaction.reply({ content: `Hedef üye: ${user}`, ephemeral: true });
                } else if (interaction.customId === "sarki") {
                    // Rastgele şarkıyı gönder
                    interaction.reply({ content: `İşte sizin için bir şarkı: ${randomSarki}`, ephemeral: true });
                }
            });
        });*/
    }
};
