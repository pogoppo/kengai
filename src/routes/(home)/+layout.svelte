<script lang="ts">
	import { modalState } from '$lib/stores/modal.svelte';
	import GlobalHeader from '$lib/components/layouts/GlobalHeader.svelte';
	import GlobalNavigation from '$lib/components/layouts/GlobalNavigation.svelte';
	import Modal from '$lib/components/layouts/Modal.svelte';

	let { children } = $props();
</script>

<GlobalHeader isHome={true} />
{@render children()}
<GlobalNavigation />
<Modal bind:open={modalState.isOpen}>
	{@render modalState.content?.()}
</Modal>
