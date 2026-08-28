<script lang="ts">
	import { scale } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages';
	import { toastState } from '$lib/stores/toast.svelte';
</script>

<aside class="toast-group" aria-live="polite">
	{#each toastState.toasts as toast (toast.id)}
		<toast-item transition:scale={{ duration: 200, start: 0.9, easing: cubicInOut }}>
			<toast-message>{toast.message}</toast-message>
			<button
				class="toast-close"
				onclick={() => toastState.dismiss(toast.id)}
				aria-label={m['component.toast.close']()}
			>
				<FontAwesomeIcon icon={faXmark} />
			</button>
		</toast-item>
	{/each}
</aside>

<style>
	.toast-group {
		pointer-events: none;
		display: grid;
		gap: 0.5rem;
		position: fixed;
		z-index: 999;
		top: 1rem;
		left: 50%;
		width: 100%;
		max-width: var(--container-max-width);
		padding-inline: 1rem;
		box-sizing: border-box;
		transform: translateX(-50%);
	}
	toast-item {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background-color: color-mix(in srgb, var(--color-bg-reverse) 80%, var(--color-bg-tertiary));
		border-radius: 0.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		color: var(--color-fg-reverse);
	}
	toast-message {
		flex: 1;
		font-size: 0.9rem;
	}
	.toast-close {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		background: none;
		border: none;
		color: inherit;
		font-size: 1rem;
		line-height: 1;
	}
</style>
