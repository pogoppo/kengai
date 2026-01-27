import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build -- --mode test && npm run preview -- --mode test',
		port: 4173
	},
	testDir: 'e2e'
});
