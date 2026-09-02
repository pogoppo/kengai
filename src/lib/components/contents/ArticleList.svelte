<script lang="ts">
	import { resolve } from '$app/paths';
	import { SvelteSet } from 'svelte/reactivity';
	import { m } from '$lib/paraglide/messages';
	import type { ArticleSummary } from '$lib/types/article';
	import CheckboxBasic from './CheckboxBasic.svelte';
	import DashedBorderBox from './DashedBorderBox.svelte';

	interface ArticleListProps {
		articles: ArticleSummary[];
		checkable?: boolean;
		checkedArticles?: Set<string>;
	}
	let {
		articles,
		checkable = false,
		checkedArticles = $bindable(new Set<string>())
	}: ArticleListProps = $props();

	function toggleArticleCheck(slug: string) {
		const newSet = new SvelteSet(checkedArticles);
		if (newSet.has(slug)) {
			newSet.delete(slug);
		} else {
			newSet.add(slug);
		}
		checkedArticles = newSet;
	}
</script>

{#snippet articleInfo(article: ArticleSummary)}
	{#if article.thumbnail}
		<picture class="article-thumbnail">
			<img src={article.thumbnail} alt="" loading="lazy" decoding="async" />
		</picture>
	{/if}
	<h3 class="article-title">{article.title}</h3>
	<p class="article-description">
		{article.description}
		<tag-text>{article.tags.map((tag) => `#${tag}`).join(' ')}</tag-text>
	</p>
{/snippet}

{#snippet articleList()}
	<ul class="article-list">
		{#each articles as article (article.slug)}
			<li>
				<article>
					<a class="article-item" href={resolve(`/article/${article.category}/${article.slug}`)}>
						{@render articleInfo(article)}
					</a>
				</article>
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet checkableArticleList()}
	<ul class="article-list">
		{#each articles as article (article.slug)}
			<li>
				<article>
					<label class="article-item">
						<article-checkbox>
							<CheckboxBasic
								checked={checkedArticles.has(article.slug)}
								onchange={() => toggleArticleCheck(article.slug)}
							/>
						</article-checkbox>
						{@render articleInfo(article)}
					</label>
				</article>
			</li>
		{/each}
	</ul>
{/snippet}

{#if articles.length === 0}
	<DashedBorderBox>
		<p class="no-articles">{m['component.article-list.no-articles']()}</p>
	</DashedBorderBox>
{:else if checkable}
	{@render checkableArticleList()}
{:else}
	{@render articleList()}
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
		/* checkbox・thumbnailは省略可能。未描画のトラックは幅0に潰れるため、
		   カラム間の余白はcolumn-gapではなく各要素のmargin-rightで表現する */
		grid-template-areas:
			'checkbox thumbnail title'
			'checkbox thumbnail description';
		grid-template-columns: auto auto 1fr;
		row-gap: 2px;
		&:is(a, label) {
			cursor: pointer;
		}
	}
	.article-thumbnail {
		grid-area: thumbnail;
		align-self: start;
		overflow: hidden;
		aspect-ratio: 1 / 1;
		width: 4rem;
		margin-right: 0.75rem;
		box-sizing: border-box;
		background-color: var(--color-bg-secondary);
		border-radius: 0.25rem;
		> img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	.article-title {
		grid-area: title;
		font-size: 1rem;
		font-weight: 700;
		a & {
			color: var(--color-link);
		}
	}
	.article-description {
		grid-area: description;
		font-size: 0.8rem;
		tag-text {
			opacity: 0.5;
		}
	}
	article-checkbox {
		grid-area: checkbox;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 1rem;
	}
</style>
