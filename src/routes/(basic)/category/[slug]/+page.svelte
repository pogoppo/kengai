<script lang="ts">
	import { categoryLabel, categoryIcon } from '$lib/utils/category';
	import ArticleList from '$lib/components/contents/ArticleList.svelte';
	import SectionBasic from '$lib/components/layouts/SectionBasic.svelte';
	import SectionBasicHeading from '$lib/components/layouts/SectionBasicHeading.svelte';
	import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>{categoryLabel(data.category)} - KENGAI</title>
</svelte:head>

<Breadcrumbs items={[{ label: categoryLabel(data.category) }]} />

<main class="category">
	<SectionBasic>
		<SectionBasicHeading icon={categoryIcon(data.category)}>
			{categoryLabel(data.category)}
		</SectionBasicHeading>
		<ArticleList articles={data.articles} />
	</SectionBasic>
</main>
