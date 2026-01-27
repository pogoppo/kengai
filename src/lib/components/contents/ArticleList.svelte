<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { ArticleSummary } from '$lib/types/article';
	import DashedBorderBox from './DashedBorderBox.svelte';

	let { articles }: { articles: ArticleSummary[] } = $props();

	function articlePath(slug: string): string {
		return `/article/${slug}`;
	}
</script>

{#if articles.length === 0}
	<DashedBorderBox>
		<p class="no-articles">{m['component.article-list.no-articles']()}</p>
	</DashedBorderBox>
{:else}
	<ul class="article-list">
		{#each articles as article}
			<li>
				<article>
					<a class="article-item" href={articlePath(article.slug)}>
						<h3 class="article-title">{article.title}</h3>
						<p class="article-description">
							{article.description}
							<tag-text>{article.tags.map((tag) => `#${tag}`).join(' ')}</tag-text>
						</p>
					</a>
				</article>
			</li>
		{/each}
	</ul>
{/if}

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
		tag-text {
			opacity: 0.5;
		}
	}
</style>
