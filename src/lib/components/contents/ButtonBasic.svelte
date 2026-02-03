<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconProp } from '@fortawesome/fontawesome-svg-core';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	interface ButtonBasicProps {
		children: Snippet;
		as?: 'button' | 'a';
		variant?: 'primary' | 'accent' | 'danger';
		icon?: IconProp;
		rounded?: boolean;
		[key: string]: unknown;
	}
	let {
		children,
		as = 'button',
		variant = 'primary',
		icon,
		rounded = false,
		...restProps
	}: ButtonBasicProps = $props();

	// classの指定を許さないようにする
	if (restProps.class) {
		delete restProps.class;
		console.warn('ButtonBasic does not accept "class" prop.');
	}
</script>

<svelte:element
	this={as}
	class="button-basic"
	data-variant={variant}
	data-rounded={rounded}
	{...restProps}
>
	{#if icon}
		<FontAwesomeIcon {icon} />
	{/if}
	{@render children()}
</svelte:element>

<style>
	.button-basic {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		padding: 0.5rem 0.75rem;
		border: unset;
		border-radius: 0.25rem;
		font-size: var(--local-font-size, 0.9rem);
		line-height: 1;
		transition: opacity 0.2s ease-in-out;
		cursor: pointer;
		&:disabled {
			cursor: not-allowed;
			opacity: 0.33;
		}
		&[data-variant='primary'] {
			background-color: var(--color-bg-reverse);
			color: var(--color-fg-reverse);
		}
		&[data-variant='accent'] {
			background-color: var(--color-primary);
			color: var(--color-fg-reverse);
		}
		&[data-variant='danger'] {
			background-color: var(--color-danger);
			color: var(--color-fg-reverse);
		}
		&[data-rounded='true'] {
			padding: 0.5rem 1rem;
			border-radius: 999px;
		}
	}
</style>
