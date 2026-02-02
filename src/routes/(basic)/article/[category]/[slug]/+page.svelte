<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';
	import { m } from '$lib/paraglide/messages';
	import { categoryLabel } from '$lib/utils/category.js';

	let { data } = $props();

	if (browser && !customElements.get('youtube-embed')) {
		import('$lib/utils/youtube-embed.js').then(({ YoutubeEmbed }) => {
			customElements.define('youtube-embed', YoutubeEmbed);
		});
	}
</script>

<svelte:head>
	<title>{data.articleSummary.title} - {m['app.name']()}</title>
</svelte:head>

<Breadcrumbs
	items={[
		{
			href: `/category/${data.articleSummary.category}`,
			label: categoryLabel(data.articleSummary.category)
		},
		{ label: data.articleSummary.title }
	]}
/>

<main class="article-page">
	<article class="article">
		<header class="article-header">
			<div class="article-category">
				<a href={resolve(`/category/${data.articleSummary.category}`)}>
					{categoryLabel(data.articleSummary.category)}
				</a>
			</div>
			<h1 class="article-title">{data.articleSummary.title}</h1>
			<ul class="article-tags">
				{#each data.articleSummary.tags as tag (tag)}
					<li>
						<a href={resolve(`/search?q=${encodeURIComponent(`#${tag}`)}` as `/search`)}>#{tag}</a>
					</li>
				{/each}
			</ul>
		</header>

		<div class="article-content">
			<!-- サーバーサイドで作成されたマークダウンをHTMLに変換して表示するためignore -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		</div>
	</article>
</main>

<style>
	.article-page {
		container-type: inline-size;
		background-color: var(--color-bg-primary);
	}
	.article {
		padding: 1rem;
	}
	.article-header {
		display: grid;
		gap: 0.25rem;
	}
	.article-title {
		font-size: 1.75rem;
		font-weight: 900;
	}
	.article-category {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		> a {
			padding: 0.25rem 0.5rem;
			background-color: var(--color-accent-primary);
			font-size: 0.9rem;
			font-weight: 700;
		}
	}
	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		> li {
			> a {
				color: var(--color-link);
				font-size: 1rem;
				font-weight: 700;
			}
		}
	}
	.article-content {
		> :global(h2),
		> :global(h3),
		> :global(h4),
		> :global(p),
		> :global(img),
		> :global(ul),
		> :global(ol),
		> :global(blockquote),
		> :global(pre),
		> :global(figure),
		:global(youtube-embed) {
			margin-block: 1rem;
		}

		:global(h2) {
			margin-top: 2rem;
			font-size: 1.5rem;
		}
		:global(h3) {
			font-size: 1.1rem;
		}
		:global(h4) {
			font-size: 1rem;
		}
		:global(p) {
			font-size: 1rem;
			text-align: justify;
			line-height: 1.75;
		}
		:global(hr) {
			margin-block: 1.5rem;
			border: unset;
			border-top: 2px solid var(--color-fg-primary);
			opacity: 0.25;
		}
		:global(a) {
			color: var(--color-link);
			text-decoration: underline;
			text-decoration-style: dotted;
			text-underline-offset: 0.25rem;
		}
		:global(img) {
			display: block;
			max-width: 100%;
			height: auto;
			margin-inline: auto;
			border-radius: 0.5rem;
		}
		:global(figure) {
			display: grid;
			gap: 0.5rem;
			width: 100cqw;
			margin-inline-start: calc((100% - 100cqw) / 2);
			padding: 1rem;
			background-color: var(--color-bg-secondary);
			> :global(img) {
				background-color: var(--color-bg-primary);
			}
		}
		:global(figcaption) {
			font-size: 0.9em;
		}
		:global(ul),
		:global(ol) {
			display: flow-root;
			padding-inline-start: 1.5rem;
			> :global(li) {
				margin-block: 0.5rem;
			}
		}
		:global(ul) {
			list-style: disc;
			:global(ul) {
				list-style: circle;
			}
		}
		:global(ol) {
			list-style: decimal;
			:global(ol) {
				list-style: lower-alpha;
			}
		}
		:global(blockquote) {
			padding: 1rem;
			background-color: color-mix(in srgb, var(--color-bg-secondary) 50%, transparent 50%);
			border-left: 6px solid color-mix(in srgb, var(--color-fg-primary) 50%, transparent 50%);
			font-size: 0.9rem;
			:global(p) {
				font-size: inherit;
			}
		}
		:global(pre) {
			overflow-x: auto;
			padding: 1rem;
			background-color: color-mix(in srgb, var(--color-bg-secondary) 50%, transparent 50%);
			border-radius: 0.5rem;
			font-size: 0.9rem;
		}
		:global(youtube-embed) {
			display: flex;
			align-items: center;
			justify-content: center;
			aspect-ratio: 16 / 9;
			width: 100cqw;
			height: auto;
			margin-inline-start: calc((100% - 100cqw) / 2);
			background-color: var(--color-bg-secondary);
			color: color-mix(in srgb, var(--color-fg-primary) 50%, transparent 50%);
		}
	}
</style>
