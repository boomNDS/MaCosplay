import PocketBase from 'pocketbase';

// Regular client
export const pb = new PocketBase(import.meta.env.VITE_PB_URL);

// Admin client creation function
export async function createAdminClient() {
	const adminClient = new PocketBase(import.meta.env.VITE_PB_URL);
	adminClient.autoCancellation(false);

	try {
		await adminClient.admins.authWithPassword(
			import.meta.env.VITE_AUTH_ADMIN_NAME,
			import.meta.env.VITE_AUTH_ADMIN_PASS,
			{
				autoRefreshThreshold: 30 * 60
			}
		);
		return adminClient;
	} catch (error) {
		console.error('Admin authentication failed:', error);
		throw error;
	}
}

// Helper function to convert URL to File
export async function urlToFile(url: string, filename: string): Promise<File> {
	const response = await fetch(url);
	const blob = await response.blob();
	return new File([blob], filename, { type: blob.type });
}
