<script lang="ts">
	import type { Snippet } from 'svelte';
	interface SectionBasicProps {
		color?: string;
		continuously?: boolean;
		children: Snippet;
	}
	let { children, color = 'transparent', continuously = false }: SectionBasicProps = $props();
</script>

<section
	class="section-basic"
	style="--local-background-color: {color}"
	data-continuously={continuously}
	data-testid="section-basic"
>
	{@render children()}
</section>

<style>
	.section-basic {
		display: flow-root;
		padding-block: var(--local-padding-block, 1rem);
		padding-inline: var(--local-padding-inline, 1rem);
		background-color: var(--local-background-color, transparent);

		/* 同色の連続したセクションの余白を調整 */
		&[data-continuously='true'] {
			padding-top: 0;
		}
	}
</style>
