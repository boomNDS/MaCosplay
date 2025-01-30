import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

const adminClient = new PocketBase(import.meta.env.VITE_PB_URL);

export const GET = async ({ locals, url, cookies }) => {
	console.log('OAUTH CALL');

	// Authenticate admin client
	await adminClient.admins.authWithPassword(
		import.meta.env.VITE_AUTH_ADMIN_NAME,
		import.meta.env.VITE_AUTH_ADMIN_PASS
	);

	// Extract state and code from URL
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	const expectedState = cookies.get('state');
	const expectedVerifier = cookies.get('verifier');

	// Check if Facebook is an available provider
	const authMethods = await locals.pb?.collection('users').listAuthMethods();
	if (!authMethods?.authProviders) {
		console.log('No Auth Providers');
		throw redirect(303, '/login');
	}

	// Find the Facebook OAuth provider
	const provider = authMethods.authProviders.find(p => p.name === "facebook");
	if (!provider) {
		console.log('Facebook Provider Not Found');
		throw redirect(303, '/login');
	}

	// Ensure the returned state matches the stored state
	if (expectedState !== state) {
		console.log('Returned State Does not Match Expected', expectedState, state);
		throw redirect(303, '/login');
	}

	try {
		// Exchange authorization code for an access token
		const authData = await locals.pb.collection('users').authWithOAuth2(
			provider.name, code, expectedVerifier, `${url.origin}/oauth`
		);

		// Log the entire authData object
		console.log('Auth Data:', serializeNonPOJOs(authData));

		// Extract email and avatar URL from authData
		const userEmail = authData.meta.email;
		const userAvatarUrl = authData.meta.avatarUrl;

		// Log the extracted values
		console.log('Extracted Email:', userEmail);
		console.log('Extracted Avatar URL:', userAvatarUrl);

		// Fetch the avatar image as a Blob
		const avatarResponse = await fetch(userAvatarUrl);
		const avatarBlob = await avatarResponse.blob();
		const avatarFile = new File([avatarBlob], 'avatar.jpg', { type: avatarBlob.type });


		// Update user profile in PocketBase
		await adminClient.collection('users').update(authData.record.id, {
			avatar: avatarFile, // Pass the avatar as a File
			email: userEmail
		});

		// Redirect after successful authentication
		
	} catch (err) {
		console.error('Error Logging in with Facebook OAuth2:', err);
		throw redirect(303, '/login?error=oauth_failed');
	}
	throw redirect(303, '/manage-store');
};

// Function to fetch user profile using access token
async function fetchUserProfile(accessToken) {
	const response = await fetch('https://graph.facebook.com/me?fields=id,name,email,picture&access_token=' + accessToken);
	if (!response.ok) {
		throw new Error('Failed to fetch user profile');
	}
	return await response.json();
}
