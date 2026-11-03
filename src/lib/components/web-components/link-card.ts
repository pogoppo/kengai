import { articleRepository } from '#lib/repositories/article.js';

const style = `
	:host {
		display: block;
	}
	a {
		display: grid;
		grid-template-areas:
			'thumbnail title'
			'thumbnail description';
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr;
		row-gap: 2px;
		padding: 0.75rem;
		background-color: var(--color-bg-primary);
		border: 2px solid var(--color-bg-secondary);
		border-radius: 0.5rem;
		color: inherit;
		text-decoration: none;
		text-align: start;
		line-height: 1.5;
	}
	.thumbnail {
		grid-area: thumbnail;
		align-self: start;
		display: block;
		overflow: hidden;
		aspect-ratio: 1 / 1;
		width: 4rem;
		margin-right: 0.75rem;
		background-color: var(--color-bg-secondary);
		border-radius: 0.25rem;
		> img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	.title {
		grid-area: title;
		display: block;
		color: var(--color-link);
		font-size: 1rem;
		font-weight: 700;
	}
	.description {
		grid-area: description;
		display: block;
		font-size: 0.8rem;
		> tag-text {
			opacity: 0.5;
		}
	}
`;

const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

export class LinkCard extends HTMLElement {
	// category・slug属性で指定された記事へのリンクをカードとして表示する
	static observedAttributes = ['category', 'slug'];

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	attributeChangedCallback() {
		this.render();
	}

	render = () => {
		if (!this.shadowRoot) return;

		const category = this.getAttribute('category') ?? '';
		const slug = this.getAttribute('slug') ?? '';
		const article = articleRepository.find(category, slug);

		if (!article) {
			console.warn(`link-card: article not found (category="${category}", slug="${slug}")`);
			this.shadowRoot.innerHTML = '';
			return;
		}

		const href = `/article/${article.category}/${article.slug}`;
		const thumbnail = article.thumbnail
			? `<picture class="thumbnail"><img src="${escapeHtml(article.thumbnail)}" alt="" loading="lazy" decoding="async"></picture>`
			: '';
		const tags = article.tags.map((tag) => `#${tag}`).join(' ');

		this.shadowRoot.innerHTML = `
			<style>${style}</style>
			<a href="${escapeHtml(href)}">
				${thumbnail}
				<span class="title">${escapeHtml(article.title)}</span>
				<span class="description">
					${escapeHtml(article.description)}
					<tag-text>${escapeHtml(tags)}</tag-text>
				</span>
			</a>
		`;
	};
}
