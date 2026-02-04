<script lang="ts">
	import { onMount } from 'svelte';
	import type { IconProp } from '@fortawesome/fontawesome-svg-core';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { createHeadroomScroll } from '$lib/utils/navigation';

	interface FloatNavigationProps {
		items: { action: () => void; label: string; icon: IconProp; highlight?: boolean }[];
	}
	let { items }: FloatNavigationProps = $props();
	let floatNavigationElement: HTMLUListElement;

	onMount(() => {
		const handleScroll = createHeadroomScroll(floatNavigationElement);
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<ul bind:this={floatNavigationElement} class="float-navigation" data-pinned="true">
	{#each items as item, index (index)}
		<li>
			<button onclick={item.action} aria-label={item.label} data-highlight={!!item.highlight}>
				<FontAwesomeIcon icon={item.icon} />
			</button>
		</li>
	{/each}
</ul>

<style>
	.float-navigation {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: absolute;
		bottom: 100%;
		right: 0;
		padding: 0.5rem 0.75rem;
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
		&:not([data-pinned='true']) {
			transform: translateX(8px);
			opacity: 0;
			pointer-events: none;
		}

		> li > button {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 48px;
			height: 48px;
			background-color: rgba(96, 96, 96, 0.75);
			border: 0;
			border-radius: 999px;
			color: var(--color-fg-reverse);
			font-size: 1.2rem;
			mix-blend-mode: multiply;
			transition: background-color 0.2s ease-in-out;
			&[data-highlight='true'] {
				background-color: var(--color-bg-tertiary);
				color: var(--color-fg-reverse);
			}
		}
	}
</style>
