import { defineEnvVars } from '@sveltejs/kit/env';

// BASIC_AUTH_* は未設定なら空文字列（= Basic認証を無効化）
export const variables = defineEnvVars({
	PUBLIC_SITE_URL: { public: true, static: true },
	BASIC_AUTH_USER: { schema: (input) => input ?? '' },
	BASIC_AUTH_PASSWORD: { schema: (input) => input ?? '' }
});
