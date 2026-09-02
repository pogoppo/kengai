<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';
	import PageMeta from '$lib/components/layouts/PageMeta.svelte';
	import { articleSchema } from '$lib/utils/structured-data';
	import { categoryLabel } from '$lib/utils/category.js';

	let { data } = $props();

	let articlePath = $derived(
		`/article/${data.articleSummary.category}/${data.articleSummary.slug}`
	);

	if (browser && !customElements.get('youtube-embed')) {
		import('$lib/components/web-components/youtube-embed').then(({ YoutubeEmbed }) => {
			customElements.define('youtube-embed', YoutubeEmbed);
		});
	}
</script>

<PageMeta
	title={data.articleSummary.title}
	description={data.articleSummary.description}
	path={articlePath}
	image={data.articleSummary.thumbnail}
	type="article"
	article={{
		publishedTime: data.articleSummary.date,
		modifiedTime: data.articleSummary.updated,
		section: categoryLabel(data.articleSummary.category),
		tags: data.articleSummary.tags
	}}
	structuredData={articleSchema(data.articleSummary, { path: articlePath })}
/>

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
			<p class="article-description">{data.articleSummary.description}</p>
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

		{#if data.articleSummary.date || data.articleSummary.updated}
			<footer class="article-footer">
				{#if data.articleSummary.date}
					<article-date>
						{m['article.date.published']()}:
						<time datetime={data.articleSummary.date}>
							{data.articleSummary.date}
						</time>
					</article-date>
				{/if}
				{#if data.articleSummary.updated}
					<article-date>
						{m['article.date.updated']()}:
						<time datetime={data.articleSummary.updated}>
							{data.articleSummary.updated}
						</time>
					</article-date>
				{/if}
			</footer>
		{/if}
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
	.article-description {
		font-size: 0.75rem;
		opacity: 0.9;
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
				font-size: 0.8rem;
				font-weight: 700;
			}
		}
	}
	.article-footer {
		article-date {
			display: inline-block;
			margin-right: 1rem;
			font-size: 0.8rem;
			opacity: 0.5;
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
		> :global(table),
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
		:global(table) {
			display: flow-root;
			overflow-x: auto;
			width: 100%;
			border-collapse: collapse;
			font-size: 0.9rem;
			white-space: nowrap;
			:global(th),
			:global(td) {
				padding: 0.5rem 0.75rem;
				border: 1px solid color-mix(in srgb, var(--color-fg-primary) 25%, transparent);
			}
			:global(th) {
				background-color: var(--color-bg-secondary);
				font-weight: 700;
			}
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
