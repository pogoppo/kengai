import { dev } from '$app/environment';

export const REGISTRATION_FILE = '/service-worker.js';

export const register = async () => {
	if ('serviceWorker' in navigator) {
		await navigator.serviceWorker.register(REGISTRATION_FILE, {
			type: dev ? 'module' : 'classic'
		});
	}
};

export const unregister = async () => {
	if ('serviceWorker' in navigator) {
		const registration = await navigator.serviceWorker.getRegistration(REGISTRATION_FILE);
		if (registration) {
			await registration.unregister();
			caches.keys().then((names) => {
				for (const name of names) {
					caches.delete(name);
				}
			});
		}
	}
};
