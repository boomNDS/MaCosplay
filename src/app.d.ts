// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Record } from 'pocketbase';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Record | undefined;
			pb: import('pocketbase').default;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
