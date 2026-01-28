<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import { createSearchURL } from '$lib/utils/search';
	import { modalState } from '$lib/stores/modal.svelte';
	import SearchBar from '$lib/components/contents/SearchBar.svelte';

	function handleSearch(query: string) {
		const uri = createSearchURL(query);
		if (!uri.searchParams.get('q')) return;
		modalState.close();
		goto(uri);
	}
</script>

<div class="modal-search">
	<picture class="modal-search-image">
		<img src="/images/app/mog-modal-search.webp" alt="" />
	</picture>
	<p class="modal-search-description">{m['component.modal.search.description']()}</p>
	<div class="modal-search-bar">
		<SearchBar onSearch={handleSearch} placeholder={m['search.placeholder']()} focused={true} />
	</div>
</div>

<style>
	.modal-search {
		display: grid;
		align-content: center;
		justify-items: center;
		width: 100%;
		height: 100%;
		padding: 1rem;
		box-sizing: border-box;
	}
	.modal-search-bar {
		width: 100%;
		max-width: 400px;
		margin-top: 1rem;
	}
	.modal-search-image {
		> img {
			display: block;
			width: 100%;
			max-width: 280px;
			height: auto;
		}
	}
	.modal-search-description {
		font-size: 1rem;
	}
</style>
