<script lang="ts">
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
		const newSet = new Set(checkedArticles);
		if (newSet.has(slug)) {
			newSet.delete(slug);
		} else {
			newSet.add(slug);
		}
		checkedArticles = newSet;
	}

	function articlePath(slug: string): string {
		return `/article/${slug}`;
	}
</script>

{#snippet articleInfo(article: ArticleSummary)}
	<h3 class="article-title">{article.title}</h3>
	<p class="article-description">
		{article.description}
		<tag-text>{article.tags.map((tag) => `#${tag}`).join(' ')}</tag-text>
	</p>
{/snippet}

{#snippet articleList()}
	<ul class="article-list">
		{#each articles as article}
			<li>
				<article>
					<a class="article-item" href={articlePath(article.slug)}>
						{@render articleInfo(article)}
					</a>
				</article>
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet checkableArticleList()}
	<ul class="article-list">
		{#each articles as article}
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
		grid-template-areas:
			'title'
			'description';
		gap: 2px;
		&:is(a, label) {
			cursor: pointer;
		}
		&:has(article-checkbox) {
			grid-template-areas:
				'checkbox title'
				'checkbox description';
			grid-template-columns: auto 1fr;
			gap: 2px 1rem;
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
	}
</style>
