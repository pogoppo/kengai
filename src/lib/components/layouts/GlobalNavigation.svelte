<script lang="ts">
	import { page } from '$app/state';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faHome,
		faStar,
		faCircleQuestion,
		faChevronUp,
		faMagnifyingGlass
	} from '@fortawesome/free-solid-svg-icons';
	import { backToTop } from '$lib/utils/navigation';

	const mainNavigation = [
		{ href: '/', label: 'ホーム', icon: faHome },
		{ href: '/favorite', label: 'お気に入り', icon: faStar },
		{ href: '/faq', label: 'FAQ', icon: faCircleQuestion }
	];

	const subNavigation = [
		{ action: actionSearchArticles, label: '記事検索', icon: faMagnifyingGlass },
		{ action: actionBackToTop, label: 'トップへ戻る', icon: faChevronUp }
	];

	function actionBackToTop() {
		backToTop();
	}

	function actionSearchArticles() {
		console.log('記事検索 clicked');
	}
</script>

<nav class="global-navigation">
	<ul class="main-navigation">
		{#each mainNavigation as item}
			<li>
				<a href={item.href} data-current={item.href === page.url.pathname}>
					<nav-icon>
						<FontAwesomeIcon icon={item.icon} />
					</nav-icon>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
	<ul class="sub-navigation">
		{#each subNavigation as item}
			<li>
				<button on:click={item.action} aria-label={item.label}>
					<FontAwesomeIcon icon={item.icon} />
				</button>
			</li>
		{/each}
	</ul>
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

	.main-navigation {
		display: flex;
		overflow: hidden;
		width: fit-content;
		margin-inline: auto;
		background-color: var(--color-bg-reverse);
		border-radius: 999px;
		> li > a {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			height: 40px;
			padding: 1rem 0.75rem;
			color: var(--color-fg-reverse);
			font-size: 0.8rem;
			font-weight: 900;
			&[data-current='true'] {
				background-color: var(--color-bg-tertiary);
				pointer-events: none;
			}
		}
		> li:first-child > a {
			padding-left: 1.25rem;
		}
		> li:last-child > a {
			padding-right: 1.25rem;
		}
		nav-icon {
			opacity: 0.75;
			scale: 1.15;
		}
	}

	.sub-navigation {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: absolute;
		bottom: 100%;
		right: 0;
		padding: 0.5rem 1rem;

		/* ページの一番下までスクロールで非表示に */
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		@container scroll-state(scrollable: bottom) {
			pointer-events: auto;
			opacity: 1;
		}

		> li > button {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 48px;
			height: 48px;
			border: none;
			border-radius: 999px;
			color: var(--color-fg-primary);
			font-size: 1.4rem;

			/* ビジュアルの調整として背景を重ねている */
			background-color: var(--color-bg-secondary);
			mix-blend-mode: multiply;
			&::before {
				content: '';
				position: absolute;
				inset: 0;
				border-radius: 999px;
				background-color: color-mix(in srgb, var(--color-bg-secondary) 50%, transparent);
				mix-blend-mode: multiply;
				pointer-events: none;
			}
		}
	}
</style>
