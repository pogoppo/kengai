<script lang="ts">
	import { page } from '$app/state';
	import { modalState } from '$lib/stores/modal.svelte';
	import GlobalHeader from '$lib/components/layouts/GlobalHeader.svelte';
	import GlobalNavigation from '$lib/components/layouts/GlobalNavigation.svelte';
	import Modal from '$lib/components/layouts/Modal.svelte';

	let { children } = $props();
	let isArticlePage = $derived(/article\/[^/]+\/[^/]+$/.test(page.url.pathname));
</script>

<GlobalHeader />
{@render children()}
<GlobalNavigation {isArticlePage} />
<Modal bind:open={modalState.isOpen}>
	{@render modalState.content?.()}
</Modal>
