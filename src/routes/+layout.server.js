import { error } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import { createAdminClient } from '$lib/pocketbase';

export const load = async ({ locals }) => {

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
		userStore: await getUserInstances(),
	};
};