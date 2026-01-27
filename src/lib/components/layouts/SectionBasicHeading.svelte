<script lang="ts">
	import type { Snippet } from 'svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	interface SectionBasicHeadingProps {
		level: 1 | 2 | 3 | 4 | 5 | 6;
		icon: any;
		children: Snippet;
	}
	let { level, icon, children }: SectionBasicHeadingProps = $props();
</script>

<svelte:element this={`h${level}`} class="section-basic-heading">
	<heading-icon>
		<FontAwesomeIcon {icon} />
	</heading-icon>
	{@render children()}
</svelte:element>

<style>
	.section-basic-heading {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		font-weight: 700;
	}
	heading-icon {
		display: flex;
		font-size: 1.5rem;
	}
</style>
