import { error } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import { createAdminClient } from '$lib/pocketbase';

export const load = async ({ locals, params }) => {

	const getItemList = async (shopID) => {
		const adminClient = await createAdminClient();
		try {
			// Fetch instances filtered by the shopID
			const instances = await adminClient.collection('itemList').getFullList({
				filter: `id = "${shopID}"`,
				expand: 'Image'
			});
			return serializeNonPOJOs(instances); // Serialize the instances
		} catch (err) {
			console.log('Error fetching user instances: ', err);
			throw error(err.status, err.message);
		}
	};

	if (locals.user) {
		return {
			user: locals.user,
			itemList: await getItemList(params.shopID),
		};
	}

	return {
		user: undefined,
		itemList: await getItemList(params.shopID), // Pass shopID to the function
	};
};