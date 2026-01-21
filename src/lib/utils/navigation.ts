import { browser } from '$app/environment';

export function backToTop(): void {
  if (browser) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
