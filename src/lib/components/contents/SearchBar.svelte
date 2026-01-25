<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages';

	let {
		onSearch,
		placeholder
	}: {
		onSearch: (query: string) => void | Promise<void>;
		placeholder?: string;
	} = $props();

	let searchQuery = $state('');

	function handleSearch() {
		onSearch(searchQuery);
	}
</script>

<div class="search">
	<input
		type="search"
		class="search-input"
		{placeholder}
		bind:value={searchQuery}
		onkeydown={(e) => e.key === 'Enter' && handleSearch()}
	/>
	<button
		class="search-button"
		onclick={handleSearch}
		aria-label={m['component.search-bar.button.aria-label']()}
	>
		<FontAwesomeIcon icon={faMagnifyingGlass} />
	</button>
</div>

<style>
	.search {
		display: flex;
		align-items: center;
		gap: 8px;
		position: relative;
		overflow: hidden;
		padding: 10px 48px 10px 20px;
		background-color: var(--color-bg-primary);
		border-radius: 999px;
	}
	.search-input {
		flex: 1;
		padding-bottom: 4px;
		border: unset;
		border-bottom: 1px solid var(--color-bg-secondary);
		font-size: 0.9rem;
		font-weight: 700;
		outline: none;
		&::placeholder {
			color: var(--color-fg-primary);
			opacity: 0.5;
		}
		&:focus {
			outline: 1px solid var(--color-accent-primary);
		}
	}

	.search-button {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);
		width: 32px;
		height: 32px;
		background-color: var(--color-bg-tertiary);
		border-radius: 999px;
		color: var(--color-fg-reverse);
		font-size: 1rem;
		cursor: pointer;
	}
</style>
