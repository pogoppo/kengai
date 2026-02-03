<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import logo from '$lib/assets/app-logo.svg';
	import OfflineInfo from './OfflineInfo.svelte';
	let { isHome = false } = $props();
</script>

<header class="global-header">
	<svelte:element this={isHome ? 'h1' : 'div'} class="header-logo">
		<a href={resolve('/')}>
			<img src={logo} alt={m['app.name']()} />
		</a>
	</svelte:element>
	<OfflineInfo />
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
