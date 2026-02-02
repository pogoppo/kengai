<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { articleRepository } from '$lib/repositories/article';
	import { createSearchURL } from '$lib/utils/search';
	import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';
	import SectionBasic from '$lib/components/layouts/SectionBasic.svelte';
	import SearchBar from '$lib/components/contents/SearchBar.svelte';
	import ArticleList from '$lib/components/contents/ArticleList.svelte';
	import SectionBasicHeading from '$lib/components/layouts/SectionBasicHeading.svelte';
	import DashedBorderBox from '$lib/components/contents/DashedBorderBox.svelte';

	let query = $derived((page.url.searchParams.get('q') ?? '').trim());
	let results = $derived(query ? articleRepository.filter({ query }) : []);

	function handleSearch(query: string) {
		const url = createSearchURL(query);
		if (!url.searchParams.get('q')) return;
		const pathname = `/search${url.search}`;
		goto(resolve(pathname as '/search'));
	}
</script>

<svelte:head>
	<title>{m['search.page.title']()} - {m['app.name']()}</title>
</svelte:head>

<Breadcrumbs items={[{ label: m['search.page.title']() }]} />

<main class="search">
	<SectionBasic>
		<SearchBar onSearch={handleSearch} placeholder={m['search.placeholder']()} value={query} />
	</SectionBasic>

	<SectionBasic continuously={true}>
		{#if query && query !== ''}
			<SectionBasicHeading level={2}>
				<span class="search-heading">
					<strong class="search-heading-query">{query}</strong>
					の検索結果 {results.length} 件
				</span>
			</SectionBasicHeading>
			<ArticleList articles={results} />
		{:else}
			<DashedBorderBox>
				<p class="query-empty">{m['search.query-empty']()}</p>
			</DashedBorderBox>
		{/if}
	</SectionBasic>
</main>

<style>
	.search-heading {
		font-size: 0.9em;
	}
	.search-heading-query {
		margin-right: 0.25rem;
		font-size: 1.2em;
		text-decoration: underline;
	}
</style>
