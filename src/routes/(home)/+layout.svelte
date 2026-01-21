<script lang="ts">
	import GlobalHeader from '$lib/components/layouts/GlobalHeader.svelte';
	import GlobalNavigation from '$lib/components/layouts/GlobalNavigation.svelte';

	let { children } = $props();
</script>

<GlobalHeader />
{@render children()}
<GlobalNavigation />
