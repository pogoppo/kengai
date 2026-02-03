import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import OfflineInfo from './OfflineInfo.svelte';

describe('OfflineInfo', () => {
	// Service Workerのモック作成用ヘルパー
	const createMockServiceWorker = (): ServiceWorker => {
		return {
			state: 'activated',
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			postMessage: vi.fn(),
			scriptURL: '',
			onstatechange: null,
			onerror: null,
			dispatchEvent: vi.fn()
		} as unknown as ServiceWorker;
	};

	const createMockRegistration = (
		options: {
			installing?: ServiceWorker | null;
			waiting?: ServiceWorker | null;
			active?: ServiceWorker | null;
		} = {}
	): ServiceWorkerRegistration => {
		return {
			installing: options.installing ?? null,
			waiting: options.waiting ?? null,
			active: options.active ?? null,
			scope: '',
			updateViaCache: 'imports',
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
			onupdatefound: null,
			update: vi.fn(),
			unregister: vi.fn()
		} as unknown as ServiceWorkerRegistration;
	};

	beforeEach(() => {
		// navigator.onLineをオンラインに設定
		vi.stubGlobal('navigator', {
			onLine: true,
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(null),
				register: vi.fn().mockResolvedValue(createMockRegistration())
			}
		});

		// window.addEventListenerのモック
		vi.spyOn(window, 'addEventListener');
		vi.spyOn(window, 'removeEventListener');

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test('Service Workerが未インストール、かつオンライン時にインストールボタンが表示される', async () => {
		vi.stubGlobal('navigator', {
			onLine: true,
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(null)
			}
		});

		render(OfflineInfo);

		const installButton = page.getByRole('button', { name: /オフライン利用を開始/ });
		await expect.element(installButton).toBeInTheDocument();
	});

	test('Service Workerが未インストール、かつオフライン時に警告メッセージが表示される', async () => {
		vi.stubGlobal('navigator', {
			onLine: false,
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(null)
			}
		});

		render(OfflineInfo);

		const message = page.getByText('オンラインでの設定が必要');
		await expect.element(message).toBeInTheDocument();
	});

	test('Service Workerがインストール中の時にインストール中メッセージが表示される', async () => {
		const installingWorker = createMockServiceWorker();
		const registration = createMockRegistration({
			installing: installingWorker,
			waiting: null,
			active: null
		});

		vi.stubGlobal('navigator', {
			onLine: true,
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(registration)
			}
		});

		render(OfflineInfo);

		const message = page.getByText('設定中');
		await expect.element(message).toBeInTheDocument();
	});

	test('Service Workerが待機中の時に待機中メッセージが表示される', async () => {
		const waitingWorker = createMockServiceWorker();
		const registration = createMockRegistration({
			installing: null,
			waiting: waitingWorker,
			active: null
		});

		vi.stubGlobal('navigator', {
			onLine: true,
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(registration)
			}
		});

		render(OfflineInfo);

		const message = page.getByText('更新が利用可能');
		await expect.element(message).toBeInTheDocument();
	});

	test('Service Workerがインストール済み、かつオンライン時にインストール済みメッセージが表示される', async () => {
		const activeWorker = createMockServiceWorker();
		const registration = createMockRegistration({
			installing: null,
			waiting: null,
			active: activeWorker
		});

		vi.stubGlobal('navigator', {
			onLine: true,
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(registration)
			}
		});

		render(OfflineInfo);

		const message = page.getByText('オフライン利用が有効');
		await expect.element(message).toBeInTheDocument();
	});

	test('Service Workerがインストール済み、かつオフライン時にオフラインメッセージが表示される', async () => {
		const activeWorker = createMockServiceWorker();
		const registration = createMockRegistration({
			installing: null,
			waiting: null,
			active: activeWorker
		});

		vi.stubGlobal('navigator', {
			onLine: false,
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(registration)
			}
		});

		render(OfflineInfo);

		const message = page.getByText('オフラインで利用中');
		await expect.element(message).toBeInTheDocument();
	});

	test('onlineイベントとofflineイベントのリスナーが登録される', async () => {
		vi.stubGlobal('navigator', {
			onLine: true,
			serviceWorker: {
				getRegistration: vi.fn().mockResolvedValue(null)
			}
		});

		render(OfflineInfo);

		expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
		expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
	});

	test('Service Workerが利用できない環境では何も表示されない', async () => {
		vi.stubGlobal('navigator', {
			onLine: true
			// serviceWorkerプロパティを省略
		});

		const { container } = render(OfflineInfo);

		// asideタグは存在するが中身が空
		const aside = container.querySelector('.offline-info');
		expect(aside?.textContent?.trim()).toBe('');
	});
});
