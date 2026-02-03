import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OfflinePage extends BasePage {
	readonly offlineInfo: Locator;
	readonly installButton: Locator;
	readonly offlineMessage: Locator;

	constructor(page: Page) {
		super(page);
		this.offlineInfo = page.locator('.offline-info');
		this.installButton = page.getByRole('button', { name: /オフライン利用を開始/ });
		this.offlineMessage = page.locator('.offline-info-message');
	}

	/**
	 * Service Workerをインストールする
	 */
	async installServiceWorker() {
		await this.installButton.click();
		// インストールが完了するまで待機
		await this.page.waitForFunction(() => {
			return navigator.serviceWorker.controller !== null;
		});
	}

	/**
	 * オフラインモードに切り替える
	 */
	async goOffline() {
		await this.page.context().setOffline(true);
		// オフラインイベントが発火するまで少し待機
		await this.page.waitForTimeout(100);
	}

	/**
	 * オンラインモードに切り替える
	 */
	async goOnline() {
		await this.page.context().setOffline(false);
		// オンラインイベントが発火するまで少し待機
		await this.page.waitForTimeout(100);
	}

	/**
	 * Service Workerが登録されているか確認
	 */
	async isServiceWorkerRegistered(): Promise<boolean> {
		return await this.page.evaluate(async () => {
			const registration = await navigator.serviceWorker.getRegistration();
			return registration !== undefined;
		});
	}

	/**
	 * Service Workerがアクティブか確認
	 */
	async isServiceWorkerActive(): Promise<boolean> {
		return await this.page.evaluate(async () => {
			const registration = await navigator.serviceWorker.getRegistration();
			return registration?.active !== null && registration?.active !== undefined;
		});
	}

	/**
	 * キャッシュが存在するか確認
	 */
	async hasCachedFiles(): Promise<boolean> {
		return await this.page.evaluate(async () => {
			const cacheNames = await caches.keys();
			if (cacheNames.length === 0) return false;

			const cache = await caches.open(cacheNames[0]);
			const keys = await cache.keys();
			return keys.length > 0;
		});
	}

	/**
	 * 特定のURLがキャッシュされているか確認
	 */
	async isCached(url: string): Promise<boolean> {
		return await this.page.evaluate(async (url) => {
			const cacheNames = await caches.keys();
			for (const cacheName of cacheNames) {
				const cache = await caches.open(cacheName);
				const response = await cache.match(url);
				if (response) return true;
			}
			return false;
		}, url);
	}

	/**
	 * すべてのService Workerとキャッシュをクリア
	 */
	async clearServiceWorkerAndCache() {
		try {
			await this.page.evaluate(async () => {
				// Service Worker登録解除
				const registrations = await navigator.serviceWorker.getRegistrations();
				await Promise.all(registrations.map((r) => r.unregister()));

				// キャッシュクリア
				const cacheNames = await caches.keys();
				await Promise.all(cacheNames.map((name) => caches.delete(name)));
			});
		} catch (error) {
			// Service Worker登録解除時にコンテキストが破壊される場合があるが、
			// これは期待される動作なのでエラーを無視
			// エラーメッセージに "Execution context was destroyed" が含まれる場合は無視
			if (error instanceof Error && !error.message.includes('Execution context was destroyed')) {
				throw error;
			}
		}
	}
}
