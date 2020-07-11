const express = require('express');
const app = express();
const Discord = require('discord.js');
const client = new Discord.Client();
const chalk = require('chalk');
const fs = require('fs');
const { RichEmbed } = require("discord.js");
const db = require("quick.db")
const moment = require('moment');
client.conf = {"pref": process.env.prefix, "own": process.env.OWNER} 
    client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(client.conf.pref)) return;
  let command = message.content.split(" ")[0].slice(client.conf.pref.length);
  let params = message.content.split(" ").slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
})


client.on("ready", () => {  console.log(`[swaiN] ${client.user.username} ismi ile çalışıyorum!`);
  client.user.setStatus("idle")
  client.user.setActivity("By ` swaiN#1881`");
  console.log(` Oynuyor ayarlandı!`);
 });

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^READY.JS RİCH PRECENCE^^^^^^^^^^^^^^^^^^^^^^
var prefix = client.conf.prefix;

const log = message => {
  console.log(`[ADLMedia] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklenmeye hazır. Başlatılıyor...`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Komut yükleniyor: ${props.help.name}'.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komular/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};


const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new YouTube("AIzaSyBOU9HIOlvB9Jb8ZJ4mumogWvcd2MQoAL8");
const queue = new Map();

client.on("message", async message => {
  var s = "tr";

  if (db.has(`dil_${message.guild.id}`) === true) {
    var s = "en";
  }
  const dil = client[s];
  if (!message.guild) return;

  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!!";

  var args = message.content.substring(prefix.length).split(" ");
  if (!message.content.startsWith(prefix)) return;
  var searchString = args.slice(1).join(" ");
  var url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  var serverQueue = queue.get(message.guild.id);
  /*
   var voiceChannel = message.member.voiceChannel;
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      var playlist = await youtube.getPlaylist(url);
      var videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        var video2 = await youtube.getVideoByID(video.id);
        await handleVideo(video2, message, voiceChannel, true);
      }
  
  */
  switch (args[0].toLowerCase()) {
    case "oynat":
      var voiceChannel = message.member.voiceChannel;

      const embed = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`Dinlemek istediğin şarkıyı yazmalısın! (Şarkı adı veya Youtube URL'si`);
      if (!url) return message.channel.send(embed);

      const voiceChannelAdd = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`Lütfen bir ses kanalına katılın.`);
      if (!voiceChannel) return message.channel.send(voiceChannelAdd);
      var permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) {
        const warningErr = new RichEmbed()
          .setColor("RANDOM")
          .setDescription(`Kanala katılamıyorum sanırım yetkim yok.`);
        return message.channel.send(warningErr);
      }
      if (!permissions.has("SPEAK")) {
        const musicErr = new RichEmbed()
          .setColor("RANDOM")
          .setDescription(`Müzik çalamıyor / şarkı çalamıyor veya kanalda konuşma iznim yok veya mikrofonum kapalı.`);
        return message.channel.send(musicErr);
      }
      if (
        url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)
      ) {
        var playlist = await youtube.getPlaylist(url);
        var videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
          var video2 = await youtube.getVideoByID(video.id);
          await handleVideo(video2, message, voiceChannel, true);
        }
        const PlayingListAdd = new RichEmbed()
          .setColor("RANDOM")
          .setDescription(
            `[${playlist.title}](https://www.youtube.com/watch?v=${playlist.id}) İsimli şarkı oynatma listesine Eklendi.`
          );
        return message.channel.send(PlayingListAdd);
      } else {
        try {
          var video = await youtube.getVideo(url);
        } catch (error) {
          try {
            var videos = await youtube.searchVideos(searchString, 10);

            var r = 1;

            var video = await youtube.getVideoByID(videos[r - 1].id);
          } catch (err) {
            console.error(err);
            const songNope = new RichEmbed()
              .setColor("RANDOM")
              .setDescription(`Aradığınız isim ile bir şarkı bulamadım.`);
            return message.channel.send(songNope);
          }
        }
        return handleVideo(video, message, voiceChannel);
      }
      break;
    case "tekrar":
      const e = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`Ses kanalında değilsin.`);
      if (!message.member.voiceChannel) return message.channel.send(e);
      const p = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`şu anda bir şarkı çalmıyor`);
      if (!serverQueue) return message.channel.send(p);

      var u = serverQueue.songs[0];

      /*var pla = await youtube.getPlaylist(u);
      var v = await pla.getVideos();*/
      var vi2 = await youtube.getVideoByID(u.id);
      await handleVideo(vi2, message, voiceChannel, true);
      const PlayingListAdd = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(
          `[${u.title}](https://www.youtube.com/watch?v=${u.id}) İsimli şarkı bitince tekrar oynatılacak.`
        );
      return message.channel.send(PlayingListAdd);

      break;
    case "geç":
      const err0 = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`Ses kanalında değilsin.`);
      if (!message.member.voiceChannel) return message.channel.send(err0);
      const err05 = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`şu anda bir şarkı çalmıyor`);
      if (!serverQueue) return message.channel.send(err05);
      const songSkip = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`Şarkı başarılı bir şekilde geçildi`);
      serverQueue.connection.dispatcher.end("");
      message.channel.send(songSkip);
      return undefined;
      break;
    case "durdur":
      const err1 = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`Ses kanalında değilsin.`);
      if (!message.member.voiceChannel) return message.channel.send(err1);
      const err2 = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`şu anda bir şarkı çalmıyor`);
      if (!serverQueue) return message.channel.send(err2);
      serverQueue.songs = [];
      const songEnd = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`Şarkı başarıyla durduruldu ve odadan çıktım!`);
      serverQueue.connection.dispatcher.end("");
      message.channel.send(songEnd);
      return undefined;
      break;
    case "ses":
      const asd1 = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`Ses kanalında değilsin.`);
      if (!message.member.voiceChannel) return message.channel.send(asd1);
      const asd2 = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`şu anda bir şarkı çalmıyor`);
      if (!serverQueue) return message.channel.send(asd2);

      if (!args[1]) return message.reply(`Sesi ayarlamak için bir sayı yaz!`);
      serverQueue.volume = args[1];
      if (args[1] > 10) return message.channel.send(`Ses en fazla **10** değerinde olabilir`);
      serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
      const volumeLevelEdit = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`ses ayarlandı ses seviyesi: **${args[1]}**`);
      return message.channel.send(volumeLevelEdit);
      break;
    case "kuyruk":
      var siralama = 0;
      const a = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`Ses kanalında değilsin.`);
      if (!message.member.voiceChannel) return message.channel.send(a);
      const b = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(`şu anda bir şarkı çalmıyor`);
      if (!serverQueue) return message.channel.send(b);

      var k = serverQueue.songs
        .map(
          song =>
            `${++siralama} - [${song.title}](https://www.youtube.com/watch?v=${
              song.id
            })`
        )
        .join("\n")
        .replace(
          serverQueue.songs[0].title,
          `**${serverQueue.songs[0].title}**`
        );

      const kuyruk = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField("Şarkı Kuyruğu", k);
      return message.channel.send(kuyruk);
      break;

      return undefined;
      break;
  }
  async function handleVideo(video, message, voiceChannel, playlist = false) {
    var serverQueue = queue.get(message.guild.id);
    //console.log(video);
    var song = {
      id: video.id,
      title: video.title,
      durationh: video.duration.hours,
      durationm: video.duration.minutes,
      durations: video.duration.seconds,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
      requester: message.author.id
    };
    if (!serverQueue) {
      var queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 3,
        playing: true
      };
      queue.set(message.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`${dil.şarkı.kanalgir}: ${error}`);
        queue.delete(message.guild.id);
        return message.channel.send(`${dil.şarkı.hata}: ${error}`);
      }
    } else {
      serverQueue.songs.push(song);
      //console.log(serverQueue.songs);
      if (playlist) return undefined;

      const songListBed = new RichEmbed()
        .setColor("RANDOM")
        .setDescription(
          `[${song.title}](https://www.youtube.com/watch?v=${song.id}) ${dil.şarkı.eklendi}`
        );
      return message.channel.send(songListBed);
    }
    return undefined;
  }
  function play(guild, song) {
    var serverQueue = queue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    //console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection
      .playStream(ytdl(song.url))
      .on("end", reason => {
        if (reason === `${dil.şarkı.internet}`);
        else console.log(reason);
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    const playingBed = new RichEmbed()
      .setColor("RANDOM")
      .setAuthor(
        `${dil.şarkı.açıldı}`,
        "https://davidjhinson.files.wordpress.com/2015/05/youtube-icon.png"
      )
      .setDescription(`[${song.title}](${song.url})`)
      .addField(
        `${dil.şarkı.süre}`,
        `${song.durationm}:${song.durations}`,
        true
      )
      .addField(`${dil.şarkı.açtı}`, `<@${song.requester}>`, true)
      .setThumbnail(song.thumbnail);
    serverQueue.textChannel.send(playingBed);
  }

  //etiketli muzuk ewqeqw

  //Kaldırıldı
});


//^^^^^^^^^^^^^^^^^^^^SYNC KOMUTLARI^^^^^^^^^^^^^^^^
client.yetkiler = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if(message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if(message.member.hasPermission("MANAGE_ROLES")) permlvl = 2;
  if(message.member.hasPermission("MANAGE_CHANNELS")) permlvl = 3;
  if(message.member.hasPermission("KICK_MEMBERS")) permlvl = 4;
  if(message.member.hasPermission("BAN_MEMBERS")) permlvl = 5;
  if(message.member.hasPermission("ADMINISTRATOR")) permlvl = 6;
  if(message.author.id === message.guild.ownerID) permlvl = 7;
  if(message.author.id === client.conf.own) permlvl = 8;
  return permlvl;
};

//MAİNE ATKLACAKLAR AŞŞAĞIYA









 






// MAİNE ATILACAKLAR YUKA










 client.login(process.env.TOKEN);




////////////////////////////
//////////Dash kısmı////////////

const dc = require("discord.js");
const dcc = new dc.Client();

client.ayar = db;
client.config = require("./ayarlar.js");
client.ayarlar = require("./ayarlar.js")

dcc.ayar = db;
dcc.config = require("./ayarlar.js");
dcc.ayarlar = require("./ayarlar.js")


require("./modüller/fonksiyonlar.js")(dcc);

client.on("ready", async () => {
  client.appInfo = await client.fetchApplication();
  dcc.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
    dcc.appInfo = await client.fetchApplication();
  }, 60000);
  require("./modüller/panel.js")(dcc, client);
});

dcc.login(process.env.TOKEN);