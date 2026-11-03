<script lang="ts">
	import { createRawSnippet, mount, unmount } from 'svelte';
	import { page } from '$app/state';
	import type { Path } from '$app/types';
	import { m } from '#lib/paraglide/messages.js';
	import {
		faHome,
		faStar,
		faCircleQuestion,
		faChevronUp,
		faMagnifyingGlass
	} from '@fortawesome/free-solid-svg-icons';
	import { backToTop } from '#lib/utils/navigation.js';
	import { pathnameToArticleKey } from '#lib/utils/article.js';
	import { modalState } from '#lib/stores/modal.svelte.js';
	import { favoriteState } from '#lib/stores/favorite.svelte.js';
	import { toastState } from '#lib/stores/toast.svelte.js';
	import NavigationBar from '#lib/components/contents/NavigationBar.svelte';
	import FloatNavigation from '#lib/components/contents/FloatNavigation.svelte';
	import ModalSearch from '../modals/ModalSearch.svelte';

	interface GlobalNavigationProps {
		isArticlePage?: boolean;
	}
	let { isArticlePage = false }: GlobalNavigationProps = $props();

	let mainNavigation = $derived([
		{
			href: '' as Path,
			label: m['component.main-navigation.home.label'](),
			icon: faHome,
			active: page.url.pathname === '/'
		},
		{
			href: 'favorite' as Path,
			label: m['component.main-navigation.favorite.label'](),
			icon: faStar,
			active: page.url.pathname === '/favorite'
		},
		{
			href: 'faq' as Path,
			label: m['component.main-navigation.faq.label'](),
			icon: faCircleQuestion,
			active: page.url.pathname === '/faq'
		}
	]);

	let isFavorite = $derived.by(() => {
		if (!isArticlePage) return false;
		const key = pathnameToArticleKey(page.url.pathname);
		return favoriteState.check(key);
	});
	let subNavigation = $derived.by(() => {
		const items = [
			{
				action: actionSearchArticles,
				label: m['component.sub-navigation.search.label'](),
				icon: faMagnifyingGlass,
				highlight: false
			},
			{
				action: actionBackToTop,
				label: m['component.sub-navigation.back-to-top.label'](),
				icon: faChevronUp,
				highlight: false
			}
		];
		if (isArticlePage) {
			const key = pathnameToArticleKey(page.url.pathname);
			items.unshift({
				action: () => actionAddFavorite(key),
				label: m['component.sub-navigation.add-favorite.label'](),
				icon: faStar,
				highlight: isFavorite
			});
		}
		return items;
	});

	function actionAddFavorite(key: string) {
		favoriteState.toggle(key);
		isFavorite = favoriteState.check(key);
		toastState.show(isFavorite ? m['favorite.toast.added']() : m['favorite.toast.removed']());
	}

	function actionBackToTop() {
		backToTop();
	}

	const modalSearchSnippet = createRawSnippet(() => {
		return {
			render: () => `<div style="display: contents;"></div>`,
			setup: (target) => {
				const component = mount(ModalSearch, { target });
				return () => unmount(component);
			}
		};
	});
	function actionSearchArticles() {
		modalState.open(modalSearchSnippet);
	}
</script>

<nav class="global-navigation" aria-label={m['component.global-navigation.aria-label']()}>
	<NavigationBar items={mainNavigation} />
	{#key isArticlePage}
		<FloatNavigation items={subNavigation} />
	{/key}
</nav>

<style>
	.global-navigation {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		box-sizing: border-box;
		max-width: var(--container-max-width);
		width: 100%;
		height: var(--global-navigation-height);
		padding: 0.5rem;
	}
</style>
