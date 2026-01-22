<script lang="ts">
	import type { Snippet } from 'svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	let { icon, children }: { icon: FontAwesomeIcon['icon']; children: Snippet } = $props();
</script>

<h2 class="section-basic-heading">
	<heading-icon>
		<FontAwesomeIcon {icon} />
	</heading-icon>
	{@render children()}
</h2>

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
