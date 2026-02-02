<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
	import GlobalHeader from '$lib/components/layouts/GlobalHeader.svelte';
</script>

<svelte:head>
	<title>{m['error.page.title']()} - {m['app.name']()}</title>
</svelte:head>

<div class="float-header">
	<GlobalHeader />
</div>
<main class="error">
	<div class="error-heading-container">
		<h1 class="error-heading">
			<span class="error-heading-code">404</span>
			<span>Not Found</span>
		</h1>
		<picture class="error-heading-image">
			<img src="/images/app/mog-404.webp" alt="" />
		</picture>
	</div>
	<p class="error-description">{m['error.page.description']()}</p>
	<p class="error-back-to-home">
		<a href={resolve('/')}>
			{m['common.back-to-home']()}<FontAwesomeIcon icon={faCircleChevronRight} />
		</a>
	</p>
</main>

<style>
	.float-header {
		position: absolute;
		z-index: 2;
		width: 100%;
	}
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		position: absolute;
		width: 100%;
		height: 100lvh;
	}
	.error-heading-container {
		container-type: inline-size;
		display: grid;
		grid-template-areas: 'image heading';
		grid-template-columns: 40% 1fr;
		align-items: flex-end;
		justify-content: center;
		gap: 1rem;
		width: 100%;
		max-width: 320px;
	}
	.error-heading {
		grid-area: heading;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		aspect-ratio: 1;
		width: 100%;
		background-image: radial-gradient(
			closest-side,
			var(--color-bg-primary) 0%,
			var(--color-bg-primary) 75%,
			transparent 100%
		);
		color: color-mix(in srgb, var(--color-fg-primary) 80%, transparent 20%);
		font-size: 6cqw;
		line-height: 1;
	}
	.error-heading-code {
		font-size: 18cqw;
		font-weight: bold;
	}
	.error-heading-image {
		grid-area: image;
		display: flex;
		> img {
			aspect-ratio: 1;
			width: 100%;
			height: auto;
			scale: 1.2;
		}
	}
	.error-description {
		margin-top: 1rem;
		font-size: 0.9rem;
	}
	.error-back-to-home a {
		color: var(--color-link);
		font-size: 0.9rem;
	}
</style>
