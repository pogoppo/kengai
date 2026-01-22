<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
	import { m } from '$lib/paraglide/messages.js';
	import GlobalHeader from '$lib/components/layouts/GlobalHeader.svelte';
</script>

<svelte:head>
	<title>{m['app.name']()} - 404 Not Found</title>
</svelte:head>

<div class="float-header">
	<GlobalHeader />
</div>
<main class="error">
	<h1>404 Not Found</h1>
	<p>お探しのページは見つかりませんでした。</p>
	<p>
		<a href="/">
			ホームに戻る<FontAwesomeIcon icon={faCircleChevronRight} />
		</a>
	</p>
</main>

<style>
	:root:has(main.error) {
		--scroll-free-play: 0px;
	}
	.float-header {
		position: absolute;
		z-index: 2;
		width: 100%;
	}
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		position: absolute;
		width: 100%;
		height: 100lvh;
		h1 {
			font-size: 1.5rem;
		}
		p {
			font-size: 0.9rem;
		}
		a {
			color: var(--color-link);
		}
	}
</style>
