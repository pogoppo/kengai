import { browser } from '$app/environment';

export function backToTop(): void {
	if (browser) {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}

export function createHeadroomScroll(target: HTMLElement, showAt: number = 80) {
	let lastScrollY = window.scrollY;
	let ticking = false;
	target.dataset.pinned = 'true';

	function update() {
		const currentScrollY = window.scrollY;
		if (currentScrollY <= showAt) {
			// ページ上部では常に表示
			target.dataset.pinned = 'true';
		} else if (currentScrollY > lastScrollY) {
			// 下スクロールで非表示
			target.dataset.pinned = 'false';
		} else if (currentScrollY < lastScrollY) {
			// 上スクロールで表示
			target.dataset.pinned = 'true';
		}
		lastScrollY = currentScrollY;
		ticking = false;
	}

	return () => {
		if (!ticking) {
			window.requestAnimationFrame(update);
			ticking = true;
		}
	};
}
