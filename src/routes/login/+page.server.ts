import { redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
	if (locals.pb?.authStore.isValid) {
		redirect(303, '/');
	}
};

export const actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();

		try {
			await locals.pb
				.collection('users')
				.authWithPassword(formData.get('email'), formData.get('password'));

			// Check if the user is verified
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					status: 401,
					body: {
						notVerified: true,
						errorMessage:
							'Your account is not verified. Please check your email for the verification link.'
					}
				};
			}

			throw redirect(303, '/'); // Redirect after successful login
		} catch (err) {
			console.error('Error during login:', err?.data?.message);

			return {
				status: err?.status || 500,
				body: {
					errorMessage:
						err?.data?.message || 'An unexpected error occurred. Please try again later.'
				}
			};
		}
	},
	OAuth: async ({ cookies, url, locals }) => {
		const authMethods = await locals.pb?.collection('users').listAuthMethods();

		if (!authMethods?.authProviders?.length) {
			console.error('No authentication providers available.');
			return {
				status: 500,
				body: { error: 'No authentication providers available.' }
			};
		}

		const FacebookAuthProvider = authMethods.authProviders.find(
			(provider) => provider.name === 'facebook'
		);

		if (!FacebookAuthProvider) {
			console.error('Facebook OAuth provider not found.');
			return {
				status: 400,
				body: { error: 'Facebook OAuth provider not found.' }
			};
		}

		const state = FacebookAuthProvider.state;
		const verifier = FacebookAuthProvider.codeVerifier;

		// Save state and verifier in cookies
		cookies.set('state', state, {
			path: '/',
			httpOnly: true,
			secure: url.origin.startsWith('https'),
			maxAge: 600
		});
		cookies.set('verifier', verifier, {
			path: '/',
			httpOnly: true,
			secure: url.origin.startsWith('https'),
			maxAge: 600
		});

		const redirectURL = `${url.origin}/oauth`; // Ensure this matches your app's settings
		const authProviderRedirect = `${FacebookAuthProvider.authUrl}&redirect_uri=${encodeURIComponent(redirectURL)}`;

		console.log('Redirecting to:', authProviderRedirect);
		throw redirect(302, authProviderRedirect);
	}
};
