import { error } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import { createAdminClient } from '$lib/pocketbase';
import PocketBase from 'pocketbase';

export const load = async ({ locals }) => {
	const adminClient = new PocketBase(import.meta.env.VITE_PB_URL);
	adminClient.autoCancellation(false)
	await adminClient.admins.authWithPassword(
		import.meta.env.VITE_AUTH_ADMIN_NAME,
		import.meta.env.VITE_AUTH_ADMIN_PASS,
		{
			// This will trigger auto refresh or auto reauthentication in case
			// the token has expired or is going to expire in the next 30 minutes.
			autoRefreshThreshold: 30 * 60
		}
	);
	const user = await adminClient.collection('users').getOne(locals.user.id);
	if(user.Upgrade === 1){
		adminClient.collection('users').update(locals.user.id, {
			VerifyShop: "ยืนยันร้านค้าแล้ว"
		});
	}


	const getUserInstances = async () => {
		const adminClient = await createAdminClient();

		try {
			// Fetch instances filtered by the current user's ID
			const instances = await adminClient.collection('userStore').getFullList({
				filter: `user = "${locals.user.id}"` // Adjust the field name as necessary
			});
			return serializeNonPOJOs(instances); // Serialize the instances
		} catch (err) {
			console.log('Error fetching user instances: ', err);
			throw error(err.status, err.message);
		}
	};

	if (locals.user) {
		return {
			user: locals.user,// Default to an empty array if undefined
			userStore: await getUserInstances(),
		};
	}

	return {
		user: undefined, // Default to an empty array if user is not logged in
	};
};