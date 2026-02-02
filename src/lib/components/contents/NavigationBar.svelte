<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import type { IconProp } from '@fortawesome/fontawesome-svg-core';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	interface NavigationBarProps {
		items: { href: Pathname; label: string; icon: IconProp; active: boolean }[];
	}
	let { items }: NavigationBarProps = $props();
</script>

<ul class="navigation-bar">
	{#each items as item (item.href)}
		<li>
			<a href={resolve(item.href)} data-active={item.active}>
				<nav-icon>
					<FontAwesomeIcon icon={item.icon} />
				</nav-icon>
				{item.label}
			</a>
		</li>
	{/each}
</ul>

<style>
	.navigation-bar {
		display: flex;
		overflow: hidden;
		width: fit-content;
		margin-inline: auto;
		background-color: var(--color-bg-reverse);
		border-radius: 999px;
		> li > a {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			height: 40px;
			padding: 1rem 0.75rem;
			color: var(--color-fg-reverse);
			font-size: 0.8rem;
			font-weight: 900;
			&[data-active='true'] {
				background-color: var(--color-bg-tertiary);
				pointer-events: none;
			}
		}
		> li:first-child > a {
			padding-left: 1.25rem;
		}
		> li:last-child > a {
			padding-right: 1.25rem;
		}
		nav-icon {
			opacity: 0.75;
			scale: 1.15;
		}
	}
</style>
