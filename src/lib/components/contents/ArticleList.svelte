<script lang="ts">
	import type { Article } from '$lib/types/article.js';

	let { articles }: { articles: Article[] } = $props();

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
	}
	.article-item {
	}
	.article-title {
	}
	.article-description {
	}
</style>
