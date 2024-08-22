
const { PermissionFlagsBits } = require("discord.js");
const beş_config = require("../../../beş_config");
const client = global.client;
const db = client.db;

module.exports = {
    name: "warn",
    usage: "warn [@User / ID] <sebep>",
    category: "guard",
    aliases: ["w", "uyarı", "uyar"],
    execute: async (client, message, args, beş_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ');
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
        if (reason.length < 1) return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir Sebep Belirt!**`)] }).sil(5);
        if (!member.bannable) return message.reply({ embeds: [beş_embed.setDescription(`> **Belirtilen User'a İşlem Yapmaya Yetkim Yetmiyor!**`)] }).sil(5);

        // Rol isimlerine göre rol bulma
        const getRoleByName = (roleName) => {
            return message.guild.roles.cache.find(role => role.name === roleName);
        };

        const warningRoles = {
            "uyarı 1": getRoleByName('Uyarı 1'),
            "uyarı 2": getRoleByName('Uyarı 2'),
            "uyarı 3": getRoleByName('Uyarı 3')
        };

        // Kullanıcıdaki mevcut rolleri kontrol et
        const userRoles = member.roles.cache;
        let roleToAdd = null;

        if (!userRoles.has(warningRoles["uyarı 1"]?.id)) {
            roleToAdd = warningRoles["uyarı 1"];
        } else if (!userRoles.has(warningRoles["uyarı 2"]?.id)) {
            roleToAdd = warningRoles["uyarı 2"];
        } else if (!userRoles.has(warningRoles["uyarı 3"]?.id)) {
            // Kullanıcıda 2. uyarı rolü var ve 3. uyarı yapılacak
            roleToAdd = warningRoles["uyarı 3"];

            // 3. uyarı rolü verilecek ve ek olarak jail işlemi yapılacak
            if (member.roles.cache.some(role => beş_config.staffs.includes(role.id))) {
                // Kullanıcının sahip olduğu yetkili rolleri al
                let staffRolesToKeep = member.roles.cache.filter(role => beş_config.staffs.includes(role.id));
                let rolesToSet = [roleToAdd.id, ...staffRolesToKeep.map(role => role.id)];
                
                // Kullanıcının sahip olduğu yetkili roller dışındaki tüm rolleri kaldır
                await member.roles.set(rolesToSet);
                message.reply({ embeds: [beş_embed.setDescription(`> <@${member.id}> **3. uyarıyı aldığı için yetkilinin tüm yetkisi alındı ve uyarı rolü ayarlandı!**`)]})
   
            } else {
                // Normal üye ise
                let jailRoles = await db.get("five-jail-roles") || [];
                let jailRoleObjects = jailRoles.map(roleName => getRoleByName(roleName)).filter(role => role);
                await member.roles.set([roleToAdd.id, ...jailRoles]);
           message.reply({ embeds: [beş_embed.setDescription(`> <@${member.id}> **3. uyarıyı aldığı için kullanıcının tüm rolleri alındı ve uyarı rolü ayarlandı!**`)]})
      
            }
            return; // 3. uyarıda işlem tamamlandı, diğer işlemlere geçme
        }

        // Yeni rolü ekle
        if (roleToAdd) {
            await member.roles.add(roleToAdd);
        }

        await client.ceza(member.id, message, "WARN", reason, Date.now());
    }
};
