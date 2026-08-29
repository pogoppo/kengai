<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface PopoverProps {
		open?: boolean;
		message: string;
		children: Snippet;
	}
	let { open = false, message = '', children }: PopoverProps = $props();

	// anchor-nameはページ内で一意である必要があるためインスタンスごとに生成する
	const uid = $props.id();
	const anchorName = `--popover-${uid.replace(/[^a-zA-Z0-9_-]/g, '')}`;

	const flyParams = { y: -8, duration: 200, easing: cubicOut };
</script>

<popover-wrapper style="--popover-anchor-name: {anchorName}">
	{@render children()}
	{#if open}
		<opacity-effect>
			<popover-arrow transition:fly={flyParams}></popover-arrow>
			<popover-box role="tooltip" transition:fly={flyParams}>
				{message}
			</popover-box>
		</opacity-effect>
	{/if}
</popover-wrapper>

<style>
	popover-wrapper {
		display: inline-block;
		position: relative;
		anchor-name: var(--popover-anchor-name);

		--popover-gap: 0.5rem;
		--popover-arrow-size: 0.625rem;
	}

	opacity-effect {
		display: content;
		opacity: 0.9;
	}

	popover-box {
		display: block;
		position: absolute;
		z-index: 50;
		top: 100%;
		left: 50%;
		width: max-content;
		max-inline-size: min(16rem, calc(100vw - 2rem));
		margin-block-start: var(--popover-gap);
		padding: 0.5rem 0.75rem;
		background-color: var(--color-bg-primary);
		border-radius: 0.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		color: var(--color-fg-primary);
		font-size: 0.8rem;
		translate: -50% 0;
	}

	popover-arrow {
		display: block;
		position: absolute;
		z-index: 51;
		top: 100%;
		left: 50%;
		width: var(--popover-arrow-size);
		height: var(--popover-arrow-size);
		/* ボックスの上辺をまたぐように半分だけ持ち上げる */
		margin-block-start: calc(var(--popover-gap) - var(--popover-arrow-size) / 2);
		background-color: var(--color-bg-primary);
		translate: -50% 0;
		rotate: 45deg;
	}

	/* 画面端でのはみ出しはインライン方向にずらして回避する */
	@position-try --popover-shift-inline-start {
		position-area: block-end span-inline-start;
	}
	@position-try --popover-shift-inline-end {
		position-area: block-end span-inline-end;
	}

	@supports (position-try-fallbacks: flip-inline) {
		popover-box,
		popover-arrow {
			position: fixed;
			top: auto;
			left: auto;
			position-anchor: var(--popover-anchor-name);
			position-area: block-end;
			position-visibility: anchors-visible;
			translate: none;
		}
		popover-box {
			position-try-fallbacks: --popover-shift-inline-start, --popover-shift-inline-end;
		}
		/* ボックスがずれても矢印は基準要素の中央を指し続ける */
		popover-arrow {
			justify-self: anchor-center;
		}
	}
</style>
