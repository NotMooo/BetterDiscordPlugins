/**
 * @name MemeSoundsv2
 * @version 0.0.2
 * @description Plays Sounds A specific Sound when Someone Sends A Specific Message. If you Have Sound ideas Please Let Me Know on Discord!
 * @invite 8GskwymGwR
 * @author NotMoo#0132
 * @authorId 488261230360788992
 * @authorLink https://github.com/NotMooo/
 * @source https://github.com/NotMooo/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/NotMooo/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js
 */

module.exports = (() => {
	
	/* Configuration */
	const config = {info: {name: "Meme Sounds V2", authors: [{name: "NotMoo#0132", discord_id: "488261230360788992", github_username: "NotMooo", twitter_username: "NotMooYT"},{name: "「🐾」𝓓𝓲𝓮 𝓚𝓪𝓽𝔃𝓮#7717", discord_id: "567879533500563457", github_username: "None"}], version: "0.0.2", description: "Plays Sounds A specific Sound when Someone Sends A Specific Message. If you Have Sound ideas Please Let Me Know on The Discord!", github: "https://github.com/NotMooo/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js", github_raw: "https://raw.githubusercontent.com/NotMooo/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js"}, defaultConfig: [{id: "setting", name: "Sound Settings", type: "category", collapsible: true, shown: true, settings: [{id: "LimitChan", name: "Limit to the current channel only.", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true}, {id: "delay", name: "Sound effect delay.", note: "The delay in miliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms"}, {id: "volume", name: "Sound effect volume.", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v*100) + "%"}]}], changelog: [{title: "New Stuff", items: ["simplified the code", "fixed oof and bruh sounds not playing", "fixed sound timings", "fixed sounds not being played in the order they are written", "fixed sound overlapping", "added volume slider in settings"]}]};

	/* Library Stuff */
	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
		load() {BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => {require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));});}});}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {

		const plugin = (Plugin, Api) => { try {
			
			/* Constants */
			const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
			const sounds = [
				{re: /no?ice/gmi, file: "noice.mp3", duration: 600},
				{re: /bazinga/gmi, file: "bazinga.mp3", duration: 550},
				{re: /oof/gmi, file: "oof.mp3", duration: 250},
				{re: /bruh/gmi, file: "bruh.mp3", duration: 470},
				{re: /paulaner/gmi, file: "paulaner.mp3", duration: 300},
				{re: /xd/gmi, file: "xd.mp3", duration: 900},
				{re: /no/gmi, file: "no.mp3", duration: 200},
				{re: /krise/gmi, file: "krise.mp3", duration: 100},
				{re: /raus/gmi, file: "raus.mp3", duration: 200}
			];

			/* Double message event fix */
			let lastMessageID = null;

			/* Meme Sounds Class */
			return class MemeSounds extends Plugin {
				constructor() {
					super();
				}

				getSettingsPanel() {
					return this.buildSettingsPanel().getElement();
				}
	
				onStart() {
					Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
				}
				
				messageEvent = async ({ channelId, message, optimistic }) => {
					if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
						return;

					if (!optimistic && lastMessageID != message.id) {
						lastMessageID = message.id;
						let queue = new Map();
						for (let sound of sounds) {
							for (let match of message.content.matchAll(sound.re))
								queue.set(match.index, sound);
						}
						for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
							let audio = new Audio("https://github.com/NotMooo/BetterDiscordPlugins/raw/main/MemeSounds/Sounds/"+sound[1].file);
							audio.volume = this.settings.setting.volume;
							audio.play();
							await new Promise(r => setTimeout(r, sound[1].duration+this.settings.setting.delay));
						}
					}
					
				};
				
				onStop() {
					Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
				}
			}
		} catch (e) { console.error(e); }};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
