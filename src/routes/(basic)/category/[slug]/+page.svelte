<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { categoryLabel, categoryIcon } from '$lib/utils/category';
	import ArticleList from '$lib/components/contents/ArticleList.svelte';
	import SectionBasic from '$lib/components/layouts/SectionBasic.svelte';
	import SectionBasicHeading from '$lib/components/layouts/SectionBasicHeading.svelte';
	import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';
	import PageMeta from '$lib/components/layouts/PageMeta.svelte';
	import { collectionPageSchema } from '$lib/utils/structured-data';

	let { data } = $props();

	let label = $derived(categoryLabel(data.category));
	let description = $derived(m['category.page.description']({ label }));
	let path = $derived(`/category/${data.category}`);
</script>

<PageMeta
	title={label}
	{description}
	{path}
	structuredData={collectionPageSchema({
		name: label,
		description,
		path,
		articles: data.articles
	})}
/>

<Breadcrumbs items={[{ label: categoryLabel(data.category) }]} />

<main class="category">
	<SectionBasic>
		<SectionBasicHeading level={1} icon={categoryIcon(data.category)}>
			{categoryLabel(data.category)}
		</SectionBasicHeading>
		<ArticleList articles={data.articles} />
	</SectionBasic>
</main>
