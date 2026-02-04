<script lang="ts">
	import { onMount } from 'svelte';
	import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';
	import { unregister } from '$lib/utils/offline';
	import Breadcrumbs from '$lib/components/layouts/Breadcrumbs.svelte';
	import SectionBasicHeading from '$lib/components/layouts/SectionBasicHeading.svelte';
	import SectionBasic from '$lib/components/layouts/SectionBasic.svelte';
	import AccordionList from '$lib/components/contents/AccordionList.svelte';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	const appOfflineUnregister = async () => {
		await unregister();
		location.href = location.pathname;
	};

	onMount(() => {
		// FAQ内からオフライン登録解除を行うためのグローバル関数を定義
		Object.defineProperty(window, 'appOfflineUnregister', {
			value: appOfflineUnregister,
			writable: true,
			configurable: true // 削除可能にする
		});

		// アンカーリンクで指定されたFAQ項目を開く
		const handleHashChange = () => {
			const { hash } = location;
			if (hash) {
				const element = document.getElementById(hash.slice(1)) as HTMLDetailsElement | null;
				if (element) {
					element.open = true;
					// afterNavigateでも対応できなかった
					setTimeout(() => {
						element.scrollIntoView();
					}, 100);
				}
			}
		};
		window.addEventListener('hashchange', handleHashChange);
		handleHashChange();

		return () => {
			window.removeEventListener('hashchange', handleHashChange);
			Reflect.deleteProperty(window, 'appOfflineUnregister');
		};
	});
</script>

<svelte:head>
	<title>{m['faq.page.title']()} - {m['app.name']()}</title>
</svelte:head>

<Breadcrumbs items={[{ label: m['faq.page.title']() }]} />

<main class="faq">
	{#each data.faqSections as section, index (index)}
		<SectionBasic>
			<SectionBasicHeading level={2} icon={faQuestionCircle}>
				{section.title}
			</SectionBasicHeading>
			<AccordionList items={section.items} />
		</SectionBasic>
	{/each}
</main>
