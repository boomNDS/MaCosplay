import { error } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import { createAdminClient } from '$lib/pocketbase';

export const load = async ({ locals }) => {

	const getItemList = async () => {
		const adminClient = await createAdminClient();
		try {
			// Fetch instances filtered by the current user's ID
			const instances = await adminClient.collection('itemList').getFullList({ expand: 'Image' });
			return serializeNonPOJOs(instances); // Serialize the instances
		} catch (err) {
			console.log('Error fetching user instances: ', err);
			throw error(err.status, err.message);
		}
	};

	if (locals.user) {
		return {
			user: locals.user,
			itemList: await getItemList(),
		};
	}

	return {
		user: undefined,
		itemList: await getItemList(), // Default to an empty array if user is not logged in
	};
};