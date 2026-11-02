import { m } from '#lib/paraglide/messages.js';

const style = `
	:host {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 16 / 9;
		height: auto;
		background-color: var(--color-bg-secondary);
		color: color-mix(in srgb, var(--color-fg-primary) 50%, transparent 50%);
	}
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
`;

export class YoutubeEmbed extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
		window.addEventListener('online', this.render);
		window.addEventListener('offline', this.render);
	}

	disconnectedCallback() {
		window.removeEventListener('online', this.render);
		window.removeEventListener('offline', this.render);
	}

	render = () => {
		const src = this.getAttribute('src');
		const title = this.getAttribute('title');
		const isOnline = navigator.onLine;

		if (this.shadowRoot) {
			if (isOnline) {
				this.shadowRoot.innerHTML = `
					<style>${style}</style>
          <iframe src="${src}" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
				`;
			} else {
				this.shadowRoot.innerHTML = `
					<style>${style}</style>
          <span>${m['common.youtube.offlineMessage']()}</span>
        `;
			}
		}
	};
}
