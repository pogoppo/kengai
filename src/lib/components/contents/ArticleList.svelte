<script lang="ts">
	import type { ArticleSummary } from '$lib/types/article';

	let { articles }: { articles: ArticleSummary[] } = $props();

	function articlePath(slug: string): string {
		return `/article/${slug}`;
	}
</script>

<ul class="article-list">
	{#each articles as article}
		<li>
			<article>
				<a class="article-item" href={articlePath(article.slug)}>
					<h3 class="article-title">{article.title}</h3>
					<p class="article-description">{article.description}</p>
				</a>
			</article>
		</li>
	{/each}
</ul>

<style>
	.article-list {
		padding: 0.75rem 1rem;
		background-color: var(--color-bg-primary);
		border-radius: 0.5rem;
		> li {
			&:not(:first-child) {
				margin-top: 0.75rem;
				padding-top: 0.5rem;
				border-top: 2px solid var(--color-bg-secondary);
			}
		}
	}
	.article-item {
		display: grid;
		gap: 2px;
	}
	.article-title {
		color: var(--color-link);
		font-size: 1rem;
		font-weight: 700;
	}
	.article-description {
		font-size: 0.8rem;
	}
</style>
