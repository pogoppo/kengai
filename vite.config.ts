import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { articleIndexPlugin } from './vite/plugins/article-index.ts';

export default defineConfig({
	optimizeDeps: {
		include: ['@fortawesome/svelte-fontawesome', '@fortawesome/free-solid-svg-icons', 'fuse.js']
	},
	plugins: [
		articleIndexPlugin(),
		sveltekit({
			preprocess: [vitePreprocess()],
			adapter: adapter(),
			serviceWorker: { register: false }
		}),
		devtoolsJson(),
		paraglideVitePlugin({ project: './project.inlang', outdir: './src/lib/paraglide' })
	],

	test: {
		expect: { requireAssertions: true },

		projects: [
			{
				test: {
					name: 'client',

					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},

					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
