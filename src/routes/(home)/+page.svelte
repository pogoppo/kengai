<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { categoryIcon, categoryLabel } from '$lib/utils/category';
	import SectionBasic from '$lib/components/layouts/SectionBasic.svelte';
	import SearchBar from '$lib/components/contents/SearchBar.svelte';
	import LinkCard from '$lib/components/contents/LinkCard.svelte';
	import Chip from '$lib/components/contents/Chip.svelte';

	let { data } = $props();

	function handleSearch(query: string) {
		// 検索処理
		console.log('Search from Home:', query);
	}
</script>

<svelte:head>
	<title>圏外でも使える野外ノウハウアプリ {m['app.name']()}</title>
</svelte:head>

<main class="home">
	<section class="concept">
		<h2 class="concept-text">
			圏外でも使える<br />野外ノウハウアプリ
		</h2>
		<picture>
			<img class="concept-image" src="/images/app/mog-front-basic.webp" alt="" />
		</picture>
	</section>

	<SectionBasic>
		<SearchBar onSearch={handleSearch} placeholder="ノウハウを検索 (例: タープ)" />
	</SectionBasic>

	<SectionBasic continuously={true} --local-padding-inline="0.5rem">
		<ul class="groups">
			{#each data.groups as group}
				<li>
					<LinkCard
						label={group.label}
						description={group.description}
						image={group.image}
						href={`/group/${group.slug}`}
					/>
				</li>
			{/each}
		</ul>
	</SectionBasic>

	<SectionBasic continuously={true} --local-padding-inline="0.5rem">
		<ul class="categories">
			{#each data.categories as category}
				<li>
					<Chip
						href={`/category/${category}`}
						label={categoryLabel(category)}
						icon={categoryIcon(category)}
					/>
				</li>
			{/each}
		</ul>
	</SectionBasic>
</main>

<style>
	.concept {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: -1px;
		padding-bottom: 1rem;
		background-color: var(--color-bg-tertiary);
	}
	.concept-text {
		color: var(--color-fg-reverse);
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.5;
	}
	.concept-image {
		aspect-ratio: 60 / 65;
		height: 65px;
	}
	.groups {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
		grid-template-rows: 1fr;
		gap: 0.5rem;
	}
	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
