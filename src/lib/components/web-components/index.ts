const webComponents: Record<string, () => Promise<CustomElementConstructor>> = {
	'youtube-embed': () => import('./youtube-embed').then(({ YoutubeEmbed }) => YoutubeEmbed),
	'link-card': () => import('./link-card').then(({ LinkCard }) => LinkCard)
};

export const defineWebComponents = () => {
	for (const [name, load] of Object.entries(webComponents)) {
		if (customElements.get(name)) continue;

		load().then((component) => {
			if (!customElements.get(name)) {
				customElements.define(name, component);
			}
		});
	}
};
