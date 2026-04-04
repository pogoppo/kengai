import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';

export const handleBasicAuth: Handle = async ({ event, resolve }) => {
	const username = env.BASIC_AUTH_USER;
	const password = env.BASIC_AUTH_PASSWORD;

	// ビルド時（プリレンダリング）または環境変数が未設定の場合は認証をスキップ
	if (building || !username || !password) {
		return resolve(event);
	}

	const authHeader = event.request.headers.get('authorization');

	if (!authHeader) {
		return new Response('Authentication required', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Secure Area"'
			}
		});
	}

	const base64Credentials = authHeader.split(' ')[1];
	const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
	const [user, pass] = credentials.split(':');

	if (user === username && pass === password) {
		return resolve(event);
	}

	return new Response('Invalid credentials', {
		status: 401,
		headers: {
			'WWW-Authenticate': 'Basic realm="Secure Area"'
		}
	});
};
