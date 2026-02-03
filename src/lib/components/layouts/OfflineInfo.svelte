<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCheck, faExclamationTriangle, faGear } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages';
	import ButtonBasic from '$lib/components/contents/ButtonBasic.svelte';

	type ServiceWorkerState =
		| 'prepare' // ちらつき防止用の初期状態
		| 'not-installed' // Service Workerが登録されていない
		| 'installing' // インストール中
		| 'installed' // インストール済み（アクティブ）
		| 'waiting' // 新しいバージョンが待機中
		| 'error'; // エラー発生

	let swState = $state<ServiceWorkerState>('prepare');
	let isOnline = $state<boolean | undefined>(undefined);

	// Service Workerの状態を更新
	function updateServiceWorkerState(registration?: ServiceWorkerRegistration) {
		switch (true) {
			case !registration:
				swState = 'not-installed';
				return;
			case !!registration?.installing:
				swState = 'installing';
				return;
			case !!registration?.waiting:
				swState = 'waiting';
				return;
			case !!registration?.active:
				swState = 'installed';
				return;
		}
	}

	const handleClickInstall = () => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/service-worker.js', {
					type: dev ? 'module' : 'classic'
				})
				.then(() => {
					handleStateChange();
				})
				.catch((error) => {
					console.error('Service Worker registration failed:', error);
					swState = 'error';
				});
		}
	};

	let currentWorker: ServiceWorker | null = null;
	const handleStateChange = async () => {
		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.getRegistration();
			updateServiceWorkerState(registration);
			currentWorker?.removeEventListener('statechange', handleStateChange);
			currentWorker =
				registration?.installing || registration?.waiting || registration?.active || null;
			currentWorker?.addEventListener('statechange', handleStateChange);
		}
	};

	onMount(() => {
		// Service Workerの登録を取得
		if ('serviceWorker' in navigator) {
			handleStateChange();
		}

		// オンライン/オフライン状態の監視
		isOnline = navigator.onLine;
		const handleOnline = () => {
			isOnline = true;
		};
		const handleOffline = () => {
			isOnline = false;
		};
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
			currentWorker?.removeEventListener('statechange', handleStateChange);
		};
	});
</script>

<aside class="offline-info">
	{#if swState === 'not-installed'}
		{#if isOnline === true}
			<effect-wrapper class="offline-info-button-effect">
				<ButtonBasic onclick={handleClickInstall}>
					<span class="offline-info-button">{m['component.offline-info.install']()}</span>
				</ButtonBasic>
			</effect-wrapper>
		{:else if isOnline === false}
			<p class="offline-info-message" data-state="not-installed">
				<message-icon>
					<FontAwesomeIcon icon={faExclamationTriangle} />
				</message-icon>
				{m['component.offline-info.not-installed']()}
			</p>
		{/if}
	{:else if swState === 'installing'}
		<p class="offline-info-message" data-state="installing">
			<message-icon>
				<FontAwesomeIcon icon={faGear} />
			</message-icon>
			{m['component.offline-info.installing']()}
		</p>
	{:else if swState === 'waiting'}
		<p class="offline-info-message" data-state="waiting">
			{m['component.offline-info.waiting']()}
		</p>
	{:else if swState === 'installed'}
		{#if isOnline === true}
			<p class="offline-info-message" data-state="installed">
				<message-icon>
					<FontAwesomeIcon icon={faCheck} />
				</message-icon>
				{m['component.offline-info.installed']()}
			</p>
		{:else if isOnline === false}
			<p class="offline-info-message" data-state="offline">
				<message-icon>
					<FontAwesomeIcon icon={faCheck} />
				</message-icon>
				{m['component.offline-info.offline']()}
			</p>
		{/if}
	{:else if swState === 'error'}
		<p class="offline-info-message" data-state="error">
			{m['component.offline-info.error']()}
		</p>
	{/if}
</aside>

<style>
	.offline-info {
		transition: opacity 0.3s ease;
		&:empty {
			opacity: 0;
		}
	}
	.offline-info-message {
		font-size: 0.9rem;
		&[data-state='installed'],
		&[data-state='offline'] {
			opacity: 0.75;
		}
		&[data-state='installing'] {
			message-icon {
				animation: spin 2s linear infinite;
			}
		}
		&[data-state='not-installed'] {
			font-size: 0.8rem;
		}
		message-icon {
			display: inline-block;
			scale: 1.1;
		}
	}
	.offline-info-button {
		font-size: 0.9rem;
	}
	.offline-info-button-effect {
		display: inline-block;
		border-radius: 0.25rem;
		outline-width: 0;
		outline-offset: 0;
		outline-color: transparent;
		outline-style: solid;
		box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
		animation: animateOutline 2s ease infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes animateOutline {
		0% {
			outline-width: 1px;
			outline-offset: 0;
			outline-color: color-mix(in srgb, var(--color-accent-primary) 0%, transparent);
		}

		10% {
			outline-color: color-mix(in srgb, var(--color-accent-primary) 90%, transparent);
		}
		50% {
			outline-width: 5px;
			outline-offset: 3px;
			outline-color: color-mix(in srgb, var(--color-accent-primary) 0%, transparent);
		}

		100% {
			outline-width: 5px;
			outline-offset: 3px;
			outline-color: color-mix(in srgb, var(--color-accent-primary) 0%, transparent);
		}
	}
</style>
