<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages';

	let { open = $bindable(false), children = null } = $props();
	let dialog: HTMLDialogElement | null = null;

	$effect(() => {
		if (open && dialog && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog && dialog.open) {
			dialog.close();
		}
	});
</script>

<dialog class="modal" bind:this={dialog} onclose={() => (open = false)}>
	{@render children?.()}
	<button class="modal-close" onclick={() => (open = false)}>
		<close-icon>
			<FontAwesomeIcon icon={faXmark} />
		</close-icon>
		{m['component.modal.close']()}
	</button>
</dialog>

<style>
	.modal {
		overflow-y: auto;
		width: 100%;
		max-width: var(--container-max-width);
		height: 100%;
		padding-bottom: calc(40px + 2rem);
		box-sizing: border-box;
		background-color: var(--color-bg-secondary);
		scale: 1;
		opacity: 1;
		transition: all 0.2s ease-in-out;
		transition-behavior: allow-discrete;
		@starting-style {
			& {
				opacity: 0;
				scale: 0.9;
			}
		}
		&:not([open]) {
			opacity: 0;
			scale: 0.9;
		}
		&::backdrop {
			background-color: unset;
		}
	}
	.modal-close {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		position: absolute;
		bottom: 1rem;
		right: 50%;
		transform: translateX(50%);
		width: 100%;
		max-width: 320px;
		height: 40px;
		background-color: var(--color-bg-secondary);
		border: none;
		border-radius: 999px;
		color: var(--color-fg-primary);
		font-size: 1rem;
		line-height: 1;
		mix-blend-mode: multiply;
		> close-icon {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
