import { browser } from '$app/environment';

export function backToTop(): void {
	if (browser) {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}

// ラバーバンドスクロールでは scrollY が0未満や最大値を超えるため丸める
function getScrollY() {
	const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
	return Math.min(Math.max(window.scrollY, 0), maxScrollY);
}

export function createHeadroomScroll(
	target: HTMLElement,
	showAt: number = 80,
	threshold: number = 4
) {
	let lastScrollY = getScrollY();
	let ticking = false;
	target.dataset.pinned = 'true';

	function update() {
		ticking = false;
		const currentScrollY = getScrollY();
		const delta = currentScrollY - lastScrollY;
		const isAtTop = currentScrollY <= showAt;
		const isScrollingDown = delta > 0;

		if (Math.abs(delta) < threshold) {
			// 微小な変化は無視する
			return;
		}

		if (isAtTop) {
			// ページ上部では常に表示
			target.dataset.pinned = 'true';
		} else if (isScrollingDown) {
			// 下スクロールで非表示
			target.dataset.pinned = 'false';
		} else {
			// 上スクロールで表示
			target.dataset.pinned = 'true';
		}
		lastScrollY = currentScrollY;
	}

	return () => {
		if (!ticking) {
			window.requestAnimationFrame(update);
			ticking = true;
		}
	};
}
