<script lang="ts">
	import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';
	import { m } from '$lib/paraglide/messages';
	import { categoryLabel } from '$lib/utils/category.js';

	const { data } = $props();
</script>

<svelte:head>
	<title>{data.article.title} - {m['app.name']()}</title>
</svelte:head>

<Breadcrumbs
	items={[
		{ href: `/category/${data.article.category}`, label: categoryLabel(data.article.category) },
		{ label: data.article.title }
	]}
/>

<main class="article-page">
	<article class="article">
		<header class="article-header">
			<div class="article-category">
				<a href={`/category/${data.article.category}`}>
					{categoryLabel(data.article.category)}
				</a>
			</div>
			<h1 class="article-title">{data.article.title}</h1>
			<ul class="article-tags">
				{#each data.article.tags as tag}
					<li>
						<a href={`/search?q=#${tag}`}>#{tag}</a>
					</li>
				{/each}
			</ul>
		</header>

		<div class="article-content">
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
		> :global(figure) {
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
		:global(iframe[data-youtube]) {
			display: block;
			aspect-ratio: 16 / 9;
			max-inline-size: 100cqw;
			width: 100cqw;
			height: auto;
			margin-inline-start: calc((100% - 100cqw) / 2);
			background-color: var(--color-bg-secondary);
			border: none;
		}
	}
</style>
