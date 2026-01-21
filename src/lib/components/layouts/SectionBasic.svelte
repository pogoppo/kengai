<script lang="ts">
	let { children, color = 'transparent', continuously = false } = $props();
</script>

<section
	class="section-basic"
	style="--local-background-color: {color}"
	data-continuously={continuously}
>
	{@render children()}
</section>

<style>
	.section-basic {
		padding-block: var(--local-padding-block, 1rem);
		padding-inline: var(--local-padding-inline, 1rem);
		background-color: var(--local-background-color, transparent);

		/* 同色の連続したセクションの余白を調整 */
		&[data-continuously='true'] {
			padding-top: 0;
		}
	}
</style>
