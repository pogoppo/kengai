<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import logo from '$lib/assets/app-logo.svg';
	let { isHome = false } = $props();
</script>

<header class="global-header">
	<svelte:element this={isHome ? 'h1' : 'div'} class="header-logo">
		<a href="/">
			<img src={logo} alt={m['app.name']()} />
		</a>
	</svelte:element>
</header>

<style>
	.global-header {
		height: var(--global-header-height);
		background-color: var(--color-bg-tertiary);
		color: var(--color-fg-reverse);
	}
	.header-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		> a {
			> img {
				display: block;
				width: auto;
				height: 22px;
			}
		}
	}
</style>
