<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import logo from '$lib/assets/app-logo.svg';
	import { globalState } from '$lib/stores/global.svelte';
	import OfflineInfo from './OfflineInfo.svelte';
	import Popover from './Popover.svelte';
	let { isHome = false } = $props();

	// 初回アクセス時のみオフライン利用の案内を表示
	const GUIDE_DELAY = 600;
	const GUIDE_DURATION = 3000;
	let isGuideOpen = $state(false);
	const showGuideOnFirstVisit = () => {
		if (!globalState.isFirstVisit) {
			return;
		}
		globalState.markVisited();
		return [
			setTimeout(() => (isGuideOpen = true), GUIDE_DELAY),
			setTimeout(() => (isGuideOpen = false), GUIDE_DELAY + GUIDE_DURATION)
		];
	};

	onMount(() => {
		const guideTimerIds = showGuideOnFirstVisit();
		return () => guideTimerIds?.forEach((id) => clearTimeout(id));
	});
</script>

<header class="global-header">
	<svelte:element this={isHome ? 'h1' : 'div'} class="header-logo">
		<a href={resolve('/')}>
			<img src={logo} alt={m['app.name']()} />
		</a>
	</svelte:element>
	<Popover open={isGuideOpen} message={m['component.offline-info.guide']()}>
		<OfflineInfo />
	</Popover>
</header>

<style>
	.global-header {
		display: grid;
		grid-template-columns: auto auto;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		height: var(--global-header-height);
		padding-inline: 1rem;
		background-color: var(--color-bg-tertiary);
		color: var(--color-fg-reverse);
	}
	.header-logo {
		> a {
			> img {
				display: block;
				width: auto;
				height: 22px;
			}
		}
	}
</style>
