<script lang="ts">
	import type { Snippet } from 'svelte';

	interface DashedBorderBoxProps {
		children: Snippet;
	}
	let { children }: DashedBorderBoxProps = $props();
</script>

<div class="dashed-border-box">
	{@render children()}
</div>

<style>
	.dashed-border-box {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 3 / 1;
		padding-inline: 1rem;
		background-color: color-mix(in srgb, var(--color-bg-primary) 50%, transparent 50%);
		border: 1px dashed var(--color-bg-reverse);
		border-radius: 0.5rem;
		text-align: center;
	}
</style>
