<script lang="ts">
	import { faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	interface AccordionItem {
		id: string;
		summary: string;
		content: string;
	}
	interface Props {
		items: AccordionItem[];
	}
	let { items }: Props = $props();
</script>

<ul class="accordion-list">
	{#each items as item (item.id)}
		<li>
			<details id={item.id} class="accordion-item">
				<summary class="item-summary">
					<expand-icon aria-hidden="true">
						<FontAwesomeIcon icon={faPlusSquare} />
					</expand-icon>
					<collapse-icon aria-hidden="true">
						<FontAwesomeIcon icon={faMinusSquare} />
					</collapse-icon>
					{item.summary}
				</summary>
				<!-- サーバーサイドで作成された項目内容を表示するためignore -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<p class="item-content">{@html item.content}</p>
			</details>
		</li>
	{/each}
</ul>

<style>
	.accordion-list {
		padding: 0.75rem 1rem;
		background-color: var(--color-bg-primary);
		border-radius: 0.5rem;
		> li {
			&:not(:first-child) {
				margin-top: 0.75rem;
				padding-top: 0.5rem;
				border-top: 2px solid var(--color-bg-secondary);
			}
		}
	}
	.accordion-item {
		display: grid;
		gap: 2px;
		padding-left: 24px;
		scroll-margin-top: 1.5rem;
		&:target .item-summary {
			background-color: color-mix(in srgb, var(--color-accent-primary) 50%, transparent);
		}
		&::details-content {
			transition:
				height 0.3s,
				opacity 0.3s,
				content-visibility 0.3s allow-discrete;
			height: 0;
			opacity: 0;
			overflow: clip;
		}
		&[open]::details-content {
			height: auto;
			opacity: 1;
		}
		&[open] expand-icon,
		&:not([open]) collapse-icon {
			opacity: 0;
		}
	}
	.item-summary {
		position: relative;
		padding-left: 0.25rem;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;

		&::-webkit-details-marker {
			display: none;
		}
		> expand-icon,
		> collapse-icon {
			position: absolute;
			left: -28px;
			top: 0.1lh;
			color: var(--color-primary);
			font-size: 1.25rem;
			line-height: 1;
			transition: opacity 0.3s;
		}
		> collapse-icon {
			opacity: 0.5;
		}
	}
	.item-content {
		font-size: 0.8rem;
		:global(a) {
			color: var(--color-link);
			text-decoration: underline;
			text-decoration-style: dashed;
			text-underline-offset: 0.25em;
		}
		:global(button) {
			margin-top: 0.4rem;
			padding: 0.25rem 0.5rem;
			background-color: var(--color-link);
			border: none;
			border-radius: 0.25rem;
			color: var(--color-fg-reverse);
			font-size: 0.8rem;
			cursor: pointer;
		}
	}
</style>
