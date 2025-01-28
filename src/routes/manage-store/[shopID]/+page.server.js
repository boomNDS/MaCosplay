import { error } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import { createAdminClient } from '$lib/pocketbase';

export const load = async ({ locals, params }) => {

	const getItemList = async () => {
		const adminClient = await createAdminClient();
		try {
			// Fetch instances filtered by the current user's ID
			const instances = await adminClient.collection('itemList').getFullList({
				filter: `user = "${locals.user.id}"` // Adjust the field name as necessary
			});
			return serializeNonPOJOs(instances); // Serialize the instances
		} catch (err) {
			console.log('Error fetching user instances: ', err);
			throw error(err.status, err.message);
		}
	};

	const getStoreDetails = async (shopID) => {
		try {
			// Fetch instances filtered by the shopID
			const instances = await locals.pb.collection('userStore').getOne(shopID);
			return serializeNonPOJOs(instances); // Serialize the instances
		} catch (err) {
			console.log('Error fetching user instances: ', err);
			throw error(err.status, err.message);
		}
	};

	if (locals.user) {
		return {
			user: locals.user,
			StoreDetails: await getStoreDetails(params.shopID),
			itemList: await getItemList(),
		};
	}

	return {
		user: undefined,
		StoreDetails: await getStoreDetails(params.shopID), // Pass shopID to the function
		itemList: await getItemList(),
	};
};