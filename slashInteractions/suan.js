const {
	SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
	name: "şuan",
	command: new SlashCommandBuilder().setName("şuan").setDescription("Şuanda Oynatılan Müziğin Bilgilerini Veririm"),
	async run(client, int, player, embed) {

		let queue = player.createQueue(int.guild, {
			metadata: {
				channel: int.channel
			}
		});

		let emb;

		let track = queue.nowPlaying();
		if (track) emb = embed(queue.guild, track.requestedBy).setTitle("🎶 **Şuanda Oynatılan Müzik**").setFooter({
			text: `${queue.createProgressBar()}`
		}).addField("📩 **Video İsmi :**", `${track.title}`, true).addField("🔺 **YouTube Kanalı :**", `${track.author}`, true).addField("📱 **İzlenme Sayısı :**", `${track.views}`, true).setImage(`${track.thumbnail}`);
		else emb = embed(queue.guild, track.requestedBy).setDescription("Şuanda çalan bir **şarkı** yok!");


		return await int.reply({
			embeds: [emb]
		});

	}
};