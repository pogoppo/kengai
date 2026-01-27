<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { IconProp } from '@fortawesome/fontawesome-svg-core';

	interface ChipProps {
		href: string;
		label: string;
		icon?: IconProp;
	}

	let { href, label, icon }: ChipProps = $props();
</script>

<a class="chip" {href}>
	{#if icon}
		<chip-icon>
			<FontAwesomeIcon {icon} />
		</chip-icon>
	{/if}
	<span class="label">{label}</span>
</a>

<style>
	.chip {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 0.75rem;
		background-color: var(--color-bg-primary);
		border-radius: 0.5rem;
		color: var(--color-link);
		font-size: 1rem;
		font-weight: 700;
	}

	chip-icon {
		color: var(--color-fg-primary);
	}

	.label {
		white-space: nowrap;
	}
</style>
