<script lang="ts">
	import type { IconProp } from '@fortawesome/fontawesome-svg-core';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	interface FloatNavigationProps {
		items: { action: () => void; label: string; icon: IconProp }[];
	}
	let { items }: FloatNavigationProps = $props();
</script>

<ul class="float-navigation">
	{#each items as item}
		<li>
			<button onclick={item.action} aria-label={item.label}>
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
			font-size: 1.2rem;

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
