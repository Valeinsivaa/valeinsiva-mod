const { PermissionFlagsBits, EmbedBuilder, codeBlock, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const Rollog = require('../../beş_schemas/rolSchema'); // Rollog modelini içe aktarın

const beş_config = require("../../../beş_config");
const client = global.client;
const db = client.db;

module.exports = {
    name: "rol",
    usage: "rol ver / al [@User / ID]",
    category: "rol",
    aliases: ["rol-işlem", "r"],
    execute: async (client, message, args, beş_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(beş => message.member.roles.cache.get(beş)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers) && !message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        }
       if (args.length < 2) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Eksik Argüman Girildi!**\n> \`${beş_config.prefix}rol ver / al @User\``)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        }

        let action = args[0];
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
        if (!user) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir Kullanıcı Belirt!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        }
        if (user.user.bot) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        }
      if(user.id == message.author.id) return message.reply({ embeds: [beş_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)]}).sil(5);
      if(user.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [beş_embed.setDescription(`> **Kendinden Üst/Aynı Pozisyondaki Birine İşlem Uygulayamazsın!**`)]}).sil(5);
      if(!user.manageable)return message.reply({ embeds: [beş_embed.setDescription(`> **Belirtilen Kullanıcıya İşlem Yapmaya Yetkim Yetmiyor!**`)]}).sil(5);
const timestamp = Math.floor(Date.now() / 1000);

      //const verr = `\`[+]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${timestamp}> (<t:${timestamp}:R>)**\n*Rol;* ${role} (\`${role.id}\`)`;
     
      //const all = `\`[-]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${timestamp}> (<t:${timestamp}:R>)**\n*Rol;* ${role} (\`${role.id}\`)`;
const guildId = message.guild.id;
      async function add() {
    await Rollog.findOneAndUpdate(
        { guildId: guildId, userId: user.id },
        { $push: { logs: `\`[+]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${timestamp}> (<t:${timestamp}:R>)**\n*Rol;* ${role} `} },
        { upsert: true, new: true } // Kayıt yoksa oluştur, varsa güncelle
    );
}
      async function take() {
    await Rollog.findOneAndUpdate(
        { guildId: guildId, userId: user.id },
        { $push: { logs: `\`[-]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${timestamp}> (<t:${timestamp}:R>)**\n*Rol;* ${role}`} },
        { upsert: true, new: true } // Kayıt yoksa oluştur, varsa güncelle
    );
}
         
        if (role) {
            if (action === 'ver') {
                if (!user.roles.cache.has(role.id)) {
                    await user.roles.add(role.id);
                    client.true(message);
                      add()
                  if (client.kanalbul("rol-log")) {
                        client.kanalbul("rol-log").send({
                            embeds: [beş_embed.setDescription(`> **${user} Kullanıcısına <@&${role.id}> Rolü Verildi!**`).addFields(
                                { name: `Veren Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                { name: `Verilen Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                { name: `Verilen Rol`, value: `<@&${role.id}>`, inline: false }
                            ).setColor("#00ff00")]
                        });
                    }
                } else {
                    client.false(message);
                    return message.reply({ content: `> **${user} Kullanıcısında Belirttiğiniz Rol Zaten Mevcut!**`, ephemeral: true });}
        } else if (action === 'al') {
                if (user.roles.cache.has(role.id)) {
                    await user.roles.remove(role.id);
                    client.true(message);
                    take()
                  if (client.kanalbul("rol-log")) {
                        client.kanalbul("rol-log").send({
                            embeds: [beş_embed.setDescription(`> **${user} Kullanıcısından <@&${role.id}> Rolü Alındı!**`).addFields(
                                { name: `Alan Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                { name: `Alınan Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                { name: `Alınan Rol`, value: `<@&${role.id}>`, inline: false }
                            ).setColor("#ff0000")]
                        });
                    }
                } else {
                    client.false(message);
                    return message.reply({ content: `> **${user} Kullanıcısında Belirttiğiniz Rol Mevcut Değil!**`, ephemeral: true });
                }
            }
        } else {
        
        
    

        let minRoleId = beş_config.minRoleId;
        let maxRoleId = beş_config.maxRoleId;
        let minUyeRole = beş_config.minUyeRole;
        let maxUyeRole = beş_config.maxUyeRole;
        let adminRoleId1 = beş_config.altYt; // Alt yönetici rol ID
        let adminRoleId2 = beş_config.ustYt; // Üst yönetici rol ID

        let minRole = message.guild.roles.cache.get(minRoleId);
        let maxRole = message.guild.roles.cache.get(maxRoleId);
        let minUye = message.guild.roles.cache.get(minUyeRole);
        let maxUye = message.guild.roles.cache.get(maxUyeRole);
        let adminRole1 = message.guild.roles.cache.get(adminRoleId1);
        let adminRole2 = message.guild.roles.cache.get(adminRoleId2);

        if (!minRole || !maxRole || !minUye || !maxUye || !adminRole1 || !adminRole2) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Rol ID'leri Belirt!**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));
        }

        let adminRoles = message.guild.roles.cache.filter(role => role.position >= Math.min(adminRole1.position, adminRole2.position) && role.position <= Math.max(adminRole1.position, adminRole2.position) && role.editable && role.position < message.member.roles.highest.position).sort((a, b) => a.position - b.position).array();
        let roles = message.guild.roles.cache.filter(role => role.position <= maxRole.position && role.position >= minRole.position && role.editable && role.position < message.member.roles.highest.position).sort((a, b) => a.position - b.position).array();
        let uyeRoles = message.guild.roles.cache.filter(role => role.position <= maxUye.position && role.position >= minUye.position && role.editable && role.position < message.member.roles.highest.position).sort((a, b) => a.position - b.position).array();

        let adminRoleChunks = [];
        let roleChunks = [];
        let uyeRoleChunks = [];
        let chunkSize = 25;

        for (let i = 0; i < adminRoles.length; i += chunkSize) {
            adminRoleChunks.push(adminRoles.slice(i, i + chunkSize));
        }
        
        for (let i = 0; i < roles.length; i += chunkSize) {
            roleChunks.push(roles.slice(i, i + chunkSize));
        }

        for (let i = 0; i < uyeRoles.length; i += chunkSize) {
            uyeRoleChunks.push(uyeRoles.slice(i, i + chunkSize));
        }

        let adminRows = adminRoleChunks.map((chunk, index) => {
            let selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`select-admin-roles-${index}`)
                .setPlaceholder('Yönetici Rolleri Seçin')
                .setMinValues(1)
                .setMaxValues(chunk.length)
                .addOptions(chunk.map(role => ({
                    label: role.name,
                    value: role.id
                })));
            return new ActionRowBuilder().addComponents(selectMenu);
        });

        let roleRows = roleChunks.map((chunk, index) => {
            let selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`select-roles-${index}`)
                .setPlaceholder('Rolleri Seçin')
                .setMinValues(1)
                .setMaxValues(chunk.length)
                .addOptions(chunk.map(role => ({
                    label: role.name,
                    value: role.id
                })));
            return new ActionRowBuilder().addComponents(selectMenu);
        });

        let uyeRoleRows = uyeRoleChunks.map((chunk, index) => {
            let selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`select-uye-roles-${index}`)
                .setPlaceholder('Üye Rolleri Seçin')
                .setMinValues(1)
                .setMaxValues(chunk.length)
                .addOptions(chunk.map(role => ({
                    label: role.name,
                    value: role.id
                })));
            return new ActionRowBuilder().addComponents(selectMenu);
        });

        let embed = new EmbedBuilder()
            .setDescription('Rolleri seçin ve işlem yapın.')
            .setColor('#00ff00');

        
      let msg = await message.reply({ embeds: [beş_embed.setDescription('**Aşağıdaki menüden işleminizi seçin.**')], components:[...adminRows, ...roleRows, ...uyeRoleRows] });

      
      
      const filter = i => i.user.id === message.author.id && (i.customId.startsWith('select-roles-') || i.customId.startsWith('select-admin-roles-') || i.customId.startsWith('select-uye-roles-'));
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async interaction => {
            let roleIds = interaction.values;

            if (interaction.customId.startsWith('select-admin-roles-')) {
                if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.reply({ content: `> **Bu menüyü kullanma yetkiniz yok!**`, ephemeral: true });
                }
                if (action === 'al') {
                    let removedRoles = [];
                    for (let roleId of roleIds) {
                        if (user.roles.cache.has(roleId)) {
                            await user.roles.remove(roleId);
                            removedRoles.push(roleId);
                        }
                    }
                    if (removedRoles.length > 0) {
                        client.true(message);
                        take()
                      if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısından ${removedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Alındı!**`).addFields(
                                    { name: `Alan Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Alınan Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Alınan Roller`, value: `${removedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#ff0000")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Mevcut Değil!**`, ephemeral: true });
                    }
                } else if (action === 'ver') {
                    let addedRoles = [];
                    for (let roleId of roleIds) {
                        if (!user.roles.cache.has(roleId)) {
                            await user.roles.add(roleId);
                            addedRoles.push(roleId);
                        }
                    }if (addedRoles.length > 0) {
                        client.true(message);
                        add()
                      if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısına ${addedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Verildi!**`).addFields(
                                    { name: `Veren Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Verilen Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Verilen Roller`, value: `${addedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#00ff00")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Zaten Mevcut!**`, ephemeral: true });
                    }
                }
            } else if (interaction.customId.startsWith('select-roles-')) {
                if (action === 'al') {
                    let removedRoles = [];
                    for (let roleId of roleIds) {
                        if (user.roles.cache.has(roleId)) {
                            await user.roles.remove(roleId);
                            removedRoles.push(roleId);
                        }
                    }
                    if (removedRoles.length > 0) {
                        client.true(message);
                        take()
                      if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısından ${removedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Alındı!**`).addFields(
                                    { name: `Alan Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Alınan Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Alınan Roller`, value: `${removedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#ff0000")]
                            });
                        }
                    } else {client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Mevcut Değil!**`, ephemeral: true });
                    }
                } else if (action === 'ver') {
                    let addedRoles = [];
                    for (let roleId of roleIds) {
                        if (!user.roles.cache.has(roleId)) {
                            await user.roles.add(roleId);
                            addedRoles.push(roleId);
                        }
                    }////////////
                    if (addedRoles.length > 0) {
                        client.true(message);
                        add()
                      if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısına ${addedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Verildi!**`).addFields(
                                    { name: `Veren Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Verilen Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Verilen Roller`, value: `${addedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#00ff00")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Zaten Mevcut!**`, ephemeral: true });
                    }
                }
            } else if (interaction.customId.startsWith('select-uye-roles-')) {
                if (action === 'al') {
                    let removedRoles = [];
                    for (let roleId of roleIds) {
                        if (user.roles.cache.has(roleId)) {
                            await user.roles.remove(roleId);
                            removedRoles.push(roleId);
                        }
                    }
                    if (removedRoles.length > 0) {
                        client.true(message);
                        take()
                      if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısından ${removedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Alındı!**`).addFields(
                                    { name: `Alan Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Alınan Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Alınan Roller`, value: `${removedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#ff0000")]
                            });
                        }
                    } else {client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Mevcut Değil!**`, ephemeral: true });
                    }
                } else if (action === 'ver') {
                    let addedRoles = [];
                    for (let roleId of roleIds) {
                        if (!user.roles.cache.has(roleId)) {
                            await user.roles.add(roleId);
                            addedRoles.push(roleId);
                        }
                    } if (addedRoles.length > 0) {
                        client.true(message);
                     add()
                      if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısına ${addedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Verildi!**`).addFields(
                                    { name: `Veren Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Verilen Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Verilen Roller`, value: `${addedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#00ff00")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Zaten Mevcut!**`, ephemeral: true });
                    }
                }
            }

            await interaction.update({ embeds: [beş_embed.setDescription('İşlem tamamlandı.')], components: [] });
        });

        collector.on('end', collected => {
            if (!collected.size) {
                msg.edit({ embeds: [beş_embed.setDescription("Zaman aşımına uğradı.")], components: [] });
            }
        });
    }
    }
};

      
      
      
      
      
      
      /*

        const filter = interaction => interaction.user.id === message.author.id && interaction.isSelectMenu();
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            let roleIds = interaction.values;

            if (interaction.customId.startsWith('select-admin-roles-')) {
                if (action === 'al') {
                    let removedRoles = [];
                    for (let roleId of roleIds) {
                        if (user.roles.cache.has(roleId)) {
                            await user.roles.remove(roleId);
                            removedRoles.push(roleId);
                        }
                    }
                    if (removedRoles.length > 0) {
                        client.true(message);
                        db.push(`rollog-${user.id}`, `\`[-]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Roller;* ${removedRoles.map(id => `<@&${id}>`).join(', ')}`);
                        if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısından ${removedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Alındı!**`).addFields(
                                    { name: `Alan Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Alınan Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Alınan Roller`, value: `${removedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#ff0000")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Mevcut Değil!**`, ephemeral: true });
                    }
                } else if (action === 'ver') {
                    let addedRoles = [];
                    for (let roleId of roleIds) {
                        if (!user.roles.cache.has(roleId)) {
                            await user.roles.add(roleId);
                            addedRoles.push(roleId);
                        }
                    }
                    if (addedRoles.length > 0) {
                        client.true(message);
                        db.push(`rollog-${user.id}`, `\`[+]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Roller;* ${addedRoles.map(id => `<@&${id}>`).join(', ')}`);
                        if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısına ${addedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Verildi!**`).addFields(
                                    { name: `Veren Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Verilen Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Verilen Roller`, value: `${addedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#00ff00")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Zaten Mevcut!**`, ephemeral: true });
                    }
                }
            } else if (interaction.customId.startsWith('select-roles-')) {
                if (action === 'al') {
                    let removedRoles = [];
                    for (let roleId of roleIds) {
                        if (user.roles.cache.has(roleId)) {
                            await user.roles.remove(roleId);
                            removedRoles.push(roleId);
                        }
                    }
                    if (removedRoles.length > 0) {
                        client.true(message);
                        db.push(`rollog-${user.id}`, `\`[-]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Roller;* ${removedRoles.map(id => `<@&${id}>`).join(', ')}`);
                        if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısından ${removedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Alındı!**`).addFields(
                                    { name: `Alan Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Alınan Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Alınan Roller`, value: `${removedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#ff0000")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Mevcut Değil!**`, ephemeral: true });
                    }
                } else if (action === 'ver') {
                    let addedRoles = [];
                    for (let roleId of roleIds) {
                        if (!user.roles.cache.has(roleId)) {
                            await user.roles.add(roleId);
                            addedRoles.push(roleId);
                        }
                    }
                    if (addedRoles.length > 0) {
                        client.true(message);
                        db.push(`rollog-${user.id}`, `\`[+]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Roller;* ${addedRoles.map(id => `<@&${id}>`).join(', ')}`);
                        if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısına ${addedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Verildi!**`).addFields(
                                    { name: `Veren Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Verilen Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Verilen Roller`, value: `${addedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#00ff00")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Zaten Mevcut!**`, ephemeral: true });
                    }
                }
            } else if (interaction.customId.startsWith('select-uye-roles-')) {
                if (action === 'al') {
                    let removedRoles = [];
                    for (let roleId of roleIds) {
                        if (user.roles.cache.has(roleId)) {
                            await user.roles.remove(roleId);
                            removedRoles.push(roleId);
                        }
                    }
                    if (removedRoles.length > 0) {
                        client.true(message);
                        db.push(`rollog-${user.id}`, `\`[-]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Roller;* ${removedRoles.map(id => `<@&${id}>`).join(', ')}`);
                        if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısından ${removedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Alındı!**`).addFields(
                                    { name: `Alan Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Alınan Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Alınan Roller`, value: `${removedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#ff0000")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Mevcut Değil!**`, ephemeral: true });
                    }
                } else if (action === 'ver') {
                    let addedRoles = [];
                    for (let roleId of roleIds) {
                        if (!user.roles.cache.has(roleId)) {
                            await user.roles.add(roleId);
                            addedRoles.push(roleId);
                        }
                    }
                    if (addedRoles.length > 0) {
                        client.true(message);
                        db.push(`rollog-${user.id}`, `\`[+]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Roller;* ${addedRoles.map(id => `<@&${id}>`).join(', ')}`);
                        if (client.kanalbul("rol-log")) {
                            client.kanalbul("rol-log").send({
                                embeds: [beş_embed.setDescription(`> **${user} Kullanıcısına ${addedRoles.map(id => `<@&${id}>`).join(', ')} Rolleri Verildi!**`).addFields(
                                    { name: `Veren Kişi`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                                    { name: `Verilen Kişi`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                                    { name: `Verilen Roller`, value: `${addedRoles.map(id => `<@&${id}>`).join(', ')}`, inline: false }
                                ).setColor("#00ff00")]
                            });
                        }
                    } else {
                        client.false(message);
                        return interaction.reply({ content: `> **${user} Kullanıcısında Seçilen Roller Zaten Mevcut!**`, ephemeral: true });
                    }
                }
            }

            interaction.deferUpdate();
        });

        collector.on('end', collected => {
            msg.edit({ components: [] });
        });
    }
};
*/