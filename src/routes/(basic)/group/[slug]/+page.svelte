<script lang="ts">
	import { resolve } from '$app/paths';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages.js';
	import { categoryLabel, categoryIcon } from '$lib/utils/category';
	import ArticleList from '$lib/components/contents/ArticleList.svelte';
	import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';
	import SectionBasic from '$lib/components/layouts/SectionBasic.svelte';
	import SectionBasicHeading from '$lib/components/layouts/SectionBasicHeading.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.groupData.label} - {m['app.name']()}</title>
</svelte:head>

<Breadcrumbs items={[{ label: data.groupData.label }]} />

<main class="group">
	<header class="group-header">
		<picture class="group-image">
			<img src={data.groupData.image} alt={data.groupData.label} />
		</picture>
		<h1 class="group-label">{data.groupData.label}</h1>
		<p class="group-description">{data.groupData.description}</p>
	</header>

	{#each data.groupData.sections as section (section.category)}
		<SectionBasic continuously={true}>
			<header class="group-section-header">
				<SectionBasicHeading level={2} icon={categoryIcon(section.category)}>
					{categoryLabel(section.category)}
				</SectionBasicHeading>
				<a href={resolve(`/category/${section.category}`)} class="group-section-more">
					{m['group.section.more']()}
					<FontAwesomeIcon icon={faCircleChevronRight} />
				</a>
			</header>
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
		padding: 1rem;
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
	.group-section-header {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		justify-content: space-between;
	}
	.group-section-more {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
		color: var(--color-link);
	}
</style>
