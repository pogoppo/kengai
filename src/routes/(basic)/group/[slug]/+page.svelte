<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { categoryLabel, categoryIcon } from '$lib/utils/category';
	import ArticleList from '$lib/components/contents/ArticleList.svelte';
	import { groupDescription, groupLabel } from '$lib/utils/group';
	import SectionBasic from '$lib/components/layouts/SectionBasic.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>{groupLabel(data.slug)} - KENGAI</title>
</svelte:head>

<main class="group">
	<header class="group-header">
		<picture class="group-image">
			<img src={data.groupData.image} alt={groupLabel(data.slug)} />
		</picture>
		<h1 class="group-label">{groupLabel(data.slug)}</h1>
		<p class="group-description">{groupDescription(data.slug)}</p>
	</header>

	{#each data.groupData.sections as section}
		<SectionBasic continuously={true}>
			<h2>
				<FontAwesomeIcon icon={categoryIcon(section.category)} />
				{categoryLabel(section.category)}
			</h2>
			<ArticleList articles={section.articles} />
		</SectionBasic>
	{/each}
</main>

<style>
	.group-header {
		display: grid;
		grid-template-areas:
			'image label'
			'image description';
		grid-template-columns: 50% 1fr;
		gap: 0.25rem 0.5rem;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background-color: var(--color-bg-primary);
	}
	.group-image {
		grid-area: image;
		display: flex;
		aspect-ratio: 2 / 1;
		> img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}
	.group-label {
		grid-area: label;
		align-self: flex-end;
		width: fit-content;
		padding: 2px 4px;
		background-color: var(--color-accent-primary);
		font-size: 1rem;
		font-weight: 900;
	}
	.group-description {
		grid-area: description;
		align-self: flex-start;
		font-size: 0.9rem;
	}
</style>
