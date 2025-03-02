import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [
		sveltekit(),
		imagetools({
			defaultDirectives: new URLSearchParams({
				format: 'webp',
				w: '600',
				quality: '80'
			})
		})
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
