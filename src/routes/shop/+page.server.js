import { error } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import { createAdminClient } from '$lib/pocketbase';

export const load = async ({ locals, url }) => {
	const searchQuery = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1', 10); // Get the current page from query params
	const perPage = 10; // Define how many items per page

	const getItemList = async () => {
		const adminClient = await createAdminClient();
		try {
			// Fetch paginated instances filtered by the current user's ID
			const response = await adminClient.collection('itemList').getList(page, perPage, {
				filter: `public=True${searchQuery ? ` && Name ~ "${searchQuery}"` : ''}`,
				expand: 'user,userStore',
				sort: '-created'
			});
			return {
				items: serializeNonPOJOs(response.items), // Serialize the items
				totalPages: response.totalPages,
				currentPage: response.page
			};
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