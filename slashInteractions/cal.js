const {
	SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
	name: "çal",
	command: new SlashCommandBuilder().setName("çal").setDescription("İsmini Girdiğiniz Müziği Oynatırım").addStringOption(o => o.setName("name").setDescription("⚠ **Bir Müzik İsmi Girmen Lazım**").setRequired(true)),
	async run(client, int, player, embed) {

		let name = int.options.getString("name");

		let queue = player.createQueue(int.guild, {
			metadata: {
				channel: int.channel
			}
		});

		try {
			if (!queue.connection) await queue.connect(int.member.voice.channel);
		} catch {
			queue.destroy();
			return await int.reply({
				embeds: [embed(int.guild, int.member.user).setTitle("⚠ **Bulunduğun Kanala Katılamıyorum**")],
				ephemeral: true
			});
		};

		let emb = embed(int.guild, int.member.user);

		let track = await player.search(name, {
			requestedBy: int.user
		}).then(x => x.tracks[0]);
		if (!track) emb = emb.setDescription(`⚠ ${name} **İsminde Müzik Bulamadım**`);
		else emb = emb.setTitle("**MÜZİK EKLENDİ  ✅**").addField("**📩 Video İsmi :**", `${track.title}`, true).addField("🔺 **YouTube Kanalı :**", `${track.author}`, true).addField("📱 **İzlenme Sayısı :**", `${track.views}`, true).setImage(`${track.thumbnail}`);

		queue.play(track);

		return await int.reply({
			embeds: [emb]
		});

	}
};