import { error } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import { createAdminClient } from '$lib/pocketbase';

export const load = async ({ locals, params, url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const perPage = 10;

	const getItemList = async () => {
		const adminClient = await createAdminClient();
		try {
			const response = await adminClient.collection('itemList').getFullList({
				filter: `user = "${locals.user.id}" && public=True${searchQuery ? ` && Name ~ "${searchQuery}"` : ''} && userStore.slug="${params.shopID}"`,
				expand: 'user,userStore',
				sort: '-created'
			});

			return {
				items: serializeNonPOJOs(response),
				totalPages: Math.ceil(response.length / perPage),
				currentPage: page
			};
		} catch (err) {
			console.log('Error fetching user instances: ', err);
			throw error(err.status, err.message);
		}
	};

	const getStoreDetails = async (shopSlug) => {
		const adminClient = await createAdminClient();
		try {
			const instances = await adminClient.collection('userStore').getFullList({
				filter: `slug = "${shopSlug}"`
			});
			return serializeNonPOJOs(instances[0]);
		} catch (err) {
			console.log('Error fetching store details: ', err);
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
		StoreDetails: await getStoreDetails(params.shopID),
		itemList: await getItemList(),
	};
};