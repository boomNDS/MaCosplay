import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';



export const GET = async ({ locals, url, cookies }) => {
	const adminClient = new PocketBase(import.meta.env.VITE_PB_URL);
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
		
		const resultList = await adminClient.collection('users').getList(1, 1, { sort: '-created' });
		console.log(serializeNonPOJOs(resultList?.items[0].UserNumber));
		const UserNumAdd = resultList?.items[0].UserNumber + 1;
		let UserNumber = UserNumAdd;

		// Exchange authorization code for an access token
		const authData = await locals.pb.collection('users').authWithOAuth2(
			provider.name, code, expectedVerifier, `${url.origin}/oauth`,
			{
				UserNumber: 0
			}
		);


		// Log the entire authData object
		console.log('Auth Data:', serializeNonPOJOs(authData));

		// Use fetchUserProfile to get user profile data
		const userProfile = await fetchUserProfile(authData.meta.accessToken);
		console.log('User Profile:', userProfile);



		// Extract email and avatar URL from userProfile
		const userEmail = userProfile.email;
		const userAvatarUrl = userProfile.picture.data.url;

		// Extract the Facebook ID from the userProfile
		const facebookId = userProfile.id;

		// Construct the Facebook profile URL using the ID
		const facebookProfileUrl = userProfile.link;



		// Fetch the avatar image as a Blob
		const avatarResponse = await fetch(userAvatarUrl);
		const avatarBlob = await avatarResponse.blob();
		const avatarFile = new File([avatarBlob], 'avatar.jpg', { type: avatarBlob.type });

		console.log(authData.record.id);
		// Fetch the user record to check the current UserNumber
		const userRecord = await adminClient.collection('users').getOne(authData.record.id);
		console.log('Fetched User Record:', userRecord);

		await adminClient.collection('users').update(authData.record.id, {
			avatar: avatarFile, // Pass the avatar as a File
			email: userEmail,
			UserNumber: UserNumber,
			MaxShop: 1,
			VerifyShop: "ยังไม่ได้ยืนยันร้านค้า",
			fbProfile: facebookProfileUrl // Add the Facebook profile URL
		});

		// Check if UserNumber is greater than 0
		if (authData.record.UserNumber > 0) {
			console.log('UserNumber already set:', UserNumber);
		} else {
			// Update user profile in PocketBase
			await adminClient.collection('users').update(authData.record.id, {
				avatar: avatarFile, // Pass the avatar as a File
				email: userEmail,
				UserNumber: UserNumber,
				MaxShop: 1,
				VerifyShop: "ยังไม่ได้ยืนยันร้านค้า",
				fbProfile: facebookProfileUrl // Add the Facebook profile URL
			});
			console.log('User profile updated successfully');
		}

	} catch (err) {
		console.error('Error Logging in with Facebook OAuth2:', err);
		throw redirect(303, '/login?error=oauth_failed');
	}
	throw redirect(303, '/manage-store');
};

// Function to fetch user profile using access token
async function fetchUserProfile(accessToken) {
	const response = await fetch('https://graph.facebook.com/v19.0/me?fields=id,name,email,picture,link&access_token=' + accessToken);
	if (!response.ok) {
		throw new Error('Failed to fetch user profile');
	}
	return await response.json();
}



