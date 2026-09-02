<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { absoluteUrl } from '$lib/utils/url';
	import { serializeJsonLd } from '$lib/utils/json-ld';
	import type { StructuredData } from '$lib/utils/structured-data';

	const DEFAULT_OG_IMAGE = '/images/app/og-default.webp';
	const SITE_LOCALE = 'ja_JP';

	interface Props {
		title: string;
		description: string;
		path?: string;
		image?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
		structuredData?: StructuredData | StructuredData[];
		article?: {
			publishedTime?: string;
			modifiedTime?: string;
			section?: string;
			tags?: string[];
		};
	}

	let {
		title,
		description,
		path,
		image,
		type = 'website',
		noindex = false,
		structuredData,
		article
	}: Props = $props();

	let siteName = $derived(m['app.name']());
	let fullTitle = $derived(`${title} - ${siteName}`);
	let canonical = $derived(absoluteUrl(path ?? page.url.pathname));
	let imageUrl = $derived(absoluteUrl(image ?? DEFAULT_OG_IMAGE));

	let jsonLdContent = $derived(structuredData ? serializeJsonLd(structuredData) : '');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={SITE_LOCALE} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:alt" content={title} />

	{#if type === 'article' && article}
		{#if article.publishedTime}
			<meta property="article:published_time" content={article.publishedTime} />
		{/if}
		{#if article.modifiedTime}
			<meta property="article:modified_time" content={article.modifiedTime} />
		{/if}
		{#if article.section}
			<meta property="article:section" content={article.section} />
		{/if}
		{#each article.tags ?? [] as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#if jsonLdContent}
		<svelte:element this={'script'} type="application/ld+json">{jsonLdContent}</svelte:element>
	{/if}
</svelte:head>
