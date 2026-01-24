<script lang="ts">
	import { onNavigate } from '$app/navigation';

	import { setLocale } from '$lib/paraglide/runtime';
	setLocale('ja');

	import 'kiso.css';

	import { config } from '@fortawesome/fontawesome-svg-core';
	import '@fortawesome/fontawesome-svg-core/styles.css';
	config.autoAddCss = false;

	import '@fontsource/zen-kaku-gothic-new/300.css';
	import '@fontsource/zen-kaku-gothic-new/400.css';
	import '@fontsource/zen-kaku-gothic-new/500.css';
	import '@fontsource/zen-kaku-gothic-new/700.css';
	import '@fontsource/zen-kaku-gothic-new/900.css';

	import '$lib/styles/variables.css';
	import '$lib/styles/global.css';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="app-root">
	{@render children()}
</div>

<style>
	.app-root {
		display: flow-root;
		position: relative;
		box-sizing: border-box;
		max-width: var(--container-max-width);
		margin-inline: auto;
		background-color: var(--local-background-color, var(--color-bg-secondary));
		font-family: 'Zen Kaku Gothic New', sans-serif;
		font-weight: 500;

		/* フロートの<GlobalNavigation>を考慮し、余白の遊びを確保 */
		min-height: calc(100lvh + var(--scroll-free-play));
		padding-bottom: var(--global-navigation-height);
	}
</style>
