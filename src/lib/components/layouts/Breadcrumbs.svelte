<script lang="ts">
	import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	interface BreadcrumbsItem {
		label: string;
		href?: string;
	}

	let { items }: { items: BreadcrumbsItem[] } = $props();
</script>

<nav aria-label="パンくずナビゲーション">
	<ol class="breadcrumbs">
		{#each items as item, index}
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
	}
	.breadcrumbs-link {
	}
	.breadcrumbs-current {
	}
	separator-icon {
	}
</style>
