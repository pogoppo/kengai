<script lang="ts">
	import { faStar, faTrashCan } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages.js';
	import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';
	import ArticleList from '$lib/components/contents/ArticleList.svelte';
	import ButtonBasic from '$lib/components/contents/ButtonBasic.svelte';
	import SectionBasic from '$lib/components/layouts/SectionBasic.svelte';
	import SectionBasicHeading from '$lib/components/layouts/SectionBasicHeading.svelte';
	import DashedBorderBox from '$lib/components/contents/DashedBorderBox.svelte';
	import { favoriteState } from '$lib/stores/favorite.svelte';
	import { articleRepository } from '$lib/repositories/article';

	let favoriteEntries = $derived(favoriteState.entries());
	let articles = $derived(articleRepository.findBySlugs(favoriteEntries));
	let isEditMode = $state(false);
	let checkedArticles = $state(new Set<string>());

	function handleEditClick() {
		checkedArticles = new Set();
		isEditMode = !isEditMode;
	}

	function handleDeleteClick() {
		if (window.confirm(m['favorite.delete-confirm']()) === false) {
			return;
		}

		for (const slug of checkedArticles) {
			favoriteState.delete(slug);
		}
		favoriteEntries = favoriteState.entries();
		checkedArticles = new Set();
		isEditMode = false;
	}
</script>

<svelte:head>
	<title>{m['favorite.page.title']()} - {m['app.name']()}</title>
</svelte:head>

<Breadcrumbs items={[{ label: m['favorite.page.title']() }]} />

<main class="favorite">
	<SectionBasic>
		<header class="favorite-header">
			<SectionBasicHeading level={2} icon={faStar}>
				{m['favorite.page.title']()}
			</SectionBasicHeading>
			<ButtonBasic
				disabled={articles.length === 0}
				variant={isEditMode ? 'accent' : 'primary'}
				onclick={handleEditClick}
			>
				{isEditMode ? m['common.cancel']() : m['common.edit']()}
			</ButtonBasic>
		</header>
		{#if articles.length === 0}
			<DashedBorderBox>
				<p class="query-empty">{m['favorite.empty']()}</p>
			</DashedBorderBox>
		{:else}
			<ArticleList {articles} checkable={isEditMode} bind:checkedArticles />
		{/if}
		{#if isEditMode}
			<div class="favorite-delete">
				<ButtonBasic
					rounded={true}
					variant="danger"
					icon={faTrashCan}
					onclick={handleDeleteClick}
					--local-font-size="1rem"
					disabled={checkedArticles.size === 0}
				>
					{m['favorite.delete-button']()}
				</ButtonBasic>
			</div>
		{/if}
	</SectionBasic>
</main>

<style>
	.favorite-header {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: flex-start;
		justify-content: space-between;
	}
	.favorite-delete {
		display: flex;
		justify-content: center;
		position: sticky;
		bottom: 0;
		padding-block: 1rem calc(var(--global-navigation-height) + 0.5rem);
		background-color: var(--color-bg-secondary);
	}
</style>
