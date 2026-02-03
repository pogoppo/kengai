import type { Handle } from '@sveltejs/kit';
import { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } from '$env/static/private';

export const handleBasicAuth: Handle = async ({ event, resolve }) => {
	const username = BASIC_AUTH_USER;
	const password = BASIC_AUTH_PASSWORD;

	// 環境変数が設定されていない場合は認証をスキップ
	if (!username || !password) {
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
