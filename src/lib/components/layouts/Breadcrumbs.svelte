<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	interface BreadcrumbsItem {
		label: string;
		href?: string;
	}

	let { items }: { items: BreadcrumbsItem[] } = $props();

	const breadcrumbsItems = $derived([{ label: m['app.name'](), href: '/' }, ...items]);
</script>

<nav aria-label="パンくずナビゲーション">
	<ol class="breadcrumbs">
		{#each breadcrumbsItems as item, index}
			<li>
				{#if index > 0}
					<separator-icon>
						<FontAwesomeIcon icon={faChevronRight} />
					</separator-icon>
				{/if}
				{#if item.href}
					<a href={item.href} class="breadcrumbs-link">{item.label}</a>
				{:else}
					<span class="breadcrumbs-current">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	.breadcrumbs {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		overflow-x: auto;
		padding: 0.5rem 1rem;
		background-color: var(--color-bg-reverse);
		color: var(--color-fg-reverse);
		font-size: 0.8rem;
		white-space: nowrap;
		> li {
			display: flex;
			align-items: center;
		}
	}
	.breadcrumbs-link {
		font-weight: 400;
	}
	.breadcrumbs-current {
		font-weight: 700;
	}
	separator-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		opacity: 0.5;
		margin-bottom: -0.1lh;
	}
</style>
