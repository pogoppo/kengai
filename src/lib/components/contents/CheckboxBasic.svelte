<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCheck } from '@fortawesome/free-solid-svg-icons';

	let {
		checked = $bindable(false),
		disabled = false,
		name,
		value,
		ariaLabel,
		ariaLabelledby,
		ariaDescribedby,
		onchange
	}: {
		checked?: boolean;
		disabled?: boolean;
		name?: string;
		value?: string;
		ariaLabel?: string;
		ariaLabelledby?: string;
		ariaDescribedby?: string;
		onchange?: (event: Event) => void;
	} = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			checked = !checked;
		}
	}
</script>

<label class="checkbox-basic" data-disabled={disabled}>
	<input
		type="checkbox"
		bind:checked
		{disabled}
		{name}
		{value}
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		aria-describedby={ariaDescribedby}
		onkeydown={handleKeydown}
		{onchange}
	/>
	<checkbox-visual role="presentation" aria-hidden="true" data-checked={checked}>
		<check-icon>
			<FontAwesomeIcon icon={faCheck} />
		</check-icon>
	</checkbox-visual>
</label>

<style>
	.checkbox-basic {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.2em;
		height: 1.2em;
		cursor: pointer;
		&[data-disabled='true'] {
			cursor: not-allowed;
			opacity: 0.5;
		}

		> input[type='checkbox'] {
			pointer-events: none;
			position: absolute;
			opacity: 0;
			&:focus-visible + checkbox-visual {
				outline: 2px solid var(--color-accent-primary);
				outline-offset: 2px;
			}
		}
	}
	checkbox-visual {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 100%;
		height: 100%;
		background-color: var(--color-bg-primary);
		border: 2px solid color-mix(in srgb, var(--color-bg-reverse) 75%, transparent);
		border-radius: 0.25rem;
		&[data-checked='true'] {
			border-color: var(--color-primary);
		}

		> check-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			left: 40%;
			bottom: 20%;
			color: var(--color-primary);
			font-weight: 900;
			opacity: 0;
			scale: 1.5;
			transition: all 0.1s ease-in-out;
			filter: drop-shadow(1px 1px 0 var(--color-bg-primary))
				drop-shadow(-1px -1px 0 var(--color-bg-primary));
			[data-checked='true'] & {
				opacity: 1;
				scale: 1.8;
			}
		}
	}
</style>
