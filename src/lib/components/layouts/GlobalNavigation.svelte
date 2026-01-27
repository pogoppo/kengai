<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import {
		faHome,
		faStar,
		faCircleQuestion,
		faChevronUp,
		faMagnifyingGlass
	} from '@fortawesome/free-solid-svg-icons';
	import { backToTop } from '$lib/utils/navigation';
	import NavigationBar from '$lib/components/contents/NavigationBar.svelte';
	import FloatNavigation from '$lib/components/contents/FloatNavigation.svelte';

	let mainNavigation = $derived([
		{
			href: '/',
			label: m['component.main-navigation.home.label'](),
			icon: faHome,
			active: page.url.pathname === '/'
		},
		{
			href: '/favorite',
			label: m['component.main-navigation.favorite.label'](),
			icon: faStar,
			active: page.url.pathname === '/favorite'
		},
		{
			href: '/faq',
			label: m['component.main-navigation.faq.label'](),
			icon: faCircleQuestion,
			active: page.url.pathname === '/faq'
		}
	]);

	let subNavigation = $derived.by(() => {
		const isArticlePage = /article\/[^/]+\/[^/]+$/.test(page.url.pathname);
		const items = [
			{
				action: actionSearchArticles,
				label: m['component.sub-navigation.search.label'](),
				icon: faMagnifyingGlass
			},
			{
				action: actionBackToTop,
				label: m['component.sub-navigation.back-to-top.label'](),
				icon: faChevronUp
			}
		];
		if (isArticlePage) {
			items.unshift({
				action: actionAddFavorite,
				label: m['component.sub-navigation.add-favorite.label'](),
				icon: faStar
			});
		}
		return items;
	});

	function actionAddFavorite() {
		console.log('お気に入りに追加 clicked');
	}

	function actionBackToTop() {
		backToTop();
	}

	function actionSearchArticles() {
		console.log('記事検索 clicked');
	}
</script>

<nav class="global-navigation" aria-label={m['component.global-navigation.aria-label']()}>
	<NavigationBar items={mainNavigation} />
	<FloatNavigation items={subNavigation} />
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
