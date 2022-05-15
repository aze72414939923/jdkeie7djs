const {
	REST
} = require('@discordjs/rest');
const {
	Routes
} = require('discord-api-types/v9');
const {
	Client,
	Intents,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	Collection,
	MessageSelectMenu
} = require("discord.js");
const {
	readdirSync
} = require("fs");
const client = new Client({
	intents: 32767
});
const {
	Player
} = require("discord-player");
const player = new Player(client);
var embed = (g, u) => {
	return new MessageEmbed().setColor(g.me.roles.highest.color).setFooter({
		text: `${u.tag} Tarafından Kullanıldı`,
		iconURL: `${u.displayAvatarURL()}`
	});
};
client.login(process.env.token);
client.on("ready", async () => {
	console.log("Hazır");
});

// Buton Etkileşimleri
client.buttonInteractions = new Collection();
readdirSync("./buttonInteractions/").forEach(f => {
	let cmd = require(`./buttonInteractions/${f}`);
	client.buttonInteractions.set(cmd.customId, cmd);
});
// Buton Etkileşimleri

// Slash Etkileşimleri
client.slashInteractions = new Collection();
let globalSlashCommands = [];
readdirSync("./slashInteractions/").forEach(f => {
	let cmd = require(`./slashInteractions/${f}`);
	client.slashInteractions.set(cmd.name, cmd);
	globalSlashCommands.push(cmd.command);
});
// Slash Etkileşimleri


// Slash Global Komutlar Ekleyelim
let rest = new REST({
	version: '9'
}).setToken(process.env.token);

client.on("ready", async () => {
	try {

		await rest.put(
			Routes.applicationCommands(client.user.id), {
				body: globalSlashCommands
			},
		);

		console.log('Global komutlar güncellendi.');
	} catch (error) {
		console.error(error);
	};
});
// Slash Global Komutlar Ekleyelim


client.on("interactionCreate", async int => {

	if (int.isCommand()) {
		if (int.guild.me.voice.channelId && int.member.voice.channelId !== int.guild.me.voice.channelId) return await int.reply({
			content: "⚠ **Şuan Başka Bir Kanaldayım**",
			ephemeral: true
		});
		else if (!int.guild.me.voice.channelId && int.commandName != "çal" && int.commandName != "ara" && int.commandName != "kapat") return await int.reply({
			content: "⚠ **Herhangi Bir Kanalda Bulunmuyorum**",
			ephemeral: true
		});
		else if (!int.member.voice.channelId) return await int.reply({
			content: "⚠ **Bir Ses Kanalında Olman Lazım**",
			ephemeral: true
		});
		else client.slashInteractions.get(int.commandName)?.run(client, int, player, embed);
	} else client.buttonInteractions.get("add-music").run(client, int, player, embed);

});

client.on('voiceStateUpdate', (oldState, newState) => {
	if (oldState.channelId && !newState.channelId && newState.id === client.user.id) {
		let queue = player.createQueue(oldState.guild, {
			metadata: {
				
			}
		});

		queue.destroy(true);
	};
});

player.on("trackStart", (queue, track) => queue.metadata.channel.send({
	embeds: [embed(queue.guild, track.requestedBy).setTitle("🎶  **MÜZİK OYNATILIYOR**").addField("📩 **Video İsmi :**", `${track.title}`, true).addField("🔺 **YouTube Kanalı :**", `${track.author}`, true).addField("📱 **İzlenme Sayısı :**", `${track.views}`, true).setImage(`${track.thumbnail}`)]
}))