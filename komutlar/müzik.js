const Discord = require('discord.js');
exports.run = async (client, message, args) => { 
let prefix = '.'
let yardım = new Discord.RichEmbed()  
.setAuthor(`${client.user.username}`, client.user.avatarURL)
.setColor('#000000')
.addField('Ahmet Pala Music Müzik Menüsü',`
**:white_small_square: = \`+çal\` : Müzik Dinlersiniz**
**:white_small_square: = \`+ses\` : Müziğin Sesin Ayarlarsınız**
**:white_small_square: = \`+geç\` : Sıradaki Şarkıya Geçersiniz**
**:white_small_square: = \`+çalan\` : Özel Eklenti Komutlarını Açar**
**:white_small_square: = \`+duraklat\` : Şarkıyı Durdurdurursunuz**
**:white_small_square: = \`+devam\` : Şarkıyı Devem Ettirirsiniz**
**:white_small_square: = \`+sıra\` : Kuyruğu Görürsünüz**
**:white_small_square: = \`+ayrıl\` : Bot Odadan Ayrılır**
**:white_small_square: = \`+davet\` : Davet Linklerini Görürsünüz**`)
.setFooter(`${message.author.tag} Tarafından İstendi.`, message.author.avatarURL)
.addField('AhmetPala Music Bot',`[Botu Davet Et](https://discord.com/oauth2/authorize?client_id=728865166061469776&scope=bot&permissions=2146958847) **|** [Destek Sunucumuz](https://discord.gg/2GrnkQV)`)
.setImage(`https://im3.ezgif.com/tmp/ezgif-3-2c869a0de905.gif`)
.setThumbnail(client.user.avatarURL)
 message.channel.send(yardım) 
  };
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: ["help","music","yardım"], 
  permLevel: 0
};
exports.help = {
  name: 'müzik'
}; 