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
				filter: `public=True${searchQuery ? ` && Name ~ "${searchQuery}"` : ''} && userStore.slug="${params.shopID}"`,
				expand: 'user,userStore',
				sort: '-created'
			});

			const items = response.map(item => {
				if (item.expand?.user) {
					item.expand.user = {
						id: item.expand.user.id,
						name: item.expand.user.name,
						fbProfile: item.expand.user.fbProfile,
						VerifyShop: item.expand.user.VerifyShop,
						avatar: item.expand.user.avatar
					};
				}
				return item;
			});

			return {
				items: serializeNonPOJOs(items),
				totalPages: Math.ceil(response.length / perPage),
				currentPage: page
			};
		} catch (err) {
			console.log('Error fetching user instances: ', err);
			throw error(err.status || 500, err.message || 'Internal Server Error');
		}
	};

	const getStoreDetails = async (shopSlug) => {
		const adminClient = await createAdminClient();
		try {
			const instances = await adminClient.collection('userStore').getFullList({
				filter: `slug = "${shopSlug}"`,
				expand: 'user'
			});

			const storeDetails = instances.map(instance => {
				if (instance.expand?.user) {
					instance.expand.user = {
						id: instance.expand.user.id,
						name: instance.expand.user.name,
						fbProfile: instance.expand.user.fbProfile,
						VerifyShop: instance.expand.user.VerifyShop,
						avatar: instance.expand.user.avatar
					};
				}
				return instance;
			});

			return serializeNonPOJOs(storeDetails[0]);
		} catch (err) {
			console.log('Error fetching store details: ', err);
			throw error(err.status || 500, err.message || 'Internal Server Error');
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