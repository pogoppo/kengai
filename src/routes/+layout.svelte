<script lang="ts">
	import { browser } from '$app/env';
	import { onNavigate } from '$app/navigation';

	import 'kiso.css';

	import { config } from '@fortawesome/fontawesome-svg-core';
	import '@fortawesome/fontawesome-svg-core/styles.css';
	config.autoAddCss = false;

	import '#lib/styles/variables.css';
	import '#lib/styles/global.css';

	import Toast from '#lib/components/layouts/Toast.svelte';
	import { defineWebComponents } from '#lib/components/web-components/index.js';

	let { children } = $props();

	if (browser) {
		defineWebComponents();
	}

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
<Toast />

<style>
	.app-root {
		display: flow-root;
		position: relative;
		box-sizing: border-box;
		max-width: var(--container-max-width);
		min-height: 100lvh;
		margin-inline: auto;
		padding-bottom: var(--global-navigation-height);
		background-color: var(--local-background-color, var(--color-bg-secondary));
		font-family: sans-serif;
	}
</style>
