<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	interface LinkCardProps {
		href: Pathname;
		label: string;
		description: string;
		image?: string;
	}
	let { href, label, description, image }: LinkCardProps = $props();
</script>

<a class="link-card" href={resolve(href)}>
	{#if image}
		<picture class="card-image">
			<img src={image} alt={label} />
		</picture>
	{/if}
	<h3 class="card-label">{label}</h3>
	<p class="card-description">{description}</p>
</a>

<style>
	.link-card {
		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: auto auto 1fr;
		height: 100%;
		padding: 0.75rem;
		background-color: var(--color-bg-primary);
		border-radius: 0.5rem;
	}
	.card-image {
		display: flex;
		aspect-ratio: 2 / 1;
		margin-bottom: 0.5rem;
		> img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}
	.card-label {
		margin-bottom: 2px;
		color: var(--color-link);
		font-size: 1rem;
		font-weight: 700;
	}
	.card-description {
		font-size: 0.8rem;
	}
</style>
